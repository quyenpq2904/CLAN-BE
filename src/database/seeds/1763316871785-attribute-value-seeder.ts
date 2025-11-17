import { type Uuid } from '@/common/types/common.type';
import { DataSource, In } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { ATTRIBUTE_IDS } from './1763316856114-attribute-seeder';
import { AttributeValueEntity } from '@/api/attribute-value/entities/attribute-value.entity';

export class AttributeValueSeeder1763316871785 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(AttributeValueEntity);

    // BƯỚC 1: Dữ liệu thô
    const valuesData = [
      // Tình trạng
      {
        id: 'v1v1a1a1-0001-0001-0001-000000000001' as Uuid,
        value: 'Mới (New)',
        displayOrder: 1,
        attributeId: ATTRIBUTE_IDS.TINH_TRANG,
      },
      {
        id: 'v1v1a1a1-0001-0001-0001-000000000002' as Uuid,
        value: 'Đã sử dụng (2hand)',
        displayOrder: 2,
        attributeId: ATTRIBUTE_IDS.TINH_TRANG,
      },

      // Màu sắc
      {
        id: 'v1v1a1a1-0002-0002-0001-000000000001' as Uuid,
        value: 'Đen',
        displayOrder: 1,
        attributeId: ATTRIBUTE_IDS.MAU_SAC,
      },
      {
        id: 'v1v1a1a1-0002-0002-0001-000000000002' as Uuid,
        value: 'Trắng',
        displayOrder: 2,
        attributeId: ATTRIBUTE_IDS.MAU_SAC,
      },
      {
        id: 'v1v1a1a1-0002-0002-0001-000000000003' as Uuid,
        value: 'Đỏ',
        displayOrder: 3,
        attributeId: ATTRIBUTE_IDS.MAU_SAC,
      },
      {
        id: 'v1v1a1a1-0002-0002-0001-000000000004' as Uuid,
        value: 'Xanh Dương',
        displayOrder: 4,
        attributeId: ATTRIBUTE_IDS.MAU_SAC,
      },
      {
        id: 'v1v1a1a1-0002-0002-0001-000000000005' as Uuid,
        value: 'Nâu',
        displayOrder: 5,
        attributeId: ATTRIBUTE_IDS.MAU_SAC,
      },

      // Kích cỡ (Quần Áo)
      {
        id: 'v1v1a1a1-0003-0003-0001-000000000001' as Uuid,
        value: 'Freesize',
        displayOrder: 1,
        attributeId: ATTRIBUTE_IDS.KICH_CO_QUAN_AO,
      },
      {
        id: 'v1v1a1a1-0003-0003-0001-000000000002' as Uuid,
        value: 'S',
        displayOrder: 2,
        attributeId: ATTRIBUTE_IDS.KICH_CO_QUAN_AO,
      },
      {
        id: 'v1v1a1a1-0003-0003-0001-000000000003' as Uuid,
        value: 'M',
        displayOrder: 3,
        attributeId: ATTRIBUTE_IDS.KICH_CO_QUAN_AO,
      },
      {
        id: 'v1v1a1a1-0003-0003-0001-000000000004' as Uuid,
        value: 'L',
        displayOrder: 4,
        attributeId: ATTRIBUTE_IDS.KICH_CO_QUAN_AO,
      },
      {
        id: 'v1v1a1a1-0003-0003-0001-000000000005' as Uuid,
        value: 'XL',
        displayOrder: 5,
        attributeId: ATTRIBUTE_IDS.KICH_CO_QUAN_AO,
      },

      // Kích cỡ (Giày)
      {
        id: 'v1v1a1a1-0004-0004-0001-000000000001' as Uuid,
        value: '36',
        displayOrder: 1,
        attributeId: ATTRIBUTE_IDS.KICH_CO_GIAY,
      },
      {
        id: 'v1v1a1a1-0004-0004-0001-000000000002' as Uuid,
        value: '37',
        displayOrder: 2,
        attributeId: ATTRIBUTE_IDS.KICH_CO_GIAY,
      },
      {
        id: 'v1v1a1a1-0004-0004-0001-000000000003' as Uuid,
        value: '38',
        displayOrder: 3,
        attributeId: ATTRIBUTE_IDS.KICH_CO_GIAY,
      },
      {
        id: 'v1v1a1a1-0004-0004-0001-000000000004' as Uuid,
        value: '39',
        displayOrder: 4,
        attributeId: ATTRIBUTE_IDS.KICH_CO_GIAY,
      },
      {
        id: 'v1v1a1a1-0004-0004-0001-000000000005' as Uuid,
        value: '40',
        displayOrder: 5,
        attributeId: ATTRIBUTE_IDS.KICH_CO_GIAY,
      },

      // Chất liệu
      {
        id: 'v1v1a1a1-0005-0005-0001-000000000001' as Uuid,
        value: 'Cotton',
        displayOrder: 1,
        attributeId: ATTRIBUTE_IDS.CHAT_LIEU,
      },
      {
        id: 'v1v1a1a1-0005-0005-0001-000000000002' as Uuid,
        value: 'Jeans / Denim',
        displayOrder: 2,
        attributeId: ATTRIBUTE_IDS.CHAT_LIEU,
      },
      {
        id: 'v1v1a1a1-0005-0005-0001-000000000003' as Uuid,
        value: 'Da (Leather)',
        displayOrder: 3,
        attributeId: ATTRIBUTE_IDS.CHAT_LIEU,
      },
    ];

    // BƯỚC 2: Kiểm tra ID
    const valueIds = valuesData.map((v) => v.id);
    const existingValues = await repository.findBy({
      id: In(valueIds),
    });
    const existingIdSet = new Set(existingValues.map((v) => v.id));

    // BƯỚC 3: Chuẩn bị dữ liệu
    const valuesToInsert: AttributeValueEntity[] = [];

    for (const data of valuesData) {
      if (!existingIdSet.has(data.id)) {
        valuesToInsert.push(
          new AttributeValueEntity({
            id: data.id,
            value: data.value,
            displayOrder: data.displayOrder,
            attributeId: data.attributeId as Uuid,
            isEnabled: true,
          }),
        );
      }
    }

    // BƯỚC 4: Insert
    if (valuesToInsert.length > 0) {
      await repository.insert(valuesToInsert);
      console.log(`🌱 Seeded ${valuesToInsert.length} new attribute values.`);
    } else {
      console.log('🌱 All attribute values already exist. Nothing to seed.');
    }
  }
}
