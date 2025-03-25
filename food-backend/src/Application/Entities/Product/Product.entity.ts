import { TABLE } from 'src/Application/@shared/metadata';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../Base.entity';
import { RequireOnlyOne } from 'src/Application/@shared/types';

@Entity(TABLE.product)
export class ProductEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 40 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'numeric' })
  unitPrice: string;
}

export type ProductUpdateEntity = Partial<
  Pick<ProductEntity, 'title' | 'description' | 'unitPrice' | 'deletedAt'>
> &
  Pick<ProductEntity, 'updatedAt'>;

export type ProductUniqueRefs = RequireOnlyOne<
  Pick<ProductEntity, 'id' | 'unitPrice'>
>;
