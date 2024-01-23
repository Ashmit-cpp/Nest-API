import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { createUserDto } from 'src/utils/dtos/CreateUser.dto';
import { UpdateUserDto } from 'src/utils/dtos/UpdateUser.dto';
import { UsersService } from 'src/users/services/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('User')
export class UsersController {
  constructor(private userService: UsersService) {}
  //READ
  @Get(':username')
  async getUsers(@Param('username') username: string) {
    const users = await this.userService.findUser(username);
    console.log(users);
    return users;
  }
  //CREATE
  @Post('/register')
  createUser(@Body() CreateUserDto: createUserDto) {
    return this.userService.createUser(CreateUserDto);
  }
  //LOGIN
  @Post('/login')
  async loginUser(@Body() loginUserDto: createUserDto) {
    const { username, email, password } = loginUserDto;
    const user = await this.userService.findUser(username);
    if (!user) {
      return { message: 'User not found' };
    }
    console.log('password', password, '  ', 'user.password', user[0].password);
    const passwordMatch = await bcrypt.compare(password, user[0].password);
    if (passwordMatch) {
      return user;
    } else {
      return { message: 'Invalid password' };
    }
  }

  //UPDATE
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.userService.updateUser(id, updateUserDto);
  }
  //DELETE
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUserById(@Param('id', ParseIntPipe) id: number) {
    await this.userService.deleteUser(id);
  }
}
