import { Module } from '@nestjs/common';
import { OrderController } from './Order.controller';
import { OrderService } from './Order.service';
import { RepositoriesModule } from 'src/Application/Infra/Repositories/Repositories.module';

@Module({
  imports: [RepositoriesModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
