import { CategoryModule } from './category/category.module';
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { ShopModule } from './shop/shop.module';
import { CommentModule } from './comment/comment.module';
import { CommissionModule } from './commission/commission.module';
import { OutfitModule } from './outfit/outfit.module';
import { PostModule } from './post/post.module';
import { ProductModule } from './product/product.module';
import { ProductVariantModule } from './product-variant/product-variant.module';
import { ReactionModule } from './reaction/reaction.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { AttributeModule } from './attribute/attribute.module';
import { AttributeValueModule } from './attribute-value/attribute-value.module';

@Module({
  imports: [
    AttributeModule,
    AttributeValueModule,
    AuthModule,
    CategoryModule,
    CommentModule,
    CommissionModule,
    HealthModule,
    OutfitModule,
    PostModule,
    ProductModule,
    ProductVariantModule,
    ReactionModule,
    ShopModule,
    SubscriptionModule,
    UserModule,
  ],
})
export class ApiModule {}
