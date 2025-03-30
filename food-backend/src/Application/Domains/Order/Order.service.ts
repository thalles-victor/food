import { PayloadType } from 'src/Application/@shared/types';
import { CreateOrderDto } from './dtos/CreateOrder.dto';
import {
  Inject,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { KEY_INJECTION, ROLE } from 'src/Application/@shared/metadata';
import { IOrderRepositoryContract } from 'src/Application/Infra/Repositories/Order/Oder.repository-contract';
import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/User/User.repository-contract';
import { IProductRepositoryContract } from 'src/Application/Infra/Repositories/Product/Product.repository-contract';
import { generateShortId } from 'src/Application/@shared/utils';
import { PayOrderDto } from './dtos/PayOrder.dtos';
import { PaymentService } from 'src/Application/Infra/Payment/Payment.service';

export class OrderService {
  constructor(
    @Inject(KEY_INJECTION.USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_INJECTION.PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepositoryContract,
    @Inject(KEY_INJECTION.ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepositoryContract,
    private readonly paymentService: PaymentService,
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

  async getOrderById(payload: PayloadType, id: string) {
    const user = await this.userRepository.getBy({ id: payload.sub });

    if (!user) {
      throw new UnauthorizedException();
    }

    const order = await this.orderRepository.getBy({ id });

    if (
      !order ||
      (order.userId !== payload.sub && !user.roles.includes(ROLE.ADMIN)) ||
      !user.roles.includes(ROLE.ROOT)
    ) {
      throw new NotFoundException('order not found');
    }
  }

  async payOrder(payload: PayloadType, paymentDto: PayOrderDto) {
    const user = await this.userRepository.getBy({ id: payload.sub });

    if (!user) {
      throw new UnauthorizedException();
    }

    const order = await this.orderRepository.getBy({ id: paymentDto.orderId });

    if (!order || order.deletedAt) {
      throw new NotFoundException('order not found');
    }

    if (order.paymentUrl) {
      return order;
    }

    let paymentResult;
    try {
      paymentResult = await this.paymentService.paypalGenerateUrl({
        order: {
          id: order.id,
          totalPrice: order.totalPrice,
          items: [
            {
              currencyCode: 'BRL',
              price: order.totalPrice,
            },
          ],
        },
        customer: {
          id: user.id,
          name: user.name,
          email: user.email,
          cpfCnpjTaxId: paymentDto.cpfCnpj,
        },
      });
    } catch (e) {
      console.error('payment fail ', e);
      throw new InternalServerErrorException(
        'payment fail because a internal server error',
      );
    }

    const orderUpdated = await this.orderRepository.update(
      {
        id: paymentDto.orderId,
      },
      {
        paymentUrl: paymentResult.url,
        updatedAt: new Date(),
      },
    );

    return orderUpdated;
  }

  acceptOrder() {} // super
  sendOrder() {} // super
  deliveryOrder() {} // user or super
}
