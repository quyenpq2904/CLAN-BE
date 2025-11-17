import { ApiAuth, ApiPublic } from '@/decorators/http-decorators';
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
import { AttributeValueResDto } from './dto/attribute-value.res.dto';
import { CreateAttributeValueReqDto } from './dto/create-attribute.req.dto';
import { ListAttributeValueReqDto } from './dto/list-attribute.res.dto';
import { type Uuid } from '@/common/types/common.type';
import { UpdateAttributeValueReqDto } from './dto/update-attribute.req.dto';
import { AttributeValueService } from './attribute-value.service';

@ApiTags('attribute-values')
@Controller('attribute-values')
export class AttributeValueController {
  constructor(private readonly attributeValueService: AttributeValueService) {}

  @ApiAuth({
    type: AttributeValueResDto,
    summary: 'Create Attribute Value (Admin)',
  })
  @Post()
  async create(
    @Body() dto: CreateAttributeValueReqDto,
  ): Promise<AttributeValueResDto> {
    return await this.attributeValueService.create(dto);
  }

  @ApiPublic({
    type: AttributeValueResDto,
    summary: 'List attribute values (must provide attributeId)',
  })
  @Get()
  async findAll(
    @Query() reqDto: ListAttributeValueReqDto,
  ): Promise<AttributeValueResDto[]> {
    return await this.attributeValueService.findAll(reqDto);
  }

  @ApiPublic({
    type: AttributeValueResDto,
    summary: 'Get attribute value detail',
  })
  @Get(':id')
  async findOne(@Param('id') id: Uuid): Promise<AttributeValueResDto> {
    return await this.attributeValueService.findOne(id);
  }

  @ApiAuth({
    type: AttributeValueResDto,
    summary: 'Update Attribute Value (Admin)',
  })
  @Patch(':id')
  async update(
    @Param('id') id: Uuid,
    @Body() dto: UpdateAttributeValueReqDto,
  ): Promise<AttributeValueResDto> {
    return await this.attributeValueService.update(id, dto);
  }

  @ApiAuth({
    summary: 'Delete Attribute Value (Admin)',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: Uuid): Promise<void> {
    return await this.attributeValueService.remove(id);
  }
}
