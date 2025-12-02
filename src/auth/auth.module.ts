import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard.js';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      //Voltar aqui
      secret: 'akira',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
