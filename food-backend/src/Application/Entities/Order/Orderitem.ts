import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../Base.entity';
import { TABLE } from 'src/Application/@shared/metadata';

@Entity({ name: TABLE.order_item })
export class OrderItem extends BaseEntity {
  @Column({ type: 'varchar', length: 40 })
  productId: string;

  @Column({ type: 'numeric' })
  unitPrice: number;

  @Column({ type: 'int' })
  quantity: number;
}
