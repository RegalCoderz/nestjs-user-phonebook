import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table
} from 'sequelize-typescript';
import { User } from 'src/models/user/user.model';

@Table
export class Contact extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  first_name: string;

  @Column
  last_name: string;

  @Column
  email: string;

  @Column
  phone: string;

  @Column
  city: string;

  @Column
  country: string;

  @Column
  is_favorite: boolean;

  @Column
  avatar_path: string;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @BelongsTo(() => User)
  user: User;
}
