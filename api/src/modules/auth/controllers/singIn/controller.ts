import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SignInRequestDto } from '../../useCases/signIn/request.dto';
import { TokensDto } from '../../dto/tokens/token.dto';
import { SignInUseCase } from '../../useCases/signIn/useCase';

@ApiTags('Auth')
@Controller('auth/signin')
export class SignInController {
  constructor(private readonly signInUseCase: SignInUseCase) {}

  @Post()
  @ApiBody({
    type: SignInRequestDto,
    description: 'Sign in request',
  })
  @ApiUnauthorizedResponse({
    description: 'The user credentials are invalid',
  })
  @ApiOkResponse({
    description: 'Sign in response',
    type: TokensDto,
  })
  async signIn(@Body() signInDto: SignInRequestDto): Promise<TokensDto> {
    return this.signInUseCase.execute(signInDto);
  }
}
