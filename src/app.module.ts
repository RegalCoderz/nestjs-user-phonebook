import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
    ConfigModule.forRoot()
  ],
})
export class AppModule {}
