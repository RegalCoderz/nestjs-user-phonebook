import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
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
  favoriteContactToggleStatus(
    @Param() params,
    @Request() req,
  ): Promise<Contact> {
    return this.contactsService.favoriteContactToggler(
      params.id,
      req.user.userId,
    );
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  getOneContact(@Param() params, @Request() req): Promise<Contact> {
    return this.contactsService.findOneContact(params.id, req.user.userId);
  }

  @Post('create')
  @ApiConsumes('multipart/form-data')
  async createContact(
    @Body() contact: ContactDTO,
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Contact> {
    return await this.contactsService.createContact(contact, req.user.userId);
  }

  @Post(':id/upload-avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiParam({ name: 'id' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'file',
          format: 'buffer',
        },
      },
    },
  })
  uploadContactImage(
    @Param() params,
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      return this.contactsService.uploadAvatar(
        file,
        params.id,
        req.user.userId,
      );
    } else {
      throw new BadRequestException('Please Upload the Avatar Image');
    }
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
