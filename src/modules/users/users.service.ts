import { Inject, Injectable } from '@nestjs/common';
import { UserDTO } from './dto/User.dto';
import { User } from '../../models/user/user.model';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: typeof User,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.findAll<User>();
  }

  findOneById(id: number): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }

  create(userData: UserDTO): Promise<User> {
    const email = userData.email;
    const alreadyCreated = this.usersRepository.findOne({ where: { email } });

    if (alreadyCreated) {
      return this.usersRepository.create(userData);
    } else {
      throw new Error('User already exists');
    }
  }

  async update(id: number, updatedUserData: UserDTO): Promise<User> {
    await this.usersRepository.update(updatedUserData, {
      where: {
        id,
      },
    });
    const user = this.findOneById(id);
    return user;
  }

  async updatePassword(id: number, password: string): Promise<User> {
    await this.usersRepository.update(
      {
        password,
      },
      {
        where: {
          id,
        },
      },
    );
    const user = this.findOneById(id);
    return user;
  }

  async destroy(id: number): Promise<User> {
    const user = await this.findOneById(id);
    await this.usersRepository.destroy({
      where: {
        id,
      },
    });
    return user;
  }

  // Auth Methods

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }
}
