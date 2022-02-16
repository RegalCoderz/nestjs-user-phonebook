import { Module } from '@nestjs/common';
import { gPeopleApiService } from 'src/common/services/google-people-api/gPeopleApi.service';
import { ContactsController } from './contacts.controller';
import { contactsProviders } from './contacts.provider';
import { ContactsService } from './contacts.service';

@Module({
  providers: [ContactsService, ...contactsProviders, gPeopleApiService],
  controllers: [ContactsController]
})
export class ContactsModule {}
