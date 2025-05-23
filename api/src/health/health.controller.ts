import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  SequelizeHealthIndicator,
} from '@nestjs/terminus';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller({
  path: '/health',
})
@ApiTags('Health')
export class HealthController {
  constructor(
    private db: SequelizeHealthIndicator,
    private health: HealthCheckService,
  ) {}

  @ApiOperation({
    summary: 'Check if the server is alive',
    description: 'Check if the server is alive',
  })
  @HealthCheck()
  @Get()
  isAlive() {
    return this.health.check([]);
  }

  @ApiOperation({
    summary: 'Check if the server is ready',
    description: 'Check if the server is ready',
  })
  @Get('ready')
  @HealthCheck()
  async isReady() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }
}
