import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards
} from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { Contact } from 'src/models/contact/contact.model';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ContactsService } from './contacts.service';
import { ContactDTO } from './dto/Contact.dto';

@UseGuards(JwtAuthGuard)
@Controller('contacts')
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

  @Get()
  findAll(@Request() req) {
    return this.contactsService.findAll(req.user.userId);
  }

  @Get('/favorite')
  findFvtContacts(@Request() req) {
    return this.contactsService.findFvtContacts(req.user.userId);
  }

  @Put('/:id/add-favorite')
  @ApiParam({ name: 'id' })
  addFvtContacts(@Param() params, @Request() req): Promise<Contact> {
    return this.contactsService.addFvtContacts(params.id, req.user.userId);
  }

  @Put('/:id/remove-favorite')
  @ApiParam({ name: 'id' })
  removeFvtContacts(@Param() params, @Request() req): Promise<Contact> {
    return this.contactsService.removeFvtContacts(params.id, req.user.userId);
  }

  @Get('/:id')
  @ApiParam({ name: 'id' })
  findOneContact(@Param() params, @Request() req): Promise<Contact> {
    return this.contactsService.findOneContact(params.id, req.user.userId);
  }

  @Post('/create')
  async create(@Body() contact: ContactDTO, @Request() req): Promise<Contact> {
    return await this.contactsService.createContact(contact, req.user.userId);
  }

  @Put('/:id')
  update(
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