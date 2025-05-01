import { Module } from '@nestjs/common';
import { AuthModule } from './app/modules/auth/auth.module';
import { PrismaService } from './app/shared/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env';
import DocumentsModule from './app/modules/documents/documents.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot({
    validate: (env) => envSchema.parse(env),
    isGlobal: true,
  }), DocumentsModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
