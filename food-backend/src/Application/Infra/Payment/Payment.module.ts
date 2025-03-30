import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import {} from 'http';
import { PaymentService } from './Payment.service';
import { CredentialsModule } from '../Credentials/Credentials.module';

@Module({
  imports: [HttpModule, CredentialsModule],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
