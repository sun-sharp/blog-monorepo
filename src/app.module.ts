import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CapitalModule } from './modules/capital/capital.module';
import { FileModule } from './modules/file/file.module';

@Module({
  imports: [CapitalModule, FileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
