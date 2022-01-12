import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import { Contact } from '../contact/contact.model';

@Table
export class User extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column
  password: string;

  @HasMany(() => Contact)
  contacts: Contact[];
}