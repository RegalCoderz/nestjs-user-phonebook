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

    if (contact) {
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

  async uploadAvatar(file: Express.Multer.File, id: number, user_id: number) {
    const contact = await this.findOneContact(id, user_id);
    if (file.size <= 5000000) {
      if (contact) {
        if (contact.avatar_path) {
          this.firebaseStorageService.deleteFile(contact.avatar_path); // DELETE old avatar
          this.uploadAvatarHelper(file, user_id, contact); // UPLOAD new avatar
        } else {
          this.uploadAvatarHelper(file, user_id, contact); // UPLOAD new avatar
        }
      } else {
        throw new BadRequestException('Contact not found'); // contact not found
      }
    } else {
      throw new BadRequestException('File size is greater than 1MB'); // File size is greater than 1MB
    }
    return {
      message: 'File uploaded successfully',
      filePath: file.path,
    };
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

  // ==================== Helper Methods  ====================

  async uploadAvatarHelper(
    file: Express.Multer.File,
    user_id: number,
    contact: Contact,
  ) {
    const fileResponse = await this.firebaseStorageService.uploadFile(
      file,
      user_id,
    );
    contact.avatar_path = fileResponse.metadata.fullPath;
    contact.save();
  }
}
