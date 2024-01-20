import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { CreateUserParams, UpdateUserParams } from 'src/utils/types';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findUser(username: string): Promise<any> {
    const user = await this.userRepository.findBy({ username });

    if (!user || user.length === 0) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(userDetails: CreateUserParams) {
    //check if user already exists here
    const hashedPassword = await bcrypt.hash(userDetails.password, 10);
    const newUser = this.userRepository.create({
      email: userDetails.email,
      username: userDetails.username,
      password: hashedPassword,
      createdAt: new Date(),
    });
    return this.userRepository.save(newUser);
  }

  updateUser(id: number, updateUserDetails: UpdateUserParams) {
    return this.userRepository.update({ id }, { ...updateUserDetails });
  }
  deleteUser(id: number) {
    return this.userRepository.delete({ id });
  }
}
