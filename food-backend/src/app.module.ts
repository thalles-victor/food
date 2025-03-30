import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from './Application/@shared/env';
import { ThrottlerModule } from '@nestjs/throttler';
import Redis from 'ioredis';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { AuthModule } from './Application/Domains/Auth/Auth.module';
import { APP_PIPE } from '@nestjs/core';
import { ProductModule } from './Application/Domains/Product/Product.module';
import { OrderModule } from './Application/Domains/Order/Order.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaProducerModule } from './Application/Infra/Job/Kafka.producer.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 6000,
          limit: 5,
        },
      ],
      storage: new ThrottlerStorageRedisService(
        new Redis({
          host: env.REDIS_HOST,
          port: env.REDIS_PORT,
          password: env.REDIS_PASSWORD,
        }),
      ),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.POSTGRES_HOST,
      port: env.POSTGRES_PORT,
      username: env.POSTGRES_USER,
      password: env.POSTGRES_PASSWORD,
      database: env.POSTGRES_DB,
      entities: [`${__dirname}/**/*.entity{.js,.ts}`],
      // migrations: [`${__dirname}/migrations/{.ts,*js}`],
      migrationsRun: true,
      synchronize: true,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    AuthModule,
    ProductModule,
    OrderModule,
    KafkaProducerModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true, // Transforma os parâmetros automaticamente
        whitelist: true, // Remove campos não validados
      }),
    },
    AppService,
  ],
})
export class AppModule {}
