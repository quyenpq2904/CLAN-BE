import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { AddressService } from './address.service';
import { ApiAuth } from '@/decorators/http-decorators';
import { AddressResDto } from './dto/address.res.dto';
import { type Uuid } from '@/common/types/common.type';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { ListAddressReqDto } from './dto/list-address.req.dto';
import { CreateAddressReqDto } from './dto/create-address.req.dto';
import { UpdateAddressReqDto } from './dto/update-address.req.dto';

@ApiTags('addresses')
@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  @ApiAuth({
    summary: 'Get my addresses',
    type: AddressResDto,
    isPaginated: true,
  })
  async getMyAddresses(
    @CurrentUser('id') userId: Uuid,
    @Query() reqDto: ListAddressReqDto,
  ): Promise<OffsetPaginatedDto<AddressResDto>> {
    return await this.addressService.getMyAddresses(userId, reqDto);
  }

  @Post()
  @ApiAuth({
    summary: 'Create address',
    type: AddressResDto,
  })
  async create(
    @CurrentUser('id') userId: Uuid,
    @Body() reqDto: CreateAddressReqDto,
  ): Promise<AddressResDto> {
    return await this.addressService.create(userId, reqDto);
  }

  @Patch(':id')
  @ApiAuth({
    summary: 'Update address',
    type: AddressResDto,
  })
  @ApiParam({ name: 'id', type: 'String' })
  async update(
    @Param('id', ParseUUIDPipe) id: Uuid,
    @CurrentUser('id') userId: Uuid,
    @Body() reqDto: UpdateAddressReqDto,
  ) {
    return await this.addressService.update(id, userId, reqDto);
  }

  @Delete(':id')
  @ApiAuth({
    summary: 'Delete address',
  })
  @ApiParam({ name: 'id', type: 'String' })
  async delete(
    @Param('id', ParseUUIDPipe) id: Uuid,
    @CurrentUser('id') userId: Uuid,
  ): Promise<void> {
    return await this.addressService.delete(id, userId);
  }
}
