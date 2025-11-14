import { ApiAuth } from '@/decorators/http-decorators';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ShopResDto } from './dto/shop.res.dto';
import { CreateShopReqDto } from './dto/create-shop.req.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ShopService } from './shop.service';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { type Uuid } from '@/common/types/common.type';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { ListMyShopReqDto } from './dto/list-my-shop.req.dto';

@ApiTags('shops')
@Controller('shops')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @ApiAuth({
    type: ShopResDto,
    summary: 'List my shops',
    isPaginated: true,
  })
  @Get('me')
  async getMyShop(
    @CurrentUser('id') userId: Uuid,
    @Query() reqDto: ListMyShopReqDto,
  ): Promise<OffsetPaginatedDto<ShopResDto>> {
    return await this.shopService.getMyShop(userId, reqDto);
  }

  @ApiAuth({
    type: ShopResDto,
    summary: 'Create Shop',
  })
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'banner', maxCount: 1 },
    ]),
  )
  async create(
    @CurrentUser('id') userId: Uuid,
    @Body() dto: CreateShopReqDto,
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[];
      banner?: Express.Multer.File[];
    },
  ): Promise<ShopResDto> {
    const avatarFile = files.avatar?.[0];
    const bannerFile = files.banner?.[0];

    return await this.shopService.create(userId, dto, avatarFile, bannerFile);
  }
}
