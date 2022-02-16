import { User } from '../../models/user/user.model';

export const usersProviders = [
  {
    provide: 'USERS_REPOSITORY',
    useValue: User,
  },
];