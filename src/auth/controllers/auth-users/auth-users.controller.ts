// src/modules/auth/controllers/auth-users.controller.ts
import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthUsersService } from 'src/auth/services/auth-users/auth-users.service';
import { SignDto } from 'src/utils/dtos/sign.dto';

@Controller('auth/users')
export class AuthUsersController {
  constructor(private readonly authUsersService: AuthUsersService) {}

  @Post('/login')
  async loginUser(@Body(ValidationPipe) loginUserDto: SignDto) {
    const { username, password } = loginUserDto;
    try {
      const user = await this.authUsersService.loginUser(loginUserDto);
      return user;
    } catch (error) {
      return { message: error.message };
    }
  }
}
