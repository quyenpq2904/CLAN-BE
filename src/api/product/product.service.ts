import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity, ProductStatus } from './entities/product.entity';
import { DataSource, In, Repository } from 'typeorm';
import { CreateProductReqDto } from './dto/create-product.req.dto';
import { CategoryEntity } from '../category/entities/category.entity';
import { ValidationException } from '@/exceptions/validation.exception';
import { ErrorCode } from '@/constants/error-code.constant';
import { ProductVariantEntity } from './entities/product-variant.entity';
import { AttributeValueEntity } from '../attribute-value/entities/attribute-value.entity';
import { PRODUCT_GROUP, ProductResDto } from './dto/product.res.dto';
import { ListProductReqDto } from './dto/list-product.req.dto';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { paginate } from '@/utils/offset-pagination';
import { plainToInstance } from 'class-transformer';
import { Uuid } from '@/common/types/common.type';
import { UpdateProductReqDto } from './dto/update-product.req.dto';
import { CreateVariantReqDto } from './dto/create-variant.req.dto';
import { ProductVariantResDto } from './dto/product-variant.res.dto';
import { UpdateVariantReqDto } from './dto/update-variant.req.dto';
import { ShopEntity } from '../shop/entities/shop.entity';
import slugify from 'slugify';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    @InjectRepository(ProductVariantEntity)
    private readonly variantRepo: Repository<ProductVariantEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async create(userId: Uuid, dto: CreateProductReqDto): Promise<ProductResDto> {
    const { name, categoryIds, variants, shopId, ...rest } = dto;

    const slug =
      slugify(name, { lower: true, strict: true }) + '-' + Date.now();

    return await this.dataSource.transaction(async (manager) => {
      const shop = await manager.findOne(ShopEntity, {
        where: { id: shopId },
      });

      if (!shop) {
        throw new NotFoundException(ErrorCode.E201);
      }

      if (shop.userId !== userId) {
        throw new ForbiddenException();
      }

      const categories = await manager.findBy(CategoryEntity, {
        id: In(categoryIds),
      });
      if (categories.length !== categoryIds.length) {
        throw new ValidationException(ErrorCode.E303);
      }

      const product = new ProductEntity({
        ...rest,
        name,
        slug,
        status: ProductStatus.ACTIVE,
        categories,
        shop,
      });
      const savedProduct = await manager.save(product);

      const variantEntities: ProductVariantEntity[] = [];
      for (const vDto of variants) {
        const attrValues = await manager.findBy(AttributeValueEntity, {
          id: In(vDto.attributeValueIds),
        });
        if (attrValues.length !== vDto.attributeValueIds.length) {
          throw new ValidationException(ErrorCode.E451);
        }

        const variant = new ProductVariantEntity({
          product: savedProduct,
          sku: vDto.sku,
          price: vDto.price,
          marketPrice: vDto.marketPrice,
          stockQuantity: vDto.stockQuantity,
          image: vDto.image,
          attributeValues: attrValues,
        });
        variantEntities.push(variant);
      }

      await manager.save(ProductVariantEntity, variantEntities);

      return this.findOne(savedProduct.id);
    });
  }

  async findAll(
    reqDto: ListProductReqDto,
  ): Promise<OffsetPaginatedDto<ProductResDto>> {
    const query = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.variants', 'variants')
      .leftJoinAndSelect('product.categories', 'category')
      .innerJoinAndSelect('product.shop', 'shop')
      .where('product.status = :status', { status: ProductStatus.ACTIVE });

    if (reqDto.q) {
      query.andWhere('product.name ILIKE :q', { q: `%${reqDto.q}%` });
    }

    if (reqDto.categoryId) {
      query.andWhere('category.id = :catId', { catId: reqDto.categoryId });
    }

    if (reqDto.shopId) {
      query.andWhere('product.shop_id = :shopId', { shopId: reqDto.shopId });
    }

    query.orderBy('product.createdAt', 'DESC');

    const [products, meta] = await paginate<ProductEntity>(query, reqDto);
    return new OffsetPaginatedDto(
      plainToInstance(ProductResDto, products, {
        groups: [PRODUCT_GROUP.LIST],
      }),
      meta,
    );
  }

  async findOne(id: Uuid): Promise<ProductResDto> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: [
        'categories',
        'variants',
        'variants.attributeValues',
        'variants.attributeValues.attribute',
        'shop',
      ],
      order: {
        variants: { price: 'ASC' },
      },
    });

    if (!product) throw new NotFoundException(ErrorCode.E501);

    return plainToInstance(ProductResDto, product, {
      groups: [PRODUCT_GROUP.DETAIL],
    });
  }

  async update(
    userId: Uuid,
    id: Uuid,
    dto: UpdateProductReqDto,
  ): Promise<ProductResDto> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['shop'],
    });

    if (!product) throw new NotFoundException(ErrorCode.E501);

    if (product.shop.userId !== userId) {
      throw new ForbiddenException();
    }

    if (dto.categoryIds) {
      const categories = await this.productRepo.manager.findBy(CategoryEntity, {
        id: In(dto.categoryIds),
      });
      product.categories = categories;
    }

    Object.assign(product, dto);
    await this.productRepo.save(product);

    return this.findOne(id);
  }

  async remove(userId: Uuid, id: Uuid): Promise<void> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['variants', 'shop'],
    });
    if (!product) throw new NotFoundException(ErrorCode.E451);

    if (product.shop.userId !== userId) {
      throw new ForbiddenException();
    }

    await this.dataSource.transaction(async (manager) => {
      if (product.variants.length > 0) {
        await manager.softRemove(product.variants);
      }
      await manager.softRemove(product);
    });
  }

  async addVariant(
    userId: Uuid,
    productId: Uuid,
    dto: CreateVariantReqDto,
  ): Promise<ProductVariantResDto> {
    const product = await this.productRepo.findOne({
      where: {
        id: productId,
      },
      relations: ['shop'],
    });
    if (!product) throw new NotFoundException(ErrorCode.E451);

    if (product.shop.userId !== userId) {
      throw new ForbiddenException();
    }

    const attrValues = await this.variantRepo.manager.findBy(
      AttributeValueEntity,
      { id: In(dto.attributeValueIds) },
    );

    const variant = new ProductVariantEntity({
      ...dto,
      product,
      attributeValues: attrValues,
    });

    await this.variantRepo.save(variant);
    return plainToInstance(ProductVariantResDto, variant);
  }

  async updateVariant(
    userId: Uuid,
    variantId: Uuid,
    dto: UpdateVariantReqDto,
  ): Promise<ProductVariantResDto> {
    const variant = await this.variantRepo.findOne({
      where: { id: variantId },
      relations: ['product', 'product.shop'],
    });

    if (!variant) throw new NotFoundException(ErrorCode.E551);

    if (variant.product.shop.userId !== userId) {
      throw new ForbiddenException();
    }

    Object.assign(variant, dto);
    await this.variantRepo.save(variant);

    return plainToInstance(ProductVariantResDto, variant);
  }

  async removeVariant(userId: Uuid, variantId: Uuid): Promise<void> {
    const variant = await this.variantRepo.findOne({
      where: {
        id: variantId,
      },
      relations: ['product', 'product.shop'],
    });

    if (!variant) throw new NotFoundException(ErrorCode.E551);

    if (variant.product.shop.userId !== userId) {
      throw new ForbiddenException();
    }

    await this.variantRepo.softDelete(variantId);
  }
}
