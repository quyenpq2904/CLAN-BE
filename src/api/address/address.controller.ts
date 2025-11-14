import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AddressService } from './address.service';
import { ApiAuth } from '@/decorators/http-decorators';
import { AddressResDto } from './dto/address.res.dto';

@ApiTags('addresses')
@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @ApiAuth({
    summary: 'Get my addresses',
    type: AddressResDto,
  })
  @Get()
  getMyAddresses() {
    return 'get-address';
  }

  @ApiAuth({
    summary: 'Create address',
    type: AddressResDto,
  })
  @Post()
  create() {
    return 'create-address';
  }

  @ApiAuth({
    summary: 'Update address',
    type: AddressResDto,
  })
  @Put()
  update() {
    return 'update-address';
  }

  @ApiAuth({
    summary: 'Delete address',
  })
  @Delete()
  delete() {
    return 'delete-address';
  }
}
