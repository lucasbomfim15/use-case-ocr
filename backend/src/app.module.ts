import { Module } from '@nestjs/common';
import { AuthModule } from './app/modules/auth/auth.module';
import { PrismaService } from './app/shared/prisma/prisma.service';

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
