import { Module } from '@nestjs/common';
import { ProductController } from './Product.controller';
import { ProductService } from './Product.service';
import { KEY_INJECTION } from 'src/Application/@shared/metadata';
import { ProductTypeormRepository } from 'src/Application/Infra/Repositories/Product/ProductTypeorm.repository';
import { RepositoriesModule } from 'src/Application/Infra/Repositories/Repositories.module';

@Module({
  imports: [RepositoriesModule],
  controllers: [ProductController],
  providers: [
    {
      provide: KEY_INJECTION.PRODUCT_REPOSITORY,
      useClass: ProductTypeormRepository,
    },
    ProductService,
  ],
})
export class ProductModule {}
