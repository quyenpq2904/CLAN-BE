import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeEntity } from './entities/attribute.entity';
import { AttributeController } from './attribute.controller';
import { AttributeService } from './attribute.service';

@Module({
  imports: [TypeOrmModule.forFeature([AttributeEntity])],
  controllers: [AttributeController],
  providers: [AttributeService],
})
export class AttributeModule {}
