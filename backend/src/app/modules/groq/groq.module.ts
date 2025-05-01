import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { GroqService } from './service/groq.service';


@Module({
  imports: [ConfigModule.forRoot()],
  providers: [GroqService],
  exports: [GroqService],
})
export class GroqModule {}
