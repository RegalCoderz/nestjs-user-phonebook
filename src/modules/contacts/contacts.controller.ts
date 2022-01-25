import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request, UploadedFile, UseGuards, UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Contact } from 'src/models/contact/contact.model';
import { ContactsService } from './contacts.service';
import { ContactDTO } from './dto/Contact.dto';
import { GetContactsFilterDTO } from './dto/GetContactsFilter.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@ApiTags('contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

  @Get()
  getContacts(@Query() contactFilterDto: GetContactsFilterDTO, @Request() req) {
    if (Object.keys(contactFilterDto).length) {
      return this.contactsService.findAllContactsWithFilters(
        contactFilterDto,
        req.user.userId,
      );
    } else {
      return this.contactsService.findAll(req.user.userId);
    }
  }

  @Get('favorite')
  getFavoriteContacts(@Request() req) {
    return this.contactsService.findFavoriteContacts(req.user.userId);
  }

  @Put(':id/favorite-toggle')
  @ApiParam({ name: 'id' })
  favoriteContactToggleStatus(@Param() params, @Request() req): Promise<Contact> {
    return this.contactsService.favoriteContactToggler(params.id, req.user.userId);
  }
 

  @Get(':id')
  @ApiParam({ name: 'id' })
  getOneContact(@Param() params, @Request() req): Promise<Contact> {
    return this.contactsService.findOneContact(params.id, req.user.userId);
  }

  @Post('create')
  async createContact(
    @Body() contact: ContactDTO,
    @Request() req,
  ): Promise<Contact> {
    return await this.contactsService.createContact(contact, req.user.userId);
  }

  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  uploadContactImage(@UploadedFile() file: Express.Multer.File) {
    return this.contactsService.uploadAvatar(file);
  }

  @Put(':id')
  updateContact(
    @Param() params,
    @Request() req,
    @Body() updatedContact: ContactDTO,
  ): Promise<Contact> {
    return this.contactsService.updateContact(
      params.id,
      req.user.userId,
      updatedContact,
    );
  }

  @Delete('/:id')
  @ApiParam({ name: 'id' })
  deleteContact(@Param() params, @Request() req): Promise<Contact> {
    return this.contactsService.deleteContact(params.id, req.user.userId);
  }
}