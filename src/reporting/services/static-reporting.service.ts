import { Injectable } from '@nestjs/common';
import { IReportingService } from '../reporting-service.interface';
import { User } from 'src/typeorm/entities/user.entity';

@Injectable()
export class StaticReportingService implements IReportingService {
  public async report(user: string): Promise<User | string> {
    return `static data for ${user}`;
  }
}
