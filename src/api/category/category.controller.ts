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
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { ApiAuth, ApiPublic } from '@/decorators/http-decorators';
import { CategoryResDto } from './dto/category.res.dto';
import { CreateCategoryReqDto } from './dto/create-category.req.dto';
import { ListCategoryReqDto } from './dto/list-category.req.dto';
import { type Uuid } from '@/common/types/common.type';
import { UpdateCategoryReqDto } from './dto/update-category.req.dto';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { type JwtPayloadType } from '../auth/types/jwt-payload.type';
import { UserRole } from '../user/entities/user.entity';
import { AttributeResDto } from '../attribute/dto/attribute.res.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiAuth({
    type: CategoryResDto,
    summary: 'Create Category (Admin)',
    roles: [UserRole.ADMIN],
  })
  @Post()
  async create(
    @Body() dto: CreateCategoryReqDto,
    @CurrentUser() currentUser: JwtPayloadType,
  ): Promise<CategoryResDto> {
    if (currentUser.role !== UserRole.ADMIN) {
      throw new UnauthorizedException();
    }

    return await this.categoryService.create(dto);
  }

  @ApiPublic({
    type: CategoryResDto,
    summary: 'List categories',
  })
  @Get()
  async findAll(
    @Query() reqDto: ListCategoryReqDto,
  ): Promise<CategoryResDto[]> {
    return await this.categoryService.findAll(reqDto);
  }

  @ApiPublic({
    type: CategoryResDto,
    summary: 'Get category detail',
  })
  @Get(':id')
  async findOne(@Param('id') id: Uuid): Promise<CategoryResDto> {
    return await this.categoryService.findOne(id);
  }

  @ApiPublic({
    type: AttributeResDto,
    summary: 'Get all attributes of a specific category',
  })
  @Get(':id/attributes')
  async getAttributes(@Param('id') id: Uuid): Promise<AttributeResDto[]> {
    return await this.categoryService.getAttributes(id);
  }

  @ApiAuth({
    type: CategoryResDto,
    summary: 'Update Category (Admin)',
    roles: [UserRole.ADMIN],
  })
  @Patch(':id')
  async update(
    @Param('id') id: Uuid,
    @Body() dto: UpdateCategoryReqDto,
  ): Promise<CategoryResDto> {
    return await this.categoryService.update(id, dto);
  }

  @ApiAuth({
    summary: 'Delete Category (Admin)',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: Uuid): Promise<void> {
    return await this.categoryService.remove(id);
  }
}
