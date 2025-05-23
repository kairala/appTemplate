import { Inject, Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import { SendEmailUseCase } from './sendEmail.useCase';
import { UseCase } from '../../../types/useCase.interface';
import { I18nService } from 'nestjs-i18n';

type Params = {
  variables: Record<string, unknown>;
  subject: string;
  to: string;
  templateName: string;
};

@Injectable()
export class SendTemplateEmailUseCase implements UseCase<Params, void> {
  private readonly logger = new Logger(SendTemplateEmailUseCase.name);
  private templates: Record<string, HandlebarsTemplateDelegate> = {};

  constructor(
    @Inject() private readonly sendEmailUseCase: SendEmailUseCase,
    private readonly i18nService: I18nService,
  ) {}

  public async execute({
    variables,
    subject,
    to,
    templateName,
  }: Params): Promise<void> {
    const template = this.loadTemplate(templateName);

    return this.sendEmailUseCase.execute({
      message: template(variables),
      subject,
      to,
    });
  }

  private loadTemplate(templateName: string) {
    if (this.templates[templateName]) {
      this.logger.debug('cache hit');
      return this.templates[templateName];
    }

    this.logger.debug('cache miss');
    const baseFilePath = path.join(__dirname, 'templates', 'base', 'base.hbs');
    const headerFilePath = path.join(
      __dirname,
      'templates',
      'base',
      'header.hbs',
    );
    const footerFilePath = path.join(
      __dirname,
      'templates',
      'base',
      'footer.hbs',
    );

    const filePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
    const baseFile = fs.readFileSync(baseFilePath).toString();
    const headerFile = fs.readFileSync(headerFilePath).toString();
    const footerFile = fs.readFileSync(footerFilePath).toString();
    const file = fs.readFileSync(filePath).toString();

    const compiledContentFile = handlebars.compile(file);
    const compiledHeaderFile = handlebars.compile(headerFile);
    const compiledFooterFile = handlebars.compile(footerFile);
    handlebars.registerPartial('header', compiledHeaderFile);
    handlebars.registerPartial('footer', compiledFooterFile);
    handlebars.registerPartial('content', compiledContentFile);
    handlebars.registerHelper('$t', (key: string, options: any) => {
      return this.i18nService.t(key, options);
    });

    const compiledFile = handlebars.compile(baseFile);

    this.templates[templateName] = compiledFile;

    return compiledFile;
  }
}
