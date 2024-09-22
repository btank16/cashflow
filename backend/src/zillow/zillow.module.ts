import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { ZillowService } from './zillow.service';
import { ZillowController } from './zillow.controller';

@Module({
  imports: [HttpModule],
  providers: [ZillowService],
  controllers: [ZillowController]
})
export class ZillowModule {}
