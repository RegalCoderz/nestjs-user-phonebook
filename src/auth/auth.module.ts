import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../modules/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordModule } from './password/password.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    PasswordModule,
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '30d' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}