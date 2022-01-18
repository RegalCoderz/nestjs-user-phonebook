import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GoogleRecaptchaModule, GoogleRecaptchaNetwork } from '@nestlab/google-recaptcha';
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
      secretKey: 'google-recaptcha-secret-key',
      response: (req) => req.headers.recaptcha,
      skipIf: process.env.NODE_ENV !== 'production',
      network: GoogleRecaptchaNetwork.Recaptcha,
    }),
  ],
})
export class AppModule {}
