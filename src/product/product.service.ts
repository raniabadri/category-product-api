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
    const params: any[] = [];
    let where = 'WHERE 1=1';
    if (name) {
      where += ' AND pc.name ILIKE $1';
      params.push(`%${name}%`);
    }
    if (description) {
      where += ' AND pc.description ILIKE $2';
      params.push(`%${description}%`);
    }
    const sql = Prisma.sql`
      SELECT p.* FROM "Product" p
      JOIN "ProductContent" pc ON p.id = pc."productId"
      LEFT JOIN "ProductItem" pi ON p.id = pi."productId"
      LEFT JOIN "ProductItemPrice" pip ON pi.id = pip."productItemId"
      ${Prisma.raw(where)}
      GROUP BY p.id
      HAVING MIN(COALESCE(pip.price, 0)) >= COALESCE($3, 0) AND MAX(COALESCE(pip.price, NULL)) <= COALESCE($4, NULL);
    `;
    return await this.prisma.$queryRaw(sql, ...params, minPrice, maxPrice);
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