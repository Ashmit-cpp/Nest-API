
import { Module } from '@nestjs/common';
import { AuthUsersController } from './controllers/auth-users.controller';
import { AuthUsersService } from './services/auth-users/auth-users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthUsersController],
  providers: [AuthUsersService],
  exports: [AuthUsersService], // Export AuthUsersService to make it available in other modules
})
export class AuthModule {}
