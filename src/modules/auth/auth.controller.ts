import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { UserDTO } from '../users/dto/User.dto';
import { User } from '../../models/user/user.model';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';


@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  async signIn(@Request() req) {
    return this.authService.logInUser(req.user);
  }

  @Post('/signup')
  signUpUser(@Body() createUserDto: UserDTO): Promise<User> {
    return this.authService.signUpUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/forgot-password')
  async createPasswordToken(@Body() body: object) {
    const email = body['email'];
    return this.authService.forgotPassword(email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/reset-password')
  async resetPassword(@Body() data: any) {
    const { token, password, password_confirm } = data;
    return this.authService.resetPassword(token, password, password_confirm);
  }
}