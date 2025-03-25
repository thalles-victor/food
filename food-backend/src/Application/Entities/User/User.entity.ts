import { TABLE } from 'src/Application/@shared/metadata';
import { BaseEntity, Column, Entity } from 'typeorm';

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
