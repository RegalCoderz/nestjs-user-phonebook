import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Password extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ unique: true })
  email: string;

  @Column
  token: string;
}