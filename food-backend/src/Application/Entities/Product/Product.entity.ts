import { TABLE } from 'src/Application/@shared/metadata';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../Base.entity';

@Entity(TABLE.product)
export class ProductEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 40 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'numeric' })
  unitPrice: string;
}
