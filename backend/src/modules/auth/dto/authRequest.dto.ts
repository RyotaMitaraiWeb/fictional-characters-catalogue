import { IsString, MaxLength, MinLength } from 'class-validator';
import { usernameValidationRules } from '../constants/username.constants';

export class AuthRequestDto {
  @IsString()
  @MinLength(usernameValidationRules.minLength)
  @MaxLength(usernameValidationRules.maxLength)
  username: string;

  @IsString()
  password: string;
}
