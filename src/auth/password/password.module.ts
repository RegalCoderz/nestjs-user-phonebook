import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { passwordProviders } from './password.providers';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: 'dc48826d43f617',
          pass: 'c312f5ca1d8ace',
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
    }),
  ],
  providers: [...passwordProviders],
  exports: [...passwordProviders],
})
export class PasswordModule {}