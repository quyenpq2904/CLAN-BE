import { type Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { ProductEntity } from './product.entity';
import { AttributeValueEntity } from '@/api/attribute-value/entities/attribute-value.entity';

@Entity('product_variant')
export class ProductVariantEntity extends AbstractEntity {
  constructor(data?: Partial<ProductVariantEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_product_variant_id',
  })
  id!: Uuid;

  @Column({ name: 'product_id', type: 'uuid' })
  productId!: Uuid;

  @Column()
  @Index('UQ_product_variant_sku', {
    where: '"deleted_at" IS NULL',
    unique: true,
  })
  sku!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  price!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  marketPrice?: number;

  @Column({ type: 'int', default: 0 })
  stockQuantity!: number;

  @Column({ nullable: true })
  image?: string;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    default: null,
  })
  deletedAt: Date;

  @JoinColumn({ name: 'product_id' })
  @ManyToOne(() => ProductEntity, (product) => product.variants, {
    onDelete: 'CASCADE',
    // Lưu ý: onDelete: 'CASCADE' của DB là xóa cứng.
    // Nhưng vì Product dùng Soft Delete, TypeORM sẽ không kích hoạt trigger DB này khi bạn gọi hàm softRemove().
    // Thay vào đó, TypeORM sẽ tự update cột deleted_at của variant nhờ `cascade: true` bên Product.
  })
  product: Relation<ProductEntity>;

  @ManyToMany(() => AttributeValueEntity)
  @JoinTable({
    name: 'variant_attribute_value',
    joinColumn: { name: 'variant_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'attribute_value_id',
      referencedColumnName: 'id',
    },
  })
  attributeValues: AttributeValueEntity[];
}
