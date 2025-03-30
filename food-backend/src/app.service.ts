import { Injectable } from '@nestjs/common';
import { KafkaProducerService } from './Application/Infra/Job/Kafka.produce.servicer';

@Injectable()
export class AppService {
  constructor(private readonly kafkaProducerService: KafkaProducerService) {}

  getHello(): string {
    return 'Hello World!';
  }
}
