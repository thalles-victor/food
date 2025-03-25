import {
  OrderEntity,
  OrderUniqueRef,
  OrderUpdateEntity,
} from 'src/Application/Entities/Order/Order.entity';
import { IBaseRepositoryContract } from '../IBaseRepository.contract';

export interface IOrderRepositoryContract
  extends IBaseRepositoryContract<
    OrderEntity,
    OrderUpdateEntity,
    OrderUniqueRef
  > {}
