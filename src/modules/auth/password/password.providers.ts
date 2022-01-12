import { Password } from '../../../models/password/password.model';

export const passwordProviders = [
  {
    provide: 'PASSWORD_REPOSITORY',
    useValue: Password,
  },
];