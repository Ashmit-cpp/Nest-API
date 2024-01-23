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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiParam, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('User')
export class UsersController {
  constructor(private userService: UsersService) {}

  // READ
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
    console.log(users);
    return users;
  }

  // CREATE
  @Post('/register')
  @ApiResponse({
    status: 201,
    description: 'Registers a new user',
    type: createUserDto, 
  })
  createUser(@Body() CreateUserDto: createUserDto) {
    return this.userService.createUser(CreateUserDto);
  }

  // UPDATE
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 204,
    description: 'Updates user by id',
  })
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.userService.updateUser(id, updateUserDto);
  }

  // DELETE
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
