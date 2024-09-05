import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { ZillowService } from './zillow.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [ZillowService],
})
export class ZillowModule {}
