import { AttributeValueEntity } from '@/api/attribute-value/entities/attribute-value.entity';
import { CategoryEntity } from '@/api/category/entities/category.entity';
import { type Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum AttributeType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
}

@Entity('attribute')
export class AttributeEntity extends AbstractEntity {
  constructor(data?: Partial<AttributeEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_attribute_id',
  })
  id!: Uuid;

  @Column({
    unique: true,
  })
  name!: string;

  @Column({
    enum: AttributeType,
    type: 'enum',
  })
  type!: AttributeType;

  @Column({ default: true, name: 'is_enabled' })
  isEnabled?: boolean;

  @ManyToMany(() => CategoryEntity, (category) => category.attributes)
  categories: CategoryEntity[];

  @OneToMany(
    () => AttributeValueEntity,
    (attributeValue) => attributeValue.attribute,
  )
  attributeValues: AttributeValueEntity[];
}
