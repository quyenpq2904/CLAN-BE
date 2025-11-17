import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { type Uuid } from '@/common/types/common.type';
import { UserResDto } from './dto/user.res.dto';
import { ListUserReqDto } from './dto/list-user.req.dto';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { ApiAuth } from '@/decorators/http-decorators';
import { CurrentUser } from '@/decorators/current-user.decorator';

@ApiTags('users')
@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiAuth({
    type: UserResDto,
    summary: 'Get current user',
  })
  async getCurrentUser(@CurrentUser('id') userId: Uuid): Promise<UserResDto> {
    return await this.userService.findOne(userId);
  }

  @Get()
  @ApiAuth({
    type: UserResDto,
    summary: 'List users',
    isPaginated: true,
  })
  async findAllUsers(
    @Query() reqDto: ListUserReqDto,
  ): Promise<OffsetPaginatedDto<UserResDto>> {
    return await this.userService.findAll(reqDto);
  }
}
