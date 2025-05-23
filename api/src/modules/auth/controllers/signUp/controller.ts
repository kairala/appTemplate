import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateLocalUserRequestDto } from '../../useCases/createLocalUser/request.dto';
import { NoResponseDto } from '../../../../types/noResponse.dto';
import { CreateLocalUserUseCase } from '../../useCases/createLocalUser/useCase';

@Controller('auth/signup')
@ApiTags('Auth')
export class SignUpController {
  constructor(private readonly useCase: CreateLocalUserUseCase) {}

  @ApiOperation({
    summary: 'Sign up',
    description: 'Sign up',
  })
  @ApiBody({
    type: CreateLocalUserRequestDto,
    description: 'Sign up request',
  })
  @ApiCreatedResponse({
    description: 'Sign up response',
    type: NoResponseDto,
  })
  @Post()
  async signUp(
    @Body() signUpDto: CreateLocalUserRequestDto,
  ): Promise<NoResponseDto> {
    await this.useCase.execute(signUpDto);

    return {
      ok: true,
    };
  }
}
