import { Injectable } from '@nestjs/common';
import { IReportingService } from '../reporting-service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DynamicReportingService implements IReportingService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  public async report(username: string): Promise<User | string> {
    try {
      const user = await this.userRepository.findOneBy({ username });
      console.log(user);
      return user;
    } catch (error) {
      return 'can not get';
    }
  }
}
