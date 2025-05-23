import { Body, Controller, Put } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiPreconditionFailedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NoResponseDto } from '../../../../types/noResponse.dto';
import { UpdatePasswordByTokenUseCase } from '../../useCases/updatePasswordByToken/useCase';
import { UpdatePasswordByTokenRequestDto } from '../../useCases/updatePasswordByToken/request.dto';

@ApiTags('Auth')
@Controller('auth/forgot-password')
export class ResetPasswordByTokenController {
  constructor(
    private readonly updatePasswordByTokenUseCase: UpdatePasswordByTokenUseCase,
  ) {}

  @Put()
  @ApiOperation({
    summary: 'Request reset password',
    description: 'Request reset password',
  })
  @ApiOkResponse({
    description: 'Reseted password successfully',
    type: NoResponseDto,
  })
  @ApiPreconditionFailedResponse({
    description: 'User not found',
  })
  async resetPassword(
    @Body() body: UpdatePasswordByTokenRequestDto,
  ): Promise<NoResponseDto> {
    await this.updatePasswordByTokenUseCase.execute(body);
    return { ok: true };
  }
}
