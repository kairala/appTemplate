import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiPreconditionFailedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateForgotPasswordTokenUseCase } from '../../useCases/createForgotPasswordToken/useCase';
import { CreateForgotPasswordTokenRequestDto } from '../../useCases/createForgotPasswordToken/request.dto';
import { NoResponseDto } from '../../../../types/noResponse.dto';

@ApiTags('Auth')
@Controller('auth/forgot-password')
export class RequestForgotPasswordController {
  constructor(
    private readonly createForgotPasswordTokenUseCase: CreateForgotPasswordTokenUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Request forgot password',
    description: 'Request forgot password',
  })
  @ApiOkResponse({
    description: 'Forgot password token sent successfully',
    type: NoResponseDto,
  })
  @ApiPreconditionFailedResponse({
    description: 'User not found',
  })
  async requestForgotPassword(
    @Body() body: CreateForgotPasswordTokenRequestDto,
  ): Promise<NoResponseDto> {
    await this.createForgotPasswordTokenUseCase.execute(body);
    return { ok: true };
  }
}
