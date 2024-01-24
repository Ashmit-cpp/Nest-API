import { Module } from '@nestjs/common';
import { ReportingController } from './controllers/reporting.controller';
import { StaticReportingService } from './services/static-reporting.service';
import { DynamicReportingService } from './services/dynamic-reporting.service';
import { REPORTING_SERVICE } from './reporting-service.interface';
import { UsersService } from 'src/users/services/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [ReportingController],
  providers: [
    {
      provide: REPORTING_SERVICE,
      // useClass: DynamicReportingService,
      useFactory: (
        staticService: StaticReportingService,
        dynamicService: DynamicReportingService,
      ) => {
        return {
          report: (user: string, isDynamic: boolean) =>
            (isDynamic ? dynamicService : staticService).report(user),
          // report: dynamicService.report,
          // report: staticService.report,
        };
      },
      inject: [StaticReportingService, DynamicReportingService],
    },
    StaticReportingService,
    DynamicReportingService,
    UsersService,
  ],
})
export class ReportingModule {}
