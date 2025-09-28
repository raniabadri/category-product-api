import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        contents: { create: createProductDto.contents },
        categories: {
          create: createProductDto.categoryIds.map(categoryId => ({
            category: { connect: { id: categoryId } },
          })),
        },
      },
      include: { contents: true, categories: true },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: { contents: true, categories: true },
    });
  }

async search(name?: string, description?: string, minPrice?: number, maxPrice?: number) {
  try {
    return this.prisma.product.findMany({
      include: { contents: true, items: { include: { prices: true } } },
      where: {
        contents: {
          some: {
            OR: [
              name ? { name: { contains: name, mode: 'insensitive' } } : {},
              description ? { description: { contains: description, mode: 'insensitive' } } : {},
            ],
          },
        },
        items: {
          some: {
            prices: {
              some: {
                price: {
                  gte: minPrice || 0,
                  lte: maxPrice || undefined,
                },
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error('Error in search:', error);
    throw new Error('Failed to search products');
  }
}
  async findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { contents: true, categories: true },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: {
        contents: { deleteMany: {}, create: updateProductDto.contents },
        categories: {
          deleteMany: {},
          create: updateProductDto.categoryIds?.map(categoryId => ({
            category: { connect: { id: categoryId } },
          })) || [], // Si undefined, utilise un tableau vide
        },
      },
      include: { contents: true, categories: true },
    });
  }

  async remove(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}