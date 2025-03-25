import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/Application/Entities/User/User.entity';
import { UserTypeOrmRepository } from './User/UserTypeOrm.repository';
import { ProductTypeormRepository } from './Product/ProductTypeorm.repository';
import { OrderTypeOrmRepository } from './Order/OrderTypeOrm.repository';
import { OrderEntity } from 'src/Application/Entities/Order/Order.entity';
import { ProductEntity } from 'src/Application/Entities/Product/Product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ProductEntity, OrderEntity])],
  providers: [
    UserTypeOrmRepository,
    ProductTypeormRepository,
    OrderTypeOrmRepository,
  ],
  exports: [
    TypeOrmModule,
    UserTypeOrmRepository,
    ProductTypeormRepository,
    OrderTypeOrmRepository,
  ],
})
export class RepositoriesModule {}
