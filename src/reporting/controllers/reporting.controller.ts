import { Controller, Get, Inject, Param } from '@nestjs/common';
import { REPORTING_SERVICE } from '../reporting-service.interface';

@Controller('reporting')
export class ReportingController {
  constructor(
    @Inject(REPORTING_SERVICE)
    private readonly reportingService: {
      report: (user: string, isDynamic: boolean) => Promise<string>;
    },
  ) {}

  @Get('dynamic/:username')
  async getDynamicReport(@Param('username') name: string) {
    return this.reportingService.report(name, true);
  }

  @Get('static/:username')
  async getStaticReport(@Param('username') name: string) {
    return this.reportingService.report(name, false);
  }
}
