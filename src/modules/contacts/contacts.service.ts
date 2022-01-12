import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Contact } from 'src/models/contact/contact.model';
import { ContactDTO } from './dto/Contact.dto';

@Injectable()
export class ContactsService {
  constructor(
    @Inject('CONTACTS_REPOSITORY')
    private contactRepository: typeof Contact,
  ) {}

  async findAll(user_id: number): Promise<Contact[]> {
    return await this.contactRepository.findAll({ where: { user_id } });
  }

  async findOneContact(id: number, user_id: number): Promise<Contact> {
    return await this.contactRepository.findOne({ where: { id, user_id } });
  }

  async findFvtContacts(user_id: number): Promise<Contact[]> {
    return await this.contactRepository.findAll({
      where: {
        user_id,
        is_favorite: true,
      },
    });
  }

  async addFvtContacts(id: number, user_id: number): Promise<Contact> {
    const contact = await this.findOneContact(id, user_id);

    if (!contact.is_favorite) {
      contact.is_favorite = true;
      contact.save();
    } else {
      throw new BadRequestException('Contact is already favorite');
    }
    return contact;
  }

  async removeFvtContacts(id: number, user_id: number): Promise<any> {
    const contact = await this.findOneContact(id, user_id);
    if (contact.is_favorite) {
      contact.is_favorite = false;
      contact.save();
    } else {
      throw new BadRequestException('Contact is already unfavorite');
    }
    return contact;
  }

  async createContact(contact: ContactDTO, user_id: number): Promise<Contact> {
    return await this.contactRepository.create({ ...contact, user_id });
  }

  async updateContact(
    id: number,
    user_id: number,
    updatedContact: ContactDTO,
  ): Promise<Contact> {
    await this.contactRepository.update(updatedContact, {
      where: { id, user_id },
    });

    const contact: Contact = await this.contactRepository.findOne({
      where: { id },
    });
    return contact;
  }

  async deleteContact(id: number, user_id: number): Promise<Contact> {
    const contact = await this.findOneContact(id, user_id);
    await this.contactRepository.destroy({
      where: {
        id,
        user_id,
      },
    });
    return contact;
  }
}
