import {
  Inject,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { KEY_INJECTION, ROLE } from 'src/Application/@shared/metadata';
import { IProductRepositoryContract } from 'src/Application/Infra/Repositories/Product/Product.repository-contract';
import { CreateProductDto } from './dtos/CreateProduct.dto';
import { generateShortId } from 'src/Application/@shared/utils';
import { UpdateProductDto } from './dtos/UpdateProduct.dto';

export class ProductService {
  constructor(
    @Inject(KEY_INJECTION.PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepositoryContract,
  ) {}

  async create(productDto: CreateProductDto) {
    const productCreated = await this.productRepository.create({
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      description: productDto.description ?? null,
      id: generateShortId(15),
      title: productDto.title,
      price: parseFloat(productDto.price.toString()).toFixed(2),
    });

    return productCreated;
  }

  async update(productId: string, productDto: UpdateProductDto) {
    const productExist = await this.productRepository.getBy({ id: productId });

    if (!productExist) {
      throw new NotFoundException('product not found');
    }

    if (productExist.deletedAt) {
      throw new NotAcceptableException('product already deleted');
    }

    return this.productRepository.update(
      { id: productId },
      {
        title: productDto.title,
        description: productDto.description,
        price: productDto.unitPrice,
        updatedAt: new Date(),
      },
    );
  }

  async delete(productId: string) {
    const productExist = await this.productRepository.getBy({ id: productId });

    if (!productExist) {
      throw new NotFoundException('product not found');
    }

    await this.productRepository.delete({ id: productId });
  }

  async softDele(productId: string) {
    const productExist = await this.productRepository.getBy({ id: productId });

    if (!productExist) {
      throw new NotFoundException('product not found');
    }

    const product = await this.productRepository.softDelete({ id: productId });

    return product;
  }

  async getById(productId: string) {
    const product = await this.productRepository.getBy({ id: productId });

    if (!product || product.deletedAt) {
      throw new NotFoundException('product not found');
    }

    return product;
  }

  async getByIdAsSuper(productId: string) {
    const product = await this.productRepository.getBy({ id: productId });

    if (!product) {
      throw new NotFoundException('product not found');
    }

    return product;
  }

  async getAll() {
    return this.productRepository.getAll();
  }
}
