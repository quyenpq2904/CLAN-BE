import { Uuid } from '@/common/types/common.type';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import assert from 'assert';
import { UserEntity } from './entities/user.entity';
import { Brackets, Repository } from 'typeorm';
import { UserResDto } from './dto/user.res.dto';
import { ListUserReqDto } from './dto/list-user.req.dto';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { plainToInstance } from 'class-transformer';
import { paginate } from '@/utils/offset-pagination';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOne(id: Uuid): Promise<UserResDto> {
    assert(id, 'id is required');
    const user = await this.userRepository.findOneByOrFail({ id });
    return user.toDto(UserResDto);
  }

  async findAll(
    reqDto: ListUserReqDto,
  ): Promise<OffsetPaginatedDto<UserResDto>> {
    const query = this.userRepository.createQueryBuilder('user');
    if (reqDto.q) {
      query.where(
        new Brackets((qb) => {
          qb.where('user.username ILIKE :q', { q: `%${reqDto.q}%` })
            .orWhere('user.fullName ILIKE :q', { q: `%${reqDto.q}%` })
            .orWhere('user.email ILIKE :q', { q: `%${reqDto.q}%` });
        }),
      );
    }
    query.orderBy('user.createdAt', 'DESC');
    const [users, metaDto] = await paginate<UserEntity>(query, reqDto, {
      skipCount: false,
      takeAll: false,
    });
    return new OffsetPaginatedDto(plainToInstance(UserResDto, users), metaDto);
  }
}
