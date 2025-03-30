import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

interface SavePaymentInBankProps {
  orderId: string;
}

export class KafkaProducerService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  test(message: string) {
    this.kafkaClient.emit('test_topic', { message });
  }

  savePaymentInBank(data: SavePaymentInBankProps) {
    this.kafkaClient.emit('payment-confirmation-topic', { message: data });
  }
}
