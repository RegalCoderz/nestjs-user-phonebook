import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { Contact } from 'src/models/contact/contact.model';
import { ContactDTO } from './dto/Contact.dto';
import { GetContactsFilterDTO } from './dto/GetContactsFilter.dto';

@Injectable()
export class ContactsService {
  constructor(
    @Inject('CONTACTS_REPOSITORY')
    private contactRepository: typeof Contact,
  ) {}

  async findAll(user_id: number): Promise<Contact[]> {
    return await this.contactRepository.findAll({ where: { user_id } });
  }

  async findAllContactsWithFilters(
    contactFilterDto: GetContactsFilterDTO,
    user_id: number,
  ): Promise<any> {
    const { first_name, last_name, city, country } = contactFilterDto;

    const whereClause: { [key: string]: any } = {};

    if (first_name) {
      whereClause.first_name = {
        [Op.like]: `%${first_name}%`,
      };
    }
    if (last_name) {
      whereClause.last_name = {
        [Op.like]: `%${last_name}%`,
      };
    }
    if (city) {
      whereClause.city = {
        [Op.like]: `%${city}%`,
      };
    }
    if (country) {
      whereClause.country = {
        [Op.like]: `%${country}%`,
      };
    }

    return this.contactRepository.findAll({
      where: {
        user_id,
        ...whereClause,
      },
    });
  }

  async findOneContact(id: number, user_id: number): Promise<Contact> {
    return await this.contactRepository.findOne({ where: { id, user_id } });
  }

  async findFavoriteContacts(user_id: number): Promise<Contact[]> {
    return await this.contactRepository.findAll({
      where: {
        user_id,
        is_favorite: true,
      },
    });
  }

  async addToFavorite(id: number, user_id: number): Promise<Contact> {
    const contact = await this.findOneContact(id, user_id);

    if (!contact.is_favorite) {
      contact.is_favorite = true;
      contact.save();
    } else {
      throw new BadRequestException('Contact is already favorite');
    }
    return contact;
  }

  async removeFromFavorite(id: number, user_id: number): Promise<any> {
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

  uploadContactAvatar(id: number, user_id: number, avatar_path: string): Promise<any> {
    const avatar =  this.contactRepository.update(
      { avatar_path },
      { where: { id, user_id } },
    );
    return avatar;
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