import { Module } from '@nestjs/common';
import { OrderController } from './Order.controller';
import { OrderService } from './Order.service';
import { RepositoriesModule } from 'src/Application/Infra/Repositories/Repositories.module';
import { KEY_INJECTION } from 'src/Application/@shared/metadata';
import { UserTypeOrmRepository } from 'src/Application/Infra/Repositories/User/UserTypeOrm.repository';
import { ProductTypeormRepository } from 'src/Application/Infra/Repositories/Product/ProductTypeorm.repository';
import { OrderTypeOrmRepository } from 'src/Application/Infra/Repositories/Order/OrderTypeOrm.repository';
import { PaymentModule } from 'src/Application/Infra/Payment/Payment.module';

@Module({
  imports: [RepositoriesModule, PaymentModule],
  controllers: [OrderController],
  providers: [
    { provide: KEY_INJECTION.USER_REPOSITORY, useClass: UserTypeOrmRepository },
    {
      provide: KEY_INJECTION.PRODUCT_REPOSITORY,
      useClass: ProductTypeormRepository,
    },
    {
      provide: KEY_INJECTION.ORDER_REPOSITORY,
      useClass: OrderTypeOrmRepository,
    },
    OrderService,
  ],
})
export class OrderModule {}
