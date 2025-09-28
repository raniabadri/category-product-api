import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ProductItemModule } from './product-item/product-item.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [CategoryModule, ProductModule, ProductItemModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
