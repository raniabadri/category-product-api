import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductItemDto } from './dto/create-product-item.dto';
import { UpdateProductItemDto } from './dto/update-product-item.dto';

@Injectable()
export class ProductItemService {
  constructor(private prisma: PrismaService) {}

  async create(createProductItemDto: CreateProductItemDto) {
    return this.prisma.productItem.create({
      data: {
        productId: createProductItemDto.productId,
        barcode: createProductItemDto.barcode,
        reference: createProductItemDto.reference,
        image: createProductItemDto.image,
        online: createProductItemDto.online,
        prices: { create: createProductItemDto.prices },
      },
      include: { prices: true },
    });
  }

  async findAll() {
    return this.prisma.productItem.findMany({
      include: { prices: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.productItem.findUnique({
      where: { id },
      include: { prices: true },
    });
  }

  async update(id: string, updateProductItemDto: UpdateProductItemDto) {
    return this.prisma.productItem.update({
      where: { id },
      data: {
        productId: updateProductItemDto.productId,
        barcode: updateProductItemDto.barcode,
        reference: updateProductItemDto.reference,
        image: updateProductItemDto.image,
        online: updateProductItemDto.online,
        prices: { deleteMany: {}, create: updateProductItemDto.prices },
      },
      include: { prices: true },
    });
  }

  async remove(id: string) {
    return this.prisma.productItem.delete({
      where: { id },
    });
  }
}