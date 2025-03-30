import { Module } from '@nestjs/common';
import { CredentialsService } from './Credentials.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [CredentialsService],
  exports: [CredentialsService],
})
export class CredentialsModule {}
