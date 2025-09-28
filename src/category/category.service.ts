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
    try {
      // Récupérer seulement les catégories parent avec leurs enfants et contenus
      const categories = await this.prisma.category.findMany({
        where: {
          parentCategoryId: null // Seulement les catégories parent
        },
        include: {
          contents: {
            select: {
              name: true,
              slug: true,
              language: true
            }
          },
          children: {
            include: {
              contents: {
                select: {
                  name: true,
                  slug: true,
                  language: true
                }
              }
            },
            orderBy: {
              displayOrder: 'asc'
            }
          }
        },
        orderBy: {
          displayOrder: 'asc'
        }
      });

      // Transformer au format attendu
      return categories.map(category => ({
        id: category.id,
        parentCategoryId: category.parentCategoryId,
        image: category.image,
        displayOrder: category.displayOrder,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        contents: category.contents.map(content => ({
          name: content.name,
          slug: content.slug,
          language: content.language
        })),
        children: category.children.map(child => ({
          id: child.id,
          parentCategoryId: child.parentCategoryId,
          image: child.image,
          displayOrder: child.displayOrder,
          createdAt: child.createdAt,
          updatedAt: child.updatedAt,
          contents: child.contents.map(content => ({
            name: content.name,
            slug: content.slug,
            language: content.language
          }))
        }))
      }));

    } catch (error) {
      console.error('Error in findAll:', error);
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }
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