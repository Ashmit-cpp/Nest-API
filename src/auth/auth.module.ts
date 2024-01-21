// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthUsersController } from './controllers/auth-users/auth-users.controller';
import { AuthUsersService } from './services/auth-users/auth-users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: 'your-secret-key', // Replace with your own secret key
      signOptions: { expiresIn: '1h' }, // Set the expiration time for the token
    }),
  ],
  controllers: [AuthUsersController],
  providers: [AuthUsersService, JwtStrategy],
  exports: [AuthUsersService, JwtModule],
})
export class AuthModule {}
