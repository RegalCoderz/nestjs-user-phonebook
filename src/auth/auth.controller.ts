import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { Public } from 'src/common/decorators/public.decorator';
import { User } from 'src/models/user/user.model';
import { AuthService } from './auth.service';
import { ForgetPasswordDTO } from './dto/ForgetPass.dto';
import { ResetPasswordDTO } from './dto/ResetPass.dto';
import { SignInDTO } from './dto/SignIn.dto';
import { SignUpDTO } from './dto/SignUp.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Recaptcha()
  @Post('/signin')
  async signIn(@Body() signInDTO: SignInDTO, @Request() req) {
    return this.authService.logInUser(req.user);
  }

  @Public()
  @Recaptcha()
  @Post('/signup')
  signUpUser(@Body() signUpDTO: SignUpDTO): Promise<User> {
    return this.authService.signUpUser(signUpDTO);
  }

  @ApiBearerAuth('access-token')
  @Post('/forgot-password')
  async createPasswordToken(@Body() forgetPasswordDTO: ForgetPasswordDTO) {
    return this.authService.forgotPassword(forgetPasswordDTO);
  }

  @ApiBearerAuth('access-token')
  @Post('/reset-password')
  async resetPassword(@Body() resetPasswordDTO: ResetPasswordDTO) {
    return this.authService.resetPassword(resetPasswordDTO);
  }
}