// src/modules/auth/services/auth-users/auth-users.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/typeorm/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { SignDto } from 'src/utils/dtos/sign.dto';

@Injectable()
export class AuthUsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async loginUser(signDto: SignDto): Promise<any> {
    const { username, password } = signDto;

    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const payload = { sub: user.id, username: user.username };
      const accessToken = this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async validateUser(username: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({ where: { username } });
      return user || null;
    } catch (error) {
      return null;
    }
  }
}
