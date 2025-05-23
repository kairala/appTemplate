import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateConfirmationTokenUseCase } from '../../useCases/createConfirmationToken/useCase';
import { CreateConfirmationTokenRequestDto } from '../../useCases/createConfirmationToken/request.dto';
import { NoResponseDto } from '../../../../types/noResponse.dto';

@ApiTags('Auth')
@Controller('auth/confirmation-token')
export class ResendConfirmationTokenController {
  constructor(
    private readonly resendConfirmationTokenUseCase: CreateConfirmationTokenUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Resend confirmation token',
  })
  @ApiBody({
    type: CreateConfirmationTokenRequestDto,
    description: 'Email of the user to send the confirmation token to',
  })
  @ApiCreatedResponse({
    description: 'Confirmation token resent successfully',
    type: NoResponseDto,
  })
  async execute(
    @Body() body: CreateConfirmationTokenRequestDto,
  ): Promise<NoResponseDto> {
    await this.resendConfirmationTokenUseCase.execute(body);

    return {
      ok: true,
    };
  }
}
