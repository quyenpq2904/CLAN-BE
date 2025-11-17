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
import { ProductService } from './product.service';
import { ApiAuth, ApiPublic } from '@/decorators/http-decorators';
import { ProductResDto } from './dto/product.res.dto';
import { CreateProductReqDto } from './dto/create-product.req.dto';
import { ListProductReqDto } from './dto/list-product.req.dto';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { type Uuid } from '@/common/types/common.type';
import { UpdateProductReqDto } from './dto/update-product.req.dto';
import { ProductVariantResDto } from './dto/product-variant.res.dto';
import { CreateVariantReqDto } from './dto/create-variant.req.dto';
import { UpdateVariantReqDto } from './dto/update-variant.req.dto';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { ProductListResDto } from './dto/product-list.res.dto';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiAuth({
    type: ProductResDto,
    summary: 'Create Product (Requires shopId in body)',
  })
  @Post('products')
  async create(
    @CurrentUser('id') userId: Uuid,
    @Body() dto: CreateProductReqDto,
  ): Promise<ProductResDto> {
    return await this.productService.create(userId, dto);
  }

  @ApiPublic({
    type: ProductListResDto,
    summary: 'List Products',
    isPaginated: true,
  })
  @Get('products')
  async findAll(
    @Query() reqDto: ListProductReqDto,
  ): Promise<OffsetPaginatedDto<ProductResDto>> {
    return await this.productService.findAll(reqDto);
  }

  @ApiPublic({
    type: ProductResDto,
    summary: 'Get Product Detail',
  })
  @Get('products/:id')
  async findOne(@Param('id') id: Uuid): Promise<ProductResDto> {
    return await this.productService.findOne(id);
  }

  @ApiAuth({
    type: ProductResDto,
    summary: 'Update Product Info (Owner only)',
  })
  @Patch('products/:id')
  async update(
    @CurrentUser('id') userId: Uuid,
    @Param('id') id: Uuid,
    @Body() dto: UpdateProductReqDto,
  ): Promise<ProductResDto> {
    return await this.productService.update(userId, id, dto);
  }

  @ApiAuth({
    summary: 'Soft Delete Product (Owner only)',
  })
  @Delete('products/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @CurrentUser('id') userId: Uuid,
    @Param('id') id: Uuid,
  ): Promise<void> {
    return await this.productService.remove(userId, id);
  }

  @ApiAuth({
    type: ProductVariantResDto,
    summary: 'Add Variant to Product (Owner only)',
  })
  @Post('products/:id/variants')
  async addVariant(
    @CurrentUser('id') userId: Uuid,
    @Param('id') productId: Uuid,
    @Body() dto: CreateVariantReqDto,
  ): Promise<ProductVariantResDto> {
    return await this.productService.addVariant(userId, productId, dto);
  }

  @ApiAuth({
    type: ProductVariantResDto,
    summary: 'Update Specific Variant (Owner only)',
  })
  @Patch('product-variants/:id')
  async updateVariant(
    @CurrentUser('id') userId: Uuid,
    @Param('id') variantId: Uuid,
    @Body() dto: UpdateVariantReqDto,
  ): Promise<ProductVariantResDto> {
    return await this.productService.updateVariant(userId, variantId, dto);
  }

  @ApiAuth({
    summary: 'Soft Delete Variant (Owner only)',
  })
  @Delete('product-variants/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeVariant(
    @CurrentUser('id') userId: Uuid,
    @Param('id') variantId: Uuid,
  ): Promise<void> {
    return await this.productService.removeVariant(userId, variantId);
  }
}
