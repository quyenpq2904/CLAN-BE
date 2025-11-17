import {
  AttributeEntity,
  AttributeType,
} from '@/api/attribute/entities/attribute.entity';
import { type Uuid } from '@/common/types/common.type';
import { DataSource, In } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export const ATTRIBUTE_IDS = {
  TINH_TRANG: 'a1a1b1b1-1111-4a4a-aaaa-111111111111',
  MAU_SAC: 'a1a1b1b1-2222-4a4a-aaaa-222222222222',
  KICH_CO_QUAN_AO: 'a1a1b1b1-3333-4a4a-aaaa-333333333333',
  KICH_CO_GIAY: 'a1a1b1b1-4444-4a4a-aaaa-444444444444',
  CHAT_LIEU: 'a1a1b1b1-5555-4a4a-aaaa-555555555555',
  THUONG_HIEU: 'a1a1b1b1-6666-4a4a-aaaa-666666666666',
  XUAT_XU: 'a1a1b1b1-7777-4a4a-aaaa-777777777777',
};

export class AttributeSeeder1763316856114 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(AttributeEntity);
    const attributesData = [
      {
        id: ATTRIBUTE_IDS.TINH_TRANG,
        name: 'Tình trạng',
        type: AttributeType.SELECT,
      },
      {
        id: ATTRIBUTE_IDS.MAU_SAC,
        name: 'Màu sắc',
        type: AttributeType.SELECT,
      },
      {
        id: ATTRIBUTE_IDS.KICH_CO_QUAN_AO,
        name: 'Kích cỡ (Quần Áo)',
        type: AttributeType.SELECT,
      },
      {
        id: ATTRIBUTE_IDS.KICH_CO_GIAY,
        name: 'Kích cỡ (Giày)',
        type: AttributeType.SELECT,
      },
      {
        id: ATTRIBUTE_IDS.CHAT_LIEU,
        name: 'Chất liệu',
        type: AttributeType.SELECT,
      },
      {
        id: ATTRIBUTE_IDS.THUONG_HIEU,
        name: 'Thương hiệu',
        type: AttributeType.STRING,
      },
      {
        id: ATTRIBUTE_IDS.XUAT_XU,
        name: 'Xuất xứ',
        type: AttributeType.STRING,
      },
    ];

    const attributeIds = attributesData.map((a) => a.id);
    const existingAttributes = await repository.findBy({
      id: In(attributeIds),
    });
    const existingIdSet = new Set(existingAttributes.map((a) => a.id));

    // BƯỚC 4: Chuẩn bị dữ liệu để insert (lọc ra các ID chưa có)
    const attributesToInsert: AttributeEntity[] = [];

    for (const data of attributesData) {
      if (!existingIdSet.has(data.id as Uuid)) {
        attributesToInsert.push(
          new AttributeEntity({
            id: data.id as Uuid,
            name: data.name,
            type: data.type,
            isEnabled: true,
          }),
        );
      }
    }

    // BƯỚC 5: Insert vào DB
    if (attributesToInsert.length > 0) {
      await repository.insert(attributesToInsert);
      console.log(`🌱 Seeded ${attributesToInsert.length} new attributes.`);
    } else {
      console.log('🌱 All attributes already exist. Nothing to seed.');
    }
  }
}
