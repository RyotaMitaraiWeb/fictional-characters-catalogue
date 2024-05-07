import { SuccessfulAuthenticationDto } from './successfulAuthentication.dto';
import { TokensDto } from './tokens.dto';

export class SuccessfulAuthenticationResponseDto {
  user: SuccessfulAuthenticationDto;
  tokens: TokensDto;
}
