import { Global, Module } from '@nestjs/common';
import { KafkaProducerService } from './Kafka.produce.servicer';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'food-app',
            brokers: ['localhost:9092'], // Matches the advertised listener from Docker Compose
          },
        },
      },
    ]),
  ],
  providers: [KafkaProducerService],
  exports: [KafkaProducerService],
})
export class KafkaProducerModule {}
