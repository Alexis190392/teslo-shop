import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsArray, IsString } from "class-validator";

@Entity('users')
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {unique:true})
  email: string;

  @Column('text')
  password: string;

  @Column('text')
  fullName: string;

  @Column('bool', {default:true})
  isActive: boolean;

  @Column('text', {array:true, default:['user']})
  roles: string[];

}
