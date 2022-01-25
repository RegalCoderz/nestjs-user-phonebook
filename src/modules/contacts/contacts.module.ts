import { Module } from '@nestjs/common';
import { FirebaseStorageService } from 'src/common/services/firebase-storage.service';
import { ContactsController } from './contacts.controller';
import { contactsProviders } from './contacts.provider';
import { ContactsService } from './contacts.service';

@Module({
  providers: [ContactsService, ...contactsProviders, FirebaseStorageService],
  controllers: [ContactsController],
})
export class ContactsModule {}
