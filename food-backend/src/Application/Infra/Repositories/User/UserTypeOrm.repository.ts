import {
  UserEntity,
  UserUniqueRef,
  UserUpdateEntity,
} from 'src/Application/Entities/User/User.entity';
import { IUserRepositoryContract } from './User.repository-contract';
import { splitKeyAndValue } from 'src/Application/@shared/utils';
import { InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class UserTypeOrmRepository implements IUserRepositoryContract {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(entity: UserEntity): Promise<UserEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(UserEntity)
        .values(entity)
        .returning('*')
        .execute()
        .then((result) => result.generatedMaps[0] as UserEntity);
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getBy(unqRef: UserUniqueRef): Promise<UserEntity | null> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      return await this.userRepository
        .createQueryBuilder('user')
        .where(`user.${key} = :value`, { value })
        .getOne();
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async update(
    unqRef: UserUniqueRef,
    updateEntity: UserUpdateEntity,
  ): Promise<UserEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const updateResult = await this.userRepository
        .createQueryBuilder()
        .update(UserEntity)
        .set(updateEntity)
        .where(`${key} = :value`, { value })
        .returning('*')
        .execute();

      if (!updateResult.affected || updateResult.affected === 0) {
        throw new Error('User not found');
      }

      return updateResult.raw[0] as UserEntity;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async delete(unqRef: UserUniqueRef): Promise<void> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const deleteResult = await this.userRepository
        .createQueryBuilder()
        .delete()
        .from(UserEntity)
        .where(`${key} = :value`, { value })
        .execute();

      if (!deleteResult.affected || deleteResult.affected === 0) {
        throw new Error('User not found');
      }
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async softDelete(unqRef: UserUniqueRef): Promise<UserEntity> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const updateResult = await this.userRepository
        .createQueryBuilder()
        .update(UserEntity)
        .set({ deletedAt: new Date() })
        .where(`${key} = :value AND deletedAt IS NULL`, { value })
        .returning('*')
        .execute();

      if (!updateResult.affected || updateResult.affected === 0) {
        throw new Error('User not found or already deleted');
      }

      return updateResult.raw[0] as UserEntity;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getAll(): Promise<UserEntity[]> {
    try {
      return await this.userRepository
        .createQueryBuilder('user')
        .where('user.deletedAt IS NULL')
        .getMany();
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }
}
