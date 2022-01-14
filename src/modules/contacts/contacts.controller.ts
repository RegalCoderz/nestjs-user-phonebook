import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Contact } from 'src/models/contact/contact.model';
import { ContactsService } from './contacts.service';
import { ContactDTO } from './dto/Contact.dto';
import { GetContactsFilterDTO } from './dto/GetContactsFilter.dto';

// export const storage = {
//   storage: diskStorage({
//     destination: `./uploads/avatars`,
//     filename: (req, file, cb) => {
//       const randomName = Array(5)
//       .fill(null)
//       .map(() => Math.round(Math.random() * 16).toString(16))
//       .join('');
//       return cb(null, `${randomName}${extname(file.originalname)}`);
//     },
//   }),
// }

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
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

  @Put(':id/add-favorite')
  @ApiParam({ name: 'id' })
  addContactToFavorite(@Param() params, @Request() req): Promise<Contact> {
    return this.contactsService.addToFavorite(params.id, req.user.userId);
  }

  @Put(':id/remove-favorite')
  @ApiParam({ name: 'id' })
  removeContactFromFavorite(@Param() params, @Request() req): Promise<Contact> {
    return this.contactsService.removeFromFavorite(params.id, req.user.userId);
  }

  // @Post(':id/avatar')
  // @UseInterceptors(
  //   FileInterceptor('file'),
  // )
  // uploadContactAvatar(
    // @Param() params,
    // @Request() req,
    // @UploadedFile() file: Express.Multer.File,
  // ) {
  //  return 'Hello World';
  // }

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
