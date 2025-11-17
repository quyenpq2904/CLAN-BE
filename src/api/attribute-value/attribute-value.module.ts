import { Module } from '@nestjs/common';
import { AttributeValueEntity } from './entities/attribute-value.entity';
import { AttributeEntity } from '../attribute/entities/attribute.entity';
import { AttributeValueController } from './attribute-value.controller';
import { AttributeValueService } from './attribute-value.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AttributeValueEntity, AttributeEntity])],
  controllers: [AttributeValueController],
  providers: [AttributeValueService],
})
export class AttributeValueModule {}
