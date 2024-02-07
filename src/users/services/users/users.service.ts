import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user.entity';
import { CreateUserParams, UpdateUserParams } from 'src/utils/types';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findUser(username: string): Promise<any> {
    console.log(username);
    const user = await this.userRepository.findBy({ username });

    if (!user || user.length === 0) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
  async findUseremail(email: string): Promise<any> {
    // console.log(email);
    const user = await this.userRepository.findOneBy({ email });

    // if (!user || user.length === 0) {
    //   throw new NotFoundException('User not found');
    // }

    return user;
  }

  async createUser(userDetails: CreateUserParams) {
    // Check if user already exists by email or username
    const existingUser = await this.userRepository.findOne({
      where: [{ email: userDetails.email }, { username: userDetails.username }],
    });

    if (existingUser) {
      throw new Error('User with the same email or username already exists.');
    }

    const hashedPassword = await bcrypt.hash(userDetails.password, 10);
    const newUser = this.userRepository.create({
      ...userDetails,
      password: hashedPassword,
    });

    return this.userRepository.save(newUser);
  }

  updateUser(id: number, updateUserDetails: { username: string; email: string }) {
    return this.userRepository.update({ id }, { ...updateUserDetails });
  }
  deleteUser(id: number) {
    return this.userRepository.delete({ id });
  }
}
