import {
  ProductEntity,
  ProductUniqueRefs,
  ProductUpdateEntity,
} from 'src/Application/Entities/Product/Product.entity';
import { IProductRepositoryContract } from './Product.repository-contract';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { splitKeyAndValue } from 'src/Application/@shared/utils';

export class ProductTypeormRepository implements IProductRepositoryContract {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async create(entity: ProductEntity): Promise<ProductEntity> {
    try {
      return await this.productRepository
        .createQueryBuilder()
        .insert()
        .into(ProductEntity)
        .values(entity)
        .returning('*')
        .execute()
        .then((result) => result.generatedMaps[0] as ProductEntity);
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getBy(unqRef: ProductUniqueRefs): Promise<ProductEntity | null> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      return await this.productRepository
        .createQueryBuilder('product')
        .where(`product.${key} = :value`, { value })
        .getOne();
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async update(
    unqRef: ProductUniqueRefs,
    updateEntity: ProductUpdateEntity,
  ): Promise<ProductEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const updateResult = await this.productRepository
        .createQueryBuilder()
        .update(ProductEntity)
        .set(updateEntity)
        .where(`${key} = :value`, { value })
        .returning('*')
        .execute();

      if (!updateResult.affected || updateResult.affected === 0) {
        throw new Error('Product not found');
      }

      return updateResult.raw[0] as ProductEntity;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async delete(unqRef: ProductUniqueRefs): Promise<void> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const deleteResult = await this.productRepository
        .createQueryBuilder()
        .delete()
        .from(ProductEntity)
        .where(`${key} = :value`, { value })
        .execute();

      if (!deleteResult.affected || deleteResult.affected === 0) {
        throw new Error('Product not found');
      }
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async softDelete(unqRef: ProductUniqueRefs): Promise<ProductEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const updateResult = await this.productRepository
        .createQueryBuilder()
        .update(ProductEntity)
        .set({ deletedAt: new Date() })
        .where(`${key} = :value AND deletedAt IS NULL`, { value })
        .returning('*')
        .execute();

      if (!updateResult.affected || updateResult.affected === 0) {
        throw new Error('Product not found or already deleted');
      }

      return updateResult.raw[0] as ProductEntity;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getAll(): Promise<ProductEntity[]> {
    try {
      return await this.productRepository
        .createQueryBuilder('product')
        .where('product.deletedAt IS NULL')
        .getMany();
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }
}
