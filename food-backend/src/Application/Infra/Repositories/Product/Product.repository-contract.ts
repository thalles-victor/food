import {
  ProductEntity,
  ProductUniqueRefs,
  ProductUpdateEntity,
} from 'src/Application/Entities/Product/Product.entity';
import { IBaseRepositoryContract } from '../IBaseRepository.contract';

export interface IProductRepositoryContract
  extends IBaseRepositoryContract<
    ProductEntity,
    ProductUpdateEntity,
    ProductUniqueRefs
  > {}
