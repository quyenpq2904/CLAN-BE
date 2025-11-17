import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AttributeService } from './attribute.service';
import { ApiAuth, ApiPublic } from '@/decorators/http-decorators';
import { AttributeResDto } from './dto/attribute.res.dto';
import { UserRole } from '../user/entities/user.entity';
import { CreateAttributeReqDto } from './dto/create-attribute.req.dto';
import { ListAttributeReqDto } from './dto/list-attribute.req.dto';
import { type Uuid } from '@/common/types/common.type';
import { UpdateAttributeReqDto } from './dto/update-attribute.req.dto';

@ApiTags('attributes')
@Controller('attributes')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @ApiAuth({
    type: AttributeResDto,
    summary: 'Create Attribute (Admin)',
    roles: [UserRole.ADMIN],
  })
  @Post()
  async create(@Body() dto: CreateAttributeReqDto): Promise<AttributeResDto> {
    return await this.attributeService.create(dto);
  }

  @ApiPublic({
    type: AttributeResDto,
    summary: 'List attributes',
  })
  @Get()
  async findAll(
    @Query() reqDto: ListAttributeReqDto,
  ): Promise<AttributeResDto[]> {
    return await this.attributeService.findAll(reqDto);
  }

  @ApiPublic({
    type: AttributeResDto,
    summary: 'Get attribute detail (with its values)',
  })
  @Get(':id')
  async findOne(@Param('id') id: Uuid): Promise<AttributeResDto> {
    return await this.attributeService.findOne(id);
  }

  @ApiAuth({
    type: AttributeResDto,
    summary: 'Update Attribute (Admin)',
  })
  @Patch(':id')
  async update(
    @Param('id') id: Uuid,
    @Body() dto: UpdateAttributeReqDto,
  ): Promise<AttributeResDto> {
    return await this.attributeService.update(id, dto);
  }

  @ApiAuth({
    summary: 'Delete Attribute (Admin)',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: Uuid): Promise<void> {
    return await this.attributeService.remove(id);
  }
}
