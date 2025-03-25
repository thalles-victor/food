import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './Product.service';
import { CreateProductDto } from './dtos/CreateProduct.dto';
import { UpdateProductDto } from './dtos/UpdateProduct.dto';
import { JwtAuthGuard } from 'src/Application/@shared/guards/jwt-auth.guard';
import { RoleGuard } from 'src/Application/@shared/guards/role.guard';
import { RolesDecorator } from 'src/Application/@shared/decorators';
import { ROLE } from 'src/Application/@shared/metadata';

@Controller({ path: 'product', version: '1' })
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('all')
  getAll() {
    return this.productService.getAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN, ROLE.ROOT)
  create(@Body() productDto: CreateProductDto) {
    return this.productService.create(productDto);
  }

  @Get('one/:id')
  getOne(@Param('id') id: string) {
    return this.productService.getById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN, ROLE.ROOT)
  partialUpdate(@Param('id') id: string, @Body() productDto: UpdateProductDto) {
    return this.productService.update(id, productDto);
  }

  @Delete('soft/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN, ROLE.ROOT)
  softDelete(@Param('id') id: string) {
    return this.productService.softDele(id);
  }

  @Delete('permanently/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN, ROLE.ROOT)
  permanentlyDelete(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
