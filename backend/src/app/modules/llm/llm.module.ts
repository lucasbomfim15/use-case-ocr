import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { LlmService } from './service/llm.service';

@Module({
  imports: [ConfigModule],
  providers: [LlmService],
  exports: [LlmService],
})
export class LlmModule {}
