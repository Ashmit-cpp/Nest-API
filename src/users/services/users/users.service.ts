import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user.entity';
import { CreateUserParams, UpdateUserParams } from 'src/utils/types';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PasswordChangeDto } from 'src/utils/dtos/password-change.dto';

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
  async findByUserId(id: number): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id } });
    console.log(user);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(userDetails: CreateUserParams) {
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

  updateUser(
    id: number,
    updateUserDetails: { username: string; email: string },
  ) {
    return this.userRepository.update({ id }, { ...updateUserDetails });
  }
  deleteUser(id: number) {
    return this.userRepository.delete({ id });
  }

  async changePassword(
    userId: number,
    passwordChangeDto: PasswordChangeDto,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      passwordChangeDto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new NotFoundException('Current password is incorrect.');
    }

    const hashedPassword = await bcrypt.hash(passwordChangeDto.newPassword, 10);
    user.password = hashedPassword;

    await this.userRepository.save(user);
  }
}
