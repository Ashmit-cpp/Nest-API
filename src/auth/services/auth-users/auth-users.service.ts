// src/auth/services/auth-users/auth-users.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SignDto } from 'src/users/dtos/sign.dto';

@Injectable()
export class AuthUsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async loginUser(signDto: SignDto): Promise<any> {
    const { username, password } = signDto;

    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      return user;
    } else {
      throw new NotFoundException('Invalid password');
    }
  }
}
