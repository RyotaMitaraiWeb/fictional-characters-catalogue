import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { AuthService } from 'src/modules/auth/auth.service';

@ValidatorConstraint({ name: 'userAlreadyExists', async: true })
@Injectable()
export class UniqueUsernameValidator implements ValidatorConstraintInterface {
  constructor(private readonly authService: AuthService) {}
  async validate(value: any): Promise<boolean> {
    const username = value as string;

    const exists = await this.authService.usernameExists(username);
    return !exists;
  }

  defaultMessage?(validationArguments?: ValidationArguments | undefined): string {
    return `Username "${validationArguments?.value || ''}" already exists`;
  }
}
