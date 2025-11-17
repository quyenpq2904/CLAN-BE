import {
  ClassField,
  DateField,
  EnumField,
  NumberField,
  StringField,
  StringFieldOptional,
  UUIDField,
} from '@/decorators/field.decorators';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ProductEntity, ProductStatus } from '../entities/product.entity';
import { ProductVariantResDto } from './product-variant.res.dto';

export const PRODUCT_GROUP = {
  LIST: 'PRODUCT_LIST',
  DETAIL: 'PRODUCT_DETAIL',
};

@Exclude()
export class ProductResDto {
  @UUIDField()
  @Expose({ groups: [PRODUCT_GROUP.LIST, PRODUCT_GROUP.DETAIL] })
  id: string;

  @StringField()
  @Expose({ groups: [PRODUCT_GROUP.LIST, PRODUCT_GROUP.DETAIL] })
  name: string;

  @StringField()
  @Expose({ groups: [PRODUCT_GROUP.LIST, PRODUCT_GROUP.DETAIL] })
  slug: string;

  @StringFieldOptional()
  @Expose({ groups: [PRODUCT_GROUP.DETAIL] })
  description?: string;

  @StringFieldOptional()
  @Expose({ groups: [PRODUCT_GROUP.LIST, PRODUCT_GROUP.DETAIL] })
  thumbnail?: string;

  @EnumField(() => ProductStatus)
  @Expose({ groups: [PRODUCT_GROUP.DETAIL] })
  status: ProductStatus;

  @UUIDField()
  @Expose({ groups: [PRODUCT_GROUP.LIST, PRODUCT_GROUP.DETAIL] })
  shopId: string;

  @NumberField()
  @Expose()
  @Transform(({ obj }: { obj: ProductEntity }) => {
    if (!obj.variants?.length) return 0;
    return Math.min(...obj.variants.map((v) => Number(v.price)));
  })
  minPrice: number;

  @NumberField()
  @Expose()
  @Transform(({ obj }: { obj: ProductEntity }) => {
    if (!obj.variants?.length) return 0;
    return Math.max(...obj.variants.map((v) => Number(v.price)));
  })
  maxPrice: number;

  @ClassField(() => ProductVariantResDto, { each: true })
  @Expose({ groups: [PRODUCT_GROUP.DETAIL] })
  variants: ProductVariantResDto[];

  @DateField()
  @Expose({ groups: [PRODUCT_GROUP.DETAIL] })
  createdAt: Date;

  @DateField()
  @Expose({ groups: [PRODUCT_GROUP.DETAIL] })
  updatedAt: Date;
}
