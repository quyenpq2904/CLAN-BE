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

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async create(dto: CreateCategoryReqDto): Promise<CategoryResDto> {
    const { name } = dto;

    const isNameExists = await CategoryEntity.exists({ where: { name } });
    if (isNameExists) {
      throw new ValidationException(ErrorCode.E301);
    }

    const slug = this.generateSlug(name);

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
    const query = this.categoryRepository.createQueryBuilder('category');
    // .where('category.isEnabled = :isEnabled', { isEnabled: true });

    if (reqDto.q) {
      query.andWhere('category.name ILIKE :q', { q: `%${reqDto.q}%` });
    }
    query.orderBy('category.createdAt', 'DESC');

    const categories = await query.getMany();

    return plainToInstance(CategoryResDto, categories);
  }

  async findOne(id: Uuid): Promise<CategoryResDto> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(ErrorCode.E303);
    }

    return plainToInstance(CategoryResDto, category);
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
      category.slug = this.generateSlug(dto.name);
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
