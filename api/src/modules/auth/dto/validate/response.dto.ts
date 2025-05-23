import { ProviderEnum } from '../../../../db/models/user/provider.enum';

export class ValidateUserResponseDto {
  id: string;
  email: string;
  provider: ProviderEnum;
  name: string;
}
