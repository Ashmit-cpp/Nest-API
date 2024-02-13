// password-change.dto.ts

import { IsNotEmpty, MinLength } from 'class-validator';

export class PasswordChangeDto {
  @IsNotEmpty({ message: 'Current password cannot be empty' })
  currentPassword: string;

  @IsNotEmpty({ message: 'New password cannot be empty' })
  @MinLength(2, { message: 'Password must be at least 2 characters long' })
  newPassword: string;
}
