import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { PasswordModule } from './modules/auth/password/password.module';
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
