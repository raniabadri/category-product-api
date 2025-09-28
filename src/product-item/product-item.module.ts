import { Module } from '@nestjs/common';
import { ProductItemController } from './product-item.controller';
import { ProductItemService } from './product-item.service';
import { PrismaModule } from '../prisma/prisma.module';
@Module({
  imports: [PrismaModule],
  controllers: [ProductItemController],
  providers: [ProductItemService]
})
export class ProductItemModule {}
