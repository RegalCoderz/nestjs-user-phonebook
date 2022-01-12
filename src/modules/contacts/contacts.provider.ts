import { Contact } from "src/models/contact/contact.model";


export const contactsProviders = [
  {
    provide: 'CONTACTS_REPOSITORY',
    useValue: Contact,
  },
];
