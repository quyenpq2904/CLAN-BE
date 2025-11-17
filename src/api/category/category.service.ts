import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryReqDto } from './dto/create-category.req.dto';
import { CategoryResDto } from './dto/category.res.dto';
import { ValidationException } from '@/exceptions/validation.exception';
import { plainToInstance } from 'class-transformer';
import { ListCategoryReqDto } from './dto/list-category.req.dto';
import { Uuid } from '@/common/types/common.type';
import { UpdateCategoryReqDto } from './dto/update-category.req.dto';
import { ErrorCode } from '@/constants/error-code.constant';
import { AttributeResDto } from '../attribute/dto/attribute.res.dto';
import slugify from 'slugify';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(dto: CreateCategoryReqDto): Promise<CategoryResDto> {
    const { name } = dto;

    const isNameExists = await CategoryEntity.exists({ where: { name } });
    if (isNameExists) {
      throw new ValidationException(ErrorCode.E301);
    }

    const slug = slugify(name, { lower: true, strict: true });

    const isSlugExists = await CategoryEntity.exists({ where: { slug } });
    if (isSlugExists) {
      throw new ValidationException(ErrorCode.E302);
    }

    const category = new CategoryEntity({
      ...dto,
      slug,
    });

    await category.save();

    return plainToInstance(CategoryResDto, category);
  }

  async findAll(reqDto: ListCategoryReqDto): Promise<CategoryResDto[]> {
    const query = this.categoryRepository
      .createQueryBuilder('category')
      .where('category.isEnabled = :isEnabled', { isEnabled: true });

    if (reqDto.q) {
      query.andWhere('category.name ILIKE :q', { q: `%${reqDto.q}%` });
    }
    query.orderBy('category.createdAt', 'DESC');

    const categories = await query.getMany();

    return plainToInstance(CategoryResDto, categories);
  }

  async findOne(id: Uuid): Promise<CategoryResDto> {
    const category = await this.categoryRepository.findOne({
      where: { id, isEnabled: true },
    });

    if (!category) {
      throw new NotFoundException(ErrorCode.E303);
    }

    return plainToInstance(CategoryResDto, category);
  }

  async getAttributes(id: Uuid): Promise<AttributeResDto[]> {
    // Kiểm tra category có tồn tại không
    const categoryExists = await this.categoryRepository.exists({
      where: { id },
    });
    if (!categoryExists) {
      throw new NotFoundException(ErrorCode.E303);
    }

    // Query lấy category kèm theo attributes và values của nó
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: {
        attributes: {
          attributeValues: true,
        },
      },
      order: {
        attributes: {
          createdAt: 'ASC',
          attributeValues: {
            displayOrder: 'ASC',
          },
        },
      },
    });

    return plainToInstance(AttributeResDto, category?.attributes || []);
  }

  async update(id: Uuid, dto: UpdateCategoryReqDto): Promise<CategoryResDto> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(ErrorCode.E303);
    }

    if (dto.name && dto.name !== category.name) {
      const isNameExists = await CategoryEntity.exists({
        where: { name: dto.name },
      });
      if (isNameExists) {
        throw new ValidationException(ErrorCode.E301);
      }
      category.slug = slugify(dto.name, { lower: true, strict: true });
    }

    Object.assign(category, dto);
    await category.save();

    return plainToInstance(CategoryResDto, category);
  }

  async remove(id: Uuid): Promise<void> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(ErrorCode.E302);
    }

    // Cần xử lý logic xóa mềm hoặc kiểm tra ràng buộc (vd: còn sản phẩm nào thuộc category này không?)
    // Tạm thời là xóa cứng:
    await this.categoryRepository.remove(category);
  }
}
