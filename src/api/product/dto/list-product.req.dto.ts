import { PageOptionsDto } from '@/common/dto/offset-pagination/page-options.dto';
import { type Uuid } from '@/common/types/common.type';
import { UUIDFieldOptional } from '@/decorators/field.decorators';

export class ListProductReqDto extends PageOptionsDto {
  @UUIDFieldOptional()
  categoryId?: Uuid;

  @UUIDFieldOptional()
  shopId?: string;
}
