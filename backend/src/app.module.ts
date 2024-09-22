import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ZillowModule } from './zillow/zillow.module';

@Module({
  imports: [ZillowModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
