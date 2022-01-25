import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { FirebaseStorageService } from 'src/common/services/firebase-storage.service';
import { Contact } from 'src/models/contact/contact.model';
import { ContactDTO } from './dto/Contact.dto';
import { GetContactsFilterDTO } from './dto/GetContactsFilter.dto';

@Injectable()
export class ContactsService {
  constructor(
    @Inject('CONTACTS_REPOSITORY')
    private contactRepository: typeof Contact,
    private firebaseStorageService: FirebaseStorageService,
  ) {}

  async uploadAvatar(file: Express.Multer.File) {
    return await this.firebaseStorageService.uploadFile(file);
  }

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

  async favoriteContactToggler(id: number, user_id: number): Promise<any> {
    const contact = await this.findOneContact(id, user_id);

    console.log(contact);
    
    if(contact) {
      contact.is_favorite = !contact.is_favorite;
      await contact.save();
    } else {
      throw new BadRequestException('Contact not found');
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

  // uploadContactAvatar(id: number, user_id: number, avatar_path: string){
  // const avatar =  this.contactRepository.update(
  //   { avatar_path },
  //   { where: { id, user_id } },
  // );
  // return avatar_path;
  // }

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
