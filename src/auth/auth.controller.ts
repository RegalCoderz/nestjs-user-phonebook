import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { User } from '../models/user/user.model';
import { UserDTO } from '../modules/users/dto/User.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('/signin')
  async signIn(@Request() req) {
    return this.authService.logInUser(req.user);
  }

  @Public()
  @Post('/signup')
  signUpUser(@Body() createUserDto: UserDTO): Promise<User> {
    return this.authService.signUpUser(createUserDto);
  }

  @Post('/forgot-password')
  async createPasswordToken(@Body() body: object) {
    const email = body['email'];
    return this.authService.forgotPassword(email);
  }

  @Post('/reset-password')
  async resetPassword(@Body() data: any) {
    const { token, password, password_confirm } = data;
    return this.authService.resetPassword(token, password, password_confirm);
  }
}