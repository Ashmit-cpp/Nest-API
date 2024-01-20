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
} from '@nestjs/common';
import { createUserDto } from 'src/users/dtos/CreateUser.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
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
    // const { ...userDetails, confirmPassword } = createUserDto;
    return this.userService.createuser(CreateUserDto);
  }
  //LOGIN
  @Post('/login')
  loginUser(@Body() CreateUserDto: createUserDto) {
    console.log({ createUserDto });
    const user = this.userService.findUser('test6');
    return user;
  }

  //UPDATE
  @Patch(':id')
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.userService.updateUser(id, updateUserDto);
  }
  //DELETE
  @Delete(':id')
  async deleteUserById(@Param('id', ParseIntPipe) id: number) {
    await this.userService.deleteUser(id);
  }
}
