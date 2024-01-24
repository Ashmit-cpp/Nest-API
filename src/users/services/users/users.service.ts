import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { createUserDto } from 'src/utils/dtos/CreateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findUser(username: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ username });
      return user;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async createUser(userDetails: createUserDto) {
    try {
      // Check if user already exists by email or username
      const existingUser = await this.userRepository.findOne({
        where: [
          { email: userDetails.email },
          { username: userDetails.username },
        ],
      });

      if (existingUser) {
        throw new ConflictException(
          'User with the same email or username already exists.',
        );
      }

      const hashedPassword = await bcrypt.hash(userDetails.password, 10);
      const newUser = this.userRepository.create({
        ...userDetails,
        password: hashedPassword,
      });

      return this.userRepository.save(newUser);
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: number, updateUserDetails: createUserDto) {
    try {
      const result = await this.userRepository.update(
        { id },
        { ...updateUserDetails },
      );

      if (result.affected === 0) {
        throw new NotFoundException('User not found');
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: number) {
    try {
      const result = await this.userRepository.delete({ id });

      if (result.affected === 0) {
        throw new NotFoundException('User not found');
      }

      return result;
    } catch (error) {
      throw error;
    }
  }
}
