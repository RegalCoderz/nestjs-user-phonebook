import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/models/user/user.model';
import { UserDTO } from 'src/modules/users/dto/User.dto';
import { UsersService } from 'src/modules/users/users.service';
import { Password } from '../../models/password/password.model';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: typeof User,
    @Inject('PASSWORD_REPOSITORY')
    private passwordRepository: typeof Password,
    private userService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    // validate password
    if (user && user.password === pass) {
      const { password, username, ...rest } = user;
      return rest;
    }
    return null;
  }

  // ======================== JWT ==========================

  async logInUser(user: any) {
    // return user.dataValues.id;
    const payload = {
      username: user.dataValues.username,
      sub: user.dataValues.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // ======================== Auth Functions ==========================

  signUpUser(userData: UserDTO): Promise<User> {
    const email = userData.email;
    const alreadyCreated = this.usersRepository.findOne({ where: { email } });

    if (alreadyCreated) {
      return this.usersRepository.create(userData);
    } else {
      throw new Error('User already exists');
    }
  }

  async forgotPassword(email: string) {
    const token = Math.random().toString(36).substring(2, 15);
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('User does not exist');
    } else {
      this.createPasswordToken({ email, token });
      const url = `https://localhost:3000/auth/reset/${token}`;

      await this.mailerService.sendMail({
        to: email,
        subject: 'Reset your password',
        text: `Please click on the following link to reset your password: ${url}`,
        html: `<a href="{{ url }}">Click Here to change your password</a>`,
      });

      return {
        message: 'A password reset link has been sent to your email',
      };
    }
  }

  async resetPassword(token: any, password: string, password_confirm: string) {
    const resetPassword = await this.findOneByToken(token);
    if (resetPassword) {
      if (password !== password_confirm) {
        throw new BadRequestException('Passwords do not match');
      } else {
        const user = await this.userService.findOneByEmail(resetPassword.email);

        if (!user) {
          throw new BadRequestException('User does not exist');
        } else {
          this.userService.updatePassword(user.id, password);
          await this.deletePasswordToken(token);
        }
      }
    } else {
      throw new BadRequestException('Invalid Token OR Token Has Been Expired');
    }
    return {
      message: 'Password updated successfully',
    };
  }

  // ================= Password Forget/Reset Helper Methods ======================

  async createPasswordToken(passwordData): Promise<Password> {
    return await this.passwordRepository.create(passwordData);
  }

  async findOneByToken(token: any): Promise<Password> {
    return await this.passwordRepository.findOne(token);
  }

  async deletePasswordToken(token: any): Promise<Password> {
    const password = await this.findOneByToken(token);
    await this.passwordRepository.destroy({
      where: {
        token,
      },
    });
    return password;
  }
}
