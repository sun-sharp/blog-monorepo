import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CapitalModule } from './modules/capital/capital.module';

@Module({
  imports: [CapitalModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
