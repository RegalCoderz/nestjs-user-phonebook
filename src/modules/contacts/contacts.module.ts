import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { contactsProviders } from './contacts.provider';
import { ContactsService } from './contacts.service';

@Module({
  providers: [ContactsService, ...contactsProviders],
  controllers: [ContactsController]
})
export class ContactsModule {}
