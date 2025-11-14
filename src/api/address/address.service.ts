import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from './entities/address.entity';
import { Repository } from 'typeorm';
import { Uuid } from '@/common/types/common.type';
import { plainToInstance } from 'class-transformer';
import { ListAddressReqDto } from './dto/list-address.req.dto';
import { paginate } from '@/utils/offset-pagination';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { AddressResDto } from './dto/address.res.dto';
import { CreateAddressReqDto } from './dto/create-address.req.dto';
import { UpdateAddressReqDto } from './dto/update-address.req.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
  ) {}

  async getMyAddresses(
    userId: Uuid,
    reqDto: ListAddressReqDto,
  ): Promise<OffsetPaginatedDto<AddressResDto>> {
    const query = this.addressRepository
      .createQueryBuilder('address')
      .where('address.userId = :userId', { userId });

    const [addresses, metaDto] = await paginate<AddressEntity>(query, reqDto, {
      skipCount: true,
      takeAll: false,
    });

    return new OffsetPaginatedDto(
      plainToInstance(AddressResDto, addresses),
      metaDto,
    );
  }

  async create(userId: Uuid, dto: CreateAddressReqDto): Promise<AddressResDto> {
    const address = new AddressEntity({
      ...dto,
      userId,
    });
    await address.save();
    return plainToInstance(AddressResDto, address);
  }

  async update(
    id: Uuid,
    userId: Uuid,
    dto: UpdateAddressReqDto,
  ): Promise<AddressResDto> {
    const address = await this.addressRepository.findOneOrFail({
      where: { id, userId },
    });
    Object.assign(address, dto);
    await address.save();
    return plainToInstance(AddressResDto, address);
  }

  async delete(id: Uuid, userId: Uuid): Promise<void> {
    await this.addressRepository.delete({ id, userId });
  }
}
