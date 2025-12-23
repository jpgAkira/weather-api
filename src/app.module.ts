import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module.js';
import { PrismaService } from './prisma/prisma.service.js';
import { AuthModule } from './auth/auth.module.js';
import { CityModule } from './city/city.module.js';

@Module({
  imports: [UserModule, AuthModule, CityModule],
  providers: [PrismaService],
})
export class AppModule {}
