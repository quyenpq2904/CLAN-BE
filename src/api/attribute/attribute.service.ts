import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttributeEntity } from './entities/attribute.entity';
import { Repository } from 'typeorm';
import { CreateAttributeReqDto } from './dto/create-attribute.req.dto';
import { AttributeResDto } from './dto/attribute.res.dto';
import { ValidationException } from '@/exceptions/validation.exception';
import { plainToInstance } from 'class-transformer';
import { ListAttributeReqDto } from './dto/list-attribute.req.dto';
import { Uuid } from '@/common/types/common.type';
import { UpdateAttributeReqDto } from './dto/update-attribute.req.dto';
import { ErrorCode } from '@/constants/error-code.constant';

@Injectable()
export class AttributeService {
  constructor(
    @InjectRepository(AttributeEntity)
    private readonly attributeRepository: Repository<AttributeEntity>,
  ) {}

  async create(dto: CreateAttributeReqDto): Promise<AttributeResDto> {
    const { name } = dto;

    const isNameExists = await AttributeEntity.exists({ where: { name } });
    if (isNameExists) {
      throw new ValidationException(ErrorCode.E400);
    }

    const attribute = new AttributeEntity(dto);

    await attribute.save();

    return plainToInstance(AttributeResDto, attribute);
  }

  async findAll(reqDto: ListAttributeReqDto): Promise<AttributeResDto[]> {
    const query = this.attributeRepository.createQueryBuilder('attribute');

    if (reqDto.q) {
      query.andWhere('attribute.name ILIKE :q', { q: `%${reqDto.q}%` });
    }

    if (reqDto.type) {
      query.andWhere('attribute.type = :type', { type: reqDto.type });
    }

    query.orderBy('attribute.createdAt', 'DESC');

    // Không load "attributeValues" khi list để tránh N+1
    const attributes = await query.getMany();

    return plainToInstance(AttributeResDto, attributes);
  }

  async findOne(id: Uuid): Promise<AttributeResDto> {
    const attribute = await this.attributeRepository.findOne({
      where: { id },
      relations: ['attributeValues'], // Load cả các values
    });

    if (!attribute) {
      throw new NotFoundException(ErrorCode.E401);
    }

    // Sắp xếp attributeValues theo displayOrder nếu có
    if (attribute.attributeValues) {
      attribute.attributeValues.sort((a, b) => {
        const orderA = a.displayOrder ?? Infinity;
        const orderB = b.displayOrder ?? Infinity;
        return orderA - orderB;
      });
    }

    return plainToInstance(AttributeResDto, attribute);
  }

  async update(id: Uuid, dto: UpdateAttributeReqDto): Promise<AttributeResDto> {
    const attribute = await this.attributeRepository.findOne({ where: { id } });
    if (!attribute) {
      throw new NotFoundException(ErrorCode.E401);
    }

    if (dto.name && dto.name !== attribute.name) {
      const isNameExists = await AttributeEntity.exists({
        where: { name: dto.name },
      });
      if (isNameExists) {
        throw new ValidationException(ErrorCode.E400);
      }
    }

    // Cần check logic nếu thay đổi "type" (vd: từ string -> select)
    // Tạm thời cho phép update
    Object.assign(attribute, dto);
    await attribute.save();

    return plainToInstance(AttributeResDto, attribute);
  }

  async remove(id: Uuid): Promise<void> {
    const attribute = await this.attributeRepository.findOne({ where: { id } });
    if (!attribute) {
      throw new NotFoundException(ErrorCode.E401);
    }

    // Cần kiểm tra xem attribute này có đang được sử dụng ở
    // 1. Bảng category_attribute
    // 2. Bảng attribute_value (nếu có values)
    // 3. Bảng product_attribute_value
    // Nếu có thì không cho xóa.
    // Tạm thời xóa cứng:
    await this.attributeRepository.remove(attribute);
  }
}
