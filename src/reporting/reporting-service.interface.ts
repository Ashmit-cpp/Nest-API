import { User } from 'src/typeorm/entities/user.entity';

export const REPORTING_SERVICE = 'REPORTING SERVICE';

export interface IReportingService {
  report(user: string): Promise<User | string>;
}
