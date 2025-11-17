import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttributeValueEntity } from './entities/attribute-value.entity';
import { Repository } from 'typeorm';
import { CreateAttributeValueReqDto } from './dto/create-attribute.req.dto';
import { AttributeValueResDto } from './dto/attribute-value.res.dto';
import { ErrorCode } from '@/constants/error-code.constant';
import { ValidationException } from '@/exceptions/validation.exception';
import { type Uuid } from '@/common/types/common.type';
import { plainToInstance } from 'class-transformer';
import { ListAttributeValueReqDto } from './dto/list-attribute.res.dto';
import { UpdateAttributeValueReqDto } from './dto/update-attribute.req.dto';
import { AttributeEntity } from '../attribute/entities/attribute.entity';

@Injectable()
export class AttributeValueService {
  constructor(
    @InjectRepository(AttributeValueEntity)
    private readonly attributeValueRepository: Repository<AttributeValueEntity>,
    @InjectRepository(AttributeEntity)
    private readonly attributeRepository: Repository<AttributeEntity>,
  ) {}

  async create(dto: CreateAttributeValueReqDto): Promise<AttributeValueResDto> {
    const { attributeId, value } = dto;

    // 1. Kiểm tra Attribute cha có tồn tại không
    const attributeExists = await this.attributeRepository.exists({
      where: { id: attributeId },
    });
    if (!attributeExists) {
      throw new NotFoundException(ErrorCode.E451);
    }

    // 2. Kiểm tra value có bị trùng trong attribute này không
    const isValueExists = await this.attributeValueRepository.exists({
      where: { attributeId, value },
    });
    if (isValueExists) {
      throw new ValidationException(ErrorCode.E450);
    }

    const attributeValue = new AttributeValueEntity(dto);
    await attributeValue.save();

    return plainToInstance(AttributeValueResDto, attributeValue);
  }

  async findAll(
    reqDto: ListAttributeValueReqDto,
  ): Promise<AttributeValueResDto[]> {
    const { attributeId, q } = reqDto;

    // Bắt buộc phải có attributeId
    const query = this.attributeValueRepository
      .createQueryBuilder('attributeValue')
      .where('attributeValue.attributeId = :attributeId', { attributeId });

    if (q) {
      query.andWhere('attributeValue.value ILIKE :q', { q: `%${q}%` });
    }

    query
      .orderBy('attributeValue.displayOrder', 'ASC') // Ưu tiên sắp xếp theo displayOrder
      .addOrderBy('attributeValue.createdAt', 'ASC');

    const values = await query.getMany();

    return plainToInstance(AttributeValueResDto, values);
  }

  async findOne(id: Uuid): Promise<AttributeValueResDto> {
    const attributeValue = await this.attributeValueRepository.findOne({
      where: { id },
    });

    if (!attributeValue) {
      throw new NotFoundException(ErrorCode.E451);
    }

    return plainToInstance(AttributeValueResDto, attributeValue);
  }

  async update(
    id: Uuid,
    dto: UpdateAttributeValueReqDto,
  ): Promise<AttributeValueResDto> {
    const attributeValue = await this.attributeValueRepository.findOne({
      where: { id },
    });
    if (!attributeValue) {
      throw new NotFoundException(ErrorCode.E451);
    }

    if (dto.value && dto.value !== attributeValue.value) {
      // Nếu đổi value, kiểm tra trùng
      const isValueExists = await this.attributeValueRepository.exists({
        where: {
          attributeId: attributeValue.attributeId, // trong cùng attribute
          value: dto.value,
        },
      });
      if (isValueExists) {
        throw new ValidationException(ErrorCode.E450);
      }
    }

    Object.assign(attributeValue, dto);
    await attributeValue.save();

    return plainToInstance(AttributeValueResDto, attributeValue);
  }

  async remove(id: Uuid): Promise<void> {
    const attributeValue = await this.attributeValueRepository.findOne({
      where: { id },
    });
    if (!attributeValue) {
      throw new NotFoundException(ErrorCode.E451);
    }

    // Cần kiểm tra xem value này có đang được dùng trong
    // 1. Bảng variant_attribute_value
    // 2. Bảng product_attribute_value
    // Nếu có thì không cho xóa
    // Tạm thời xóa cứng:
    await this.attributeValueRepository.remove(attributeValue);
  }
}
