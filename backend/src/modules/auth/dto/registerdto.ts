import { IsString, Matches, MaxLength, MinLength, Validate } from 'class-validator';
import { usernameValidationErrors, usernameValidationRules } from '../constants/username.constants';
import { passwordValidationErrors, passwordValidationRules } from '../constants/password.constants';
import { UniqueUsernameValidator } from 'src/validators/uniqueUsername/uniqueUsername.validators';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsString()
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
  @Validate(UniqueUsernameValidator)
  username: string;

  @IsString()
  @MinLength(passwordValidationRules.minLength, {
    message: passwordValidationErrors.minLength,
  })
  @ApiProperty()
  password: string;
}
