import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UseCase } from '../../../../../types/useCase.interface';
import { GenerateCaptionRequestDto } from './request.dto';
import { INVISION_PROVIDER, OPEN_AI_PROVIDER } from '../../config/providers';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { InjectModel } from '@nestjs/sequelize';
import OpenAI from 'openai';
import { Caption } from '../../../../../db/models/caption/caption.model';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../../../../../db/models/user/user.model';
import { StripeCustomer } from '../../../../../db/models/user/stripeCustomer.model';
import { PlanEnum } from '../../../../../db/models/user/plans.enum';
import { ShowFileUseCase } from '../../../../storage/useCase/show/useCase';
import { ConfigService } from '@nestjs/config';
import { CaptionDto } from '../../dto/base.dto';

type Params = {
  userId: string;
  body: GenerateCaptionRequestDto;
};

const GPT_MODEL = 'gpt-4';

@Injectable()
export class GenerateCaptionUseCase implements UseCase<Params, CaptionDto> {
  constructor(
    @Inject(INVISION_PROVIDER)
    private readonly vision: ImageAnnotatorClient,
    @Inject(OPEN_AI_PROVIDER)
    private readonly openAi: OpenAI,
    @InjectModel(Caption)
    private readonly captionModel: typeof Caption,
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly sequelize: Sequelize,
    private readonly showFileUseCase: ShowFileUseCase,
    private readonly configService: ConfigService,
  ) {}

  async execute({ userId, body }: Params): Promise<CaptionDto> {
    return this.sequelize.transaction(async (transaction) => {
      const captionsToday = await this.captionModel.count({
        where: {
          userId,
          createdAt: {
            [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
            [Op.lt]: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
        transaction,
        useMaster: true,
      });

      const user = await this.userModel.findByPk(userId, {
        include: [
          {
            model: StripeCustomer,
            attributes: ['currentPlan'],
          },
        ],
        transaction,
      });

      if (!user) {
        throw new NotFoundException();
      }

      const stripeCustomer = user.stripeCustomer;
      const plan = stripeCustomer?.currentPlan || PlanEnum.FREE;

      if (plan === PlanEnum.FREE) {
        if (captionsToday >= 2) {
          throw new BadRequestException(
            'Você atingiu o limite de 2 legendas por dia no plano gratuito.',
          );
        }
      }

      if (plan === PlanEnum.GOLD) {
        if (captionsToday >= 5) {
          throw new BadRequestException(
            'Você atingiu o limite de 5 legendas por dia no plano Gold.',
          );
        }
      }

      const file = await this.showFileUseCase.execute({
        id: body.storageFileId,
      });

      const cloudFrontUrl =
        this.configService.getOrThrow<string>('CLOUDFRONT_URL');

      const start = new Date(Date.now());
      const [result] = await this.vision.labelDetection(
        `${cloudFrontUrl}/${file.providerRef}`,
      );

      const labels = (result.labelAnnotations as any)
        .map((label: any) => label.description)
        .join(', ');

      let keywordsString = '';
      const joinedKeywords = body.keywords?.join(', ');
      if (plan !== PlanEnum.FREE && body.keywords?.length) {
        keywordsString = `, e as palavras-chave: ${joinedKeywords}`;
      }

      const prompt = `
      Você é um gerador de legendas de redes sociais. Crie uma legenda para uma imagem com os seguintes elementos: ${labels}${keywordsString}.
      Estilo: ${body.style}. Rede social: ${body.network}.
      Use até ${plan !== PlanEnum.FREE ? body.numberOfCharacters || 150 : 150} caracteres e inclua até 2 hashtags no final.`;

      const completion = await this.openAi.responses.create({
        model: GPT_MODEL,
        temperature: 0.8,
        input: prompt,
      });
      const end = new Date(Date.now());

      const createdCaption = await this.captionModel.create({
        storageFileId: file.id,
        usedPrompt: prompt,
        text: completion.output_text,
        processingTime: end.getTime() - start.getTime(),
        style: body.style,
        network: body.network,
        keywords: body.keywords || [],
        labels: (result.labelAnnotations as any).map(
          (label: any) => label.description,
        ),
        caption: completion.output_text,
        executionTime: end.getTime() - start.getTime(),
        userId: user.id,
      });

      return {
        id: createdCaption.id,
        userId: createdCaption.userId,
        text: createdCaption.text,
        style: createdCaption.style,
        network: createdCaption.network,
        storageFileId: createdCaption.storageFileId,
        processingTime: createdCaption.processingTime,
      };
    });
  }
}
