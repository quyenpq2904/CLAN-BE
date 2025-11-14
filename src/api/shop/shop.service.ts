import { Injectable } from '@nestjs/common';
import { CreateShopReqDto } from './dto/create-shop.req.dto';
import { ShopResDto } from './dto/shop.res.dto';
import { type Uuid } from '@/common/types/common.type';
import { ShopEntity } from './entities/shop.entity';
import { plainToInstance } from 'class-transformer';
import { ListMyShopReqDto } from './dto/list-my-shop.req.dto';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate } from '@/utils/offset-pagination';
import { FilesService } from '@/files/filles.service';
import { FilePrefix } from '@/constants/file-prefix.constant';
import { ValidationException } from '@/exceptions/validation.exception';
import { ErrorCode } from '@/constants/error-code.constant';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(ShopEntity)
    private readonly shopRepository: Repository<ShopEntity>,
    private readonly filesService: FilesService,
  ) {}

  async create(
    userId: Uuid,
    dto: CreateShopReqDto,
    avatarFile?: Express.Multer.File,
    bannerFile?: Express.Multer.File,
  ): Promise<ShopResDto> {
    const { address, description, email, name, phoneNumber } = dto;

    const isShopExists = await ShopEntity.exists({ where: { name } });
    if (isShopExists) {
      throw new ValidationException(ErrorCode.E200);
    }

    if (avatarFile) {
      dto.avatar = await this.filesService.uploadImage(
        avatarFile,
        FilePrefix.SHOP_AVATAR,
      );
    }
    if (bannerFile) {
      dto.banner = await this.filesService.uploadImage(
        bannerFile,
        FilePrefix.SHOP_BANNER,
      );
    }

    const shop = new ShopEntity({
      address,
      description,
      email,
      name,
      phoneNumber,
      userId,
      avatar: dto.avatar,
      banner: dto.banner,
    });

    await shop.save();

    return plainToInstance(ShopResDto, shop);
  }

  async getMyShop(
    userId: Uuid,
    reqDto: ListMyShopReqDto,
  ): Promise<OffsetPaginatedDto<ShopResDto>> {
    const query = this.shopRepository
      .createQueryBuilder('shop')
      .where('shop.userId = :userId', { userId });
    if (reqDto.q) {
      query.andWhere('shop.name ILIKE :q', { q: `%${reqDto.q}%` });
    }
    query.orderBy('shop.createdAt', 'DESC');

    const [shops, metaDto] = await paginate<ShopEntity>(query, reqDto, {
      skipCount: false,
      takeAll: false,
    });

    return new OffsetPaginatedDto(plainToInstance(ShopResDto, shops), metaDto);
  }
}
