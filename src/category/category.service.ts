import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        parentCategoryId: createCategoryDto.parentCategoryId,
        image: createCategoryDto.image,
        contents: { create: createCategoryDto.contents },
      },
      include: { contents: true }, 
    });
  }

async findAll() {
  return this.prisma.category.findMany({
    where: { parentCategoryId: null }, // Récupère les racines
    include: {
      children: {
        include: { contents: true },
      },
      contents: true,
    },
  });
}
  async findOne(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
      include: { contents: true, children: true },
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: {
        parentCategoryId: updateCategoryDto.parentCategoryId,
        image: updateCategoryDto.image,
        contents: { deleteMany: {}, create: updateCategoryDto.contents }, // Remplace les traductions
      },
      include: { contents: true },
    });
  }

  async remove(id: string) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}