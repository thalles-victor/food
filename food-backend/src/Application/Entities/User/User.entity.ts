import { TABLE } from 'src/Application/@shared/metadata';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../Base.entity';
import { RequireOnlyOne } from 'src/Application/@shared/types';

@Entity(TABLE.user)
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 120 })
  email: string;

  @Column({ type: 'varchar' })
  password: string;
}

export type UserUpdateEntity = Partial<
  Pick<UserEntity, 'password' | 'name' | 'deletedAt'>
> &
  Pick<UserEntity, 'updatedAt'>;

export type UserUniqueRef = RequireOnlyOne<Pick<UserEntity, 'id' | 'email'>>;
