import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { OrderService } from './Order.service';
import { CreateOrderDto } from './dtos/CreateOrder.dto';
import { JwtAuthGuard } from 'src/Application/@shared/guards/jwt-auth.guard';
import { RoleGuard } from 'src/Application/@shared/guards/role.guard';
import { RolesDecorator, User } from 'src/Application/@shared/decorators';
import { ROLE } from 'src/Application/@shared/metadata';
import { PayloadType } from 'src/Application/@shared/types';
import { PayOrderDto } from './dtos/PayOrder.dtos';

@Controller({ path: 'order', version: '1' })
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('my-orders')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.USER, ROLE.ADMIN, ROLE.ROOT)
  geMyOrders(@User() payload: PayloadType) {
    return this.orderService.getMyOrders(payload);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.USER, ROLE.ADMIN, ROLE.ROOT)
  create(@User() payload: PayloadType, @Body() orderDto: CreateOrderDto) {
    return this.orderService.create(payload, orderDto);
  }

  @Get('id/:id')
  getOrderById(@User() user: PayloadType, @Param('id') id: string) {
    return this.orderService.getOrderById(user, id);
  }

  @Post('pay')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.USER, ROLE.ADMIN, ROLE.ROOT)
  pay(@User() user: PayloadType, @Body() paymentDto: PayOrderDto) {
    return this.orderService.payOrder(user, paymentDto);
  }

  @Post('paypal-webhook')
  paypalWebHook(@Body() body: any, @Headers() headers: any) {
    return this.orderService.paymentConfirmWebHook(body, headers);
  }
}
