// src/controllers/users.controller.ts
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
import {
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('users')
@ApiTags('User')
export class UsersController {
  constructor(private userService: UsersService) {}

  //READ
  @Get(':username')
  @ApiParam({
    name: 'username',
    description: 'The username of the user to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the user with the specified username',
  })
  async getUsers(@Param('username') username: string) {
    const users = await this.userService.findUser(username);
    // console.log(users);
    return users;
  }

  @Get('email/:email')
  @ApiParam({
    name: 'email',
    description: 'The email of the user to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the user with the specified email',
  })
  async getUsersemail(@Param('email') email: string) {
    const users = await this.userService.findUseremail(email);
    console.log(users);
    return users;
  }

  //CREATE
  @Post('/register')
  @ApiResponse({
    status: 201,
    description: 'Registers a new user',
    type: createUserDto,
  })
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
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 204,
    description: 'Updates user by id',
  })
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: { username: string; email: string },
  ) {
    await this.userService.updateUser(id, userData);
  }

  //DELETE
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 204,
    description: 'Deletes user by id',
  })
  async deleteUserById(@Param('id', ParseIntPipe) id: number) {
    await this.userService.deleteUser(id);
  }
}
