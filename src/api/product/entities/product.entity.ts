import { CategoryEntity } from '@/api/category/entities/category.entity';
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
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { ProductVariantEntity } from './product-variant.entity';
import { ShopEntity } from '@/api/shop/entities/shop.entity';

export enum ProductStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  HIDDEN = 'hidden',
}

@Entity('product')
export class ProductEntity extends AbstractEntity {
  constructor(data?: Partial<ProductEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_product_id' })
  id!: Uuid;

  @Column()
  name!: string;

  @Column()
  @Index('UQ_product_slug', {
    where: '"deleted_at" IS NULL',
    unique: true,
  })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.DRAFT })
  status!: ProductStatus;

  @Column({ nullable: true })
  thumbnail?: string;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    default: null,
  })
  deletedAt: Date;

  @Column({ name: 'shop_id', type: 'uuid' })
  shopId: Uuid;

  @ManyToOne(() => ShopEntity, (shop) => shop.products)
  @JoinColumn({
    name: 'shop_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_product_shop',
  })
  shop: Relation<ShopEntity>;

  @ManyToMany(() => CategoryEntity)
  @JoinTable({
    name: 'product_category',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: CategoryEntity[];

  @OneToMany(() => ProductVariantEntity, (variant) => variant.product, {
    cascade: true,
  })
  variants: ProductVariantEntity[];
}
