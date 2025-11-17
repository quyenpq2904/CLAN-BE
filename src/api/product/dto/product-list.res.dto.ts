import { OmitType } from '@nestjs/swagger';
import { ProductResDto } from './product.res.dto';

export class ProductListResDto extends OmitType(ProductResDto, [
  'variants',
  'description',
] as const) {}
