import { TABLE } from 'src/Application/@shared/metadata';
import { BaseEntity, Column, Entity } from 'typeorm';

@Entity({ name: TABLE.order_status })
export class OrderStatus extends BaseEntity {
  @Column({ type: 'varchar' })
  status: string;

  @Column({ type: 'varchar', length: 120 })
  description: string;
}
