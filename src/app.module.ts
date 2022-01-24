import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { AuthModule } from './auth/auth.module';
import { PasswordModule } from './auth/password/password.module';
import { DatabaseModule } from './database/database.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    PasswordModule,
    UsersModule,
    DatabaseModule,
    AuthModule,
    ContactsModule,
    ConfigModule.forRoot(),
    GoogleRecaptchaModule.forRoot({
      secretKey: '6LedDx4eAAAAANY-lJ4ZPdcYPRR8PR4UZKnkPw-c',
      response: (req) => req.headers.recaptcha,
      skipIf: process.env.NODE_ENV !== 'production',
      score: 0.5,
      actions: [],
    }),
  ],
})
export class AppModule {}