import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './Order.service';
import { CreateOrderDto } from './dtos/CreateOrder.dto';
import { JwtAuthGuard } from 'src/Application/@shared/guards/jwt-auth.guard';
import { RoleGuard } from 'src/Application/@shared/guards/role.guard';
import { RolesDecorator, User } from 'src/Application/@shared/decorators';
import { ROLE } from 'src/Application/@shared/metadata';
import { PayloadType } from 'src/Application/@shared/types';

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
  @RolesDecorator(ROLE.ADMIN, ROLE.ROOT)
  create(@User() payload: PayloadType, @Body() orderDto: CreateOrderDto) {
    return this.orderService.create(payload, orderDto);
  }
}
