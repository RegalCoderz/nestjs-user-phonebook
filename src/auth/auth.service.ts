import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePassword, passwordHashing } from 'src/common/utils/bcrypt';
import { User } from 'src/models/user/user.model';
import { UserDTO } from 'src/modules/users/dto/User.dto';
import { UsersService } from 'src/modules/users/users.service';
import { Password } from '../models/password/password.model';

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

  async validateUser(
    incomingEmail: string,
    incomingPassword: string,
  ): Promise<any> {
    const user = await this.userService.findOneByEmail(incomingEmail);

    if (user) {
      // validate password
      const matched = await comparePassword(incomingPassword, user.password);
      if (matched) {
        const { password, ...rest } = user['dataValues'];
        return rest;
      }
    } else {
      throw new BadRequestException('User does not exist');
    }
    return null;
  }

  // ======================== Auth Functions ==========================
  // ======================== JWT Access Token Generation ========================== //

  async logInUser(user: any) {
    const payload = {
      username: user.username,
      sub: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUpUser(userData: UserDTO): Promise<User> {
    const { email, password } = userData;

    const alreadyCreated = await this.usersRepository.findOne({
      where: { email },
    });

    if (alreadyCreated) {
      throw new BadRequestException('User already exists');
    } else {
      return await this.usersRepository.create({
        ...userData,
        password: await passwordHashing(password),
      });
    }
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('User does not exist');
    } else {
      const token = Math.random().toString(36).substring(2, 15);
      await this.createPasswordToken({ email, token });
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
    const resetPasswordToken = await this.findOneByToken(token);
    if (resetPasswordToken) {
      if (password !== password_confirm) {
        throw new BadRequestException('Passwords do not match');
      } else {
        const user = await this.userService.findOneByEmail(
          resetPasswordToken.email,
        );

        if (user) {
          const hashedPassword = await passwordHashing(password);
          this.userService.updatePassword(user.id, hashedPassword);
          await this.deletePasswordToken(token);
        } else {
          throw new BadRequestException('User does not exist');
        }
      }
    } else {
      throw new BadRequestException('Invalid Token OR Token Has Been Expired');
    }
    return {
      message: 'Password updated successfully',
    };
  }

  // ================= Password Forget/Reset Helper Methods For Tokens ======================

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
