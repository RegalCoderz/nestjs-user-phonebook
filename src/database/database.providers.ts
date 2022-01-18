import { Sequelize } from 'sequelize-typescript';
import { Contact } from 'src/models/contact/contact.model';
import { Password } from 'src/models/password/password.model';
import { User } from '../models/user/user.model';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'nestjs-phonebook',
      });
      sequelize.addModels([User, Password, Contact]);
      await sequelize.sync();
      return sequelize;
    },
  },
];