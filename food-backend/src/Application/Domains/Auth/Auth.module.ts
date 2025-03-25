import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'src/Application/@shared/env';
import { RepositoriesModule } from 'src/Application/Infra/Repositories/Repositories.module';
import { AuthController } from './Auth.controller';
import { UserTypeOrmRepository } from 'src/Application/Infra/Repositories/User/UserTypeOrm.repository';
import { KEY_INJECTION } from 'src/Application/@shared/metadata';
import { AuthService } from './Auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: env.JWT_SECRET,
      verifyOptions: {
        ignoreExpiration: false,
      },
      signOptions: {
        expiresIn: env.JWT_EXPIRES_IN,
      },
      global: true,
    }),
    RepositoriesModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: KEY_INJECTION.USER_REPOSITORY,
      useClass: UserTypeOrmRepository,
    },
    AuthService,
  ],
})
export class AuthModule {}
