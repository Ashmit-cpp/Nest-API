// src/controllers/auth-users.controller.ts
import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthUsersService } from 'src/auth/services/auth-users/auth-users.service';
import { SignDto } from 'src/utils/dtos/sign.dto';

@Controller('auth/users')
@ApiTags('Authentication')
export class AuthUsersController {
  constructor(private readonly authUsersService: AuthUsersService) {}

  @Post('/login')
  @ApiOperation({
    summary: 'Login user',
    description: 'Authenticate user and return user details',
  })
  @ApiParam({
    name: 'loginUserDto',
    description: 'The credentials of the user attempting to log in',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid credentials.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error. Something went wrong on the server.',
  })
  async loginUser(@Body(ValidationPipe) loginUserDto: SignDto) {
    // const { username, password } = loginUserDto;
    try {
      const user = await this.authUsersService.loginUser(loginUserDto);
      return user;
    } catch (error) {
      return { message: error.message };
    }
  }
}
