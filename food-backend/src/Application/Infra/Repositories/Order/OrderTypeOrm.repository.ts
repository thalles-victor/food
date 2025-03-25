import { IOrderRepositoryContract } from './Oder.repository-contract';
import {
  OrderEntity,
  OrderUpdateEntity,
  OrderUniqueRef,
} from '../../../Entities/Order/Order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { splitKeyAndValue } from 'src/Application/@shared/utils';

export class OrderTypeOrmRepository implements IOrderRepositoryContract {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  async create(entity: OrderEntity): Promise<OrderEntity> {
    try {
      return await this.orderRepository
        .createQueryBuilder()
        .insert()
        .into(OrderEntity)
        .values(entity)
        .returning('*')
        .execute()
        .then((result) => result.generatedMaps[0] as OrderEntity);
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getBy(unqRef: OrderUniqueRef): Promise<OrderEntity | null> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      return await this.orderRepository
        .createQueryBuilder('order')
        .where(`order.${key} = :value`, { value })
        .getOne();
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async update(
    unqRef: OrderUniqueRef,
    updateEntity: OrderUpdateEntity,
  ): Promise<OrderEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const updateResult = await this.orderRepository
        .createQueryBuilder()
        .update(OrderEntity)
        .set(updateEntity)
        .where(`${key} = :value`, { value })
        .returning('*')
        .execute();

      if (!updateResult.affected || updateResult.affected === 0) {
        throw new Error('Order not found');
      }

      return updateResult.raw[0] as OrderEntity;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async delete(unqRef: OrderUniqueRef): Promise<void> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const deleteResult = await this.orderRepository
        .createQueryBuilder()
        .delete()
        .from(OrderEntity)
        .where(`${key} = :value`, { value })
        .execute();

      if (!deleteResult.affected || deleteResult.affected === 0) {
        throw new Error('Order not found');
      }
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async softDelete(unqRef: OrderUniqueRef): Promise<OrderEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const updateResult = await this.orderRepository
        .createQueryBuilder()
        .update(OrderEntity)
        .set({ deletedAt: new Date() })
        .where(`${key} = :value AND deletedAt IS NULL`, { value })
        .returning('*')
        .execute();

      if (!updateResult.affected || updateResult.affected === 0) {
        throw new Error('Order not found or already deleted');
      }

      return updateResult.raw[0] as OrderEntity;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getAll(): Promise<OrderEntity[]> {
    try {
      return await this.orderRepository
        .createQueryBuilder('order')
        .where('order.deletedAt IS NULL')
        .getMany();
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }
}
