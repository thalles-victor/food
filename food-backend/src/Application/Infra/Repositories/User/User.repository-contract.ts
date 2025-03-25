import {
  UserEntity,
  UserUniqueRef,
  UserUpdateEntity,
} from 'src/Application/Entities/User/User.entity';
import { IBaseRepositoryContract } from '../IBaseRepository.contract';

export interface IUserRepositoryContract
  extends IBaseRepositoryContract<
    UserEntity,
    UserUpdateEntity,
    UserUniqueRef
  > {}
