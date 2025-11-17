import {
  BooleanField,
  ClassField,
  EnumField,
  StringField,
  UUIDField,
} from '@/decorators/field.decorators';
import { Exclude, Expose, Type } from 'class-transformer';
import { AttributeType } from '../entities/attribute.entity';
import { IsOptional } from 'class-validator';
import { AttributeValueResDto } from '@/api/attribute-value/dto/attribute-value.res.dto';

@Exclude()
export class AttributeResDto {
  @UUIDField()
  @Expose()
  id: string;

  @StringField()
  @Expose()
  name: string;

  @EnumField(() => AttributeType)
  @Expose()
  type: AttributeType;

  @BooleanField()
  @Expose()
  isEnabled: boolean;

  @ClassField(() => Date)
  @Expose()
  createdAt: Date;

  @ClassField(() => Date)
  @Expose()
  updatedAt: Date;

  @ClassField(() => AttributeValueResDto, { isArray: true })
  @Type(() => AttributeValueResDto)
  @Expose()
  @IsOptional()
  attributeValues?: AttributeValueResDto[];
}
