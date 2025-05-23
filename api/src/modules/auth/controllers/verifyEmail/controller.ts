import { Body, Controller, Put } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiPreconditionFailedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { VerifyEmailUseCase } from '../../useCases/verifyEmail/useCase';
import { VerifyEmailRequestDto } from '../../useCases/verifyEmail/request.dto';
import { NoResponseDto } from '../../../../types/noResponse.dto';

@ApiTags('Auth')
@Controller('auth/confirmation-token')
export class VerifyEmailController {
  constructor(private readonly verifyEmailUseCase: VerifyEmailUseCase) {}

  @Put()
  @ApiOperation({
    summary: 'Verify email',
    description: 'Verify email',
  })
  @ApiOkResponse({
    description: 'Verify email response',
    type: NoResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found with the given token',
  })
  @ApiPreconditionFailedResponse({
    description: 'Confirmation token expired',
  })
  async verifyEmail(
    @Body() request: VerifyEmailRequestDto,
  ): Promise<NoResponseDto> {
    await this.verifyEmailUseCase.execute(request);

    return {
      ok: true,
    };
  }
}
