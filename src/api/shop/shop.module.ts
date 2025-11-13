import { Module } from '@nestjs/common';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { ShopEntity } from './entities/shop.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ShopEntity])],
  controllers: [ShopController],
  providers: [ShopService],
})
export class ShopModule {}
