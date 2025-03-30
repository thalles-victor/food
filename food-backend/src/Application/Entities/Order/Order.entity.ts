import { TABLE } from 'src/Application/@shared/metadata';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../Base.entity';
import { UserEntity } from '../User/User.entity';
import { RequireOnlyOne } from 'src/Application/@shared/types';

@Entity(TABLE.order)
export class OrderEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  title: string;

  @Column({ type: 'varchar', length: 50 })
  userId: string;

  @Column({ type: 'varchar', length: 40 })
  productId: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'varchar', length: 40 })
  totalPrice: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  paymentUrl: string | null;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  paidIn: Date | null;
}

export type OrderUpdateEntity = Partial<
  Pick<OrderEntity, 'paymentUrl' | 'deletedAt'>
> &
  Pick<UserEntity, 'updatedAt'>;

export type OrderUniqueRef = RequireOnlyOne<Pick<OrderEntity, 'id'>>;
