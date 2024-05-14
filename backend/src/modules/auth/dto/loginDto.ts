import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { usernameValidationErrors, usernameValidationRules } from '../constants/username.constants';
import { passwordValidationErrors, passwordValidationRules } from '../constants/password.constants';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @MinLength(usernameValidationRules.minLength, {
    message: usernameValidationErrors.minLength,
  })
  @MaxLength(usernameValidationRules.maxLength, {
    message: usernameValidationErrors.maxLength,
  })
  @Matches(usernameValidationRules.pattern, {
    message: usernameValidationErrors.pattern,
  })
  @ApiProperty()
  username: string;

  @IsString()
  @MinLength(passwordValidationRules.minLength, {
    message: passwordValidationErrors.minLength,
  })
  @ApiProperty()
  password: string;
}
