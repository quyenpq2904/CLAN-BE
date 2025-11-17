import { AttributeEntity } from '@/api/attribute/entities/attribute.entity';
import { type Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';

@Entity('attribute-value')
export class AttributeValueEntity extends AbstractEntity {
  constructor(data?: Partial<AttributeValueEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_attribute_value_id',
  })
  id!: Uuid;

  @Column()
  value!: string;

  @Column()
  displayOrder?: number;

  @Column({
    name: 'attribute_id',
    type: 'uuid',
  })
  attributeId: Uuid;

  @Column({ default: true, name: 'is_enabled' })
  isEnabled?: boolean;

  @JoinColumn({
    name: 'attribute_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_attribute_value_attribute',
  })
  @ManyToOne(() => AttributeEntity, (attribute) => attribute.attributeValues)
  attribute: Relation<AttributeEntity>;
}
