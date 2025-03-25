import { TABLE } from 'src/Application/@shared/metadata';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../Base.entity';
import { OrderStatus } from './OrderStatus';
import { OrderItem } from './Orderitem';
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

  @Column({ type: 'varchar', length: 40 })
  totalPrice: string;

  @Column({ type: 'varchar' })
  paymentUrl: string;

  Status: OrderStatus[];
  Items: OrderItem[];
}

export type OrderUpdateEntity = Partial<
  Pick<OrderEntity, 'totalPrice' | 'paymentUrl' | 'deletedAt'>
> &
  Pick<UserEntity, 'updatedAt'>;

export type OrderUniqueRef = RequireOnlyOne<Pick<OrderEntity, 'id'>>;
