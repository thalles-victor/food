import { PayloadType } from 'src/Application/@shared/types';
import { CreateOrderDto } from './dtos/CreateOrder.dto';
import {
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { KEY_INJECTION } from 'src/Application/@shared/metadata';
import { IOrderRepositoryContract } from 'src/Application/Infra/Repositories/Order/Oder.repository-contract';
import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/User/User.repository-contract';
import { IProductRepositoryContract } from 'src/Application/Infra/Repositories/Product/Product.repository-contract';
import { generateShortId } from 'src/Application/@shared/utils';

export class OrderService {
  constructor(
    @Inject(KEY_INJECTION.USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_INJECTION.PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepositoryContract,
    @Inject(KEY_INJECTION.ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepositoryContract,
  ) {}

  async create(payload: PayloadType, orderDto: CreateOrderDto) {
    const user = await this.userRepository.getBy({ id: payload.sub });

    if (!user) {
      throw new UnauthorizedException();
    }

    const product = await this.productRepository.getBy({
      id: orderDto.productId,
    });

    if (!product || product.deletedAt) {
      throw new NotFoundException('product not found');
    }

    const orderCreated = await this.orderRepository.create({
      id: generateShortId(15),
      title: `Compra do item: ${product.title}`,
      totalPrice: 'calcular dps',
      quantity: orderDto.quantity,
      paymentUrl: null,
      productId: product.id,
      userId: user.id,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      Status: [],
    });

    return orderCreated;
  }

  async getMyOrders(payload: PayloadType) {
    const user = await this.userRepository.getBy({ id: payload.sub });

    if (!user) {
      throw new UnauthorizedException();
    }

    const orders = await this.orderRepository.getAllOrdersByUserId(user.id);

    return orders;
  }
}
