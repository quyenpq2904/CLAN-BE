import { AttributeEntity } from '@/api/attribute/entities/attribute.entity';
import { type Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('category')
export class CategoryEntity extends AbstractEntity {
  constructor(data?: Partial<CategoryEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_category_id',
  })
  id!: Uuid;

  @Column()
  name!: string;

  @Column()
  slug!: string;

  @Column({ default: true, name: 'is_enabled' })
  isEnabled?: boolean;

  @ManyToMany(() => AttributeEntity, (attribute) => attribute.categories)
  @JoinTable({
    name: 'category_attribute',
    joinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'attribute_id',
      referencedColumnName: 'id',
    },
  })
  attributes: AttributeEntity[];
}
