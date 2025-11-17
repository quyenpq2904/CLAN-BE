import { type Uuid } from '@/common/types/common.type';
import { DataSource, In } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { ATTRIBUTE_IDS } from './attribute-seeder';
import { AttributeValueEntity } from '@/api/attribute-value/entities/attribute-value.entity';

export class AttributeValueSeeder implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(AttributeValueEntity);

    // BƯỚC 1: Dữ liệu thô
    const valuesData = [
      // Tình trạng
      {
        value: 'Mới (New)',
        displayOrder: 1,
        attributeId: ATTRIBUTE_IDS.TINH_TRANG,
      },
      {
        value: 'Đã sử dụng (2hand)',
        displayOrder: 2,
        attributeId: ATTRIBUTE_IDS.TINH_TRANG,
      },

      // Màu sắc
      {
        value: 'Đen',
        displayOrder: 1,
        attributeId: ATTRIBUTE_IDS.MAU_SAC,
      },
      {
        value: 'Trắng',
        displayOrder: 2,
        attributeId: ATTRIBUTE_IDS.MAU_SAC,
      },
      {
        value: 'Đỏ',
        displayOrder: 3,
        attributeId: ATTRIBUTE_IDS.MAU_SAC,
      },
      {
        value: 'Xanh Dương',
        displayOrder: 4,
        attributeId: ATTRIBUTE_IDS.MAU_SAC,
      },
      {
        value: 'Nâu',
        displayOrder: 5,
        attributeId: ATTRIBUTE_IDS.MAU_SAC,
      },

      // Kích cỡ (Quần Áo)
      {
        value: 'Freesize',
        displayOrder: 1,
        attributeId: ATTRIBUTE_IDS.KICH_CO_QUAN_AO,
      },
      {
        value: 'S',
        displayOrder: 2,
        attributeId: ATTRIBUTE_IDS.KICH_CO_QUAN_AO,
      },
      {
        value: 'M',
        displayOrder: 3,
        attributeId: ATTRIBUTE_IDS.KICH_CO_QUAN_AO,
      },
      {
        value: 'L',
        displayOrder: 4,
        attributeId: ATTRIBUTE_IDS.KICH_CO_QUAN_AO,
      },
      {
        value: 'XL',
        displayOrder: 5,
        attributeId: ATTRIBUTE_IDS.KICH_CO_QUAN_AO,
      },

      // Kích cỡ (Giày)
      {
        value: '36',
        displayOrder: 1,
        attributeId: ATTRIBUTE_IDS.KICH_CO_GIAY,
      },
      {
        value: '37',
        displayOrder: 2,
        attributeId: ATTRIBUTE_IDS.KICH_CO_GIAY,
      },
      {
        value: '38',
        displayOrder: 3,
        attributeId: ATTRIBUTE_IDS.KICH_CO_GIAY,
      },
      {
        value: '39',
        displayOrder: 4,
        attributeId: ATTRIBUTE_IDS.KICH_CO_GIAY,
      },
      {
        value: '40',
        displayOrder: 5,
        attributeId: ATTRIBUTE_IDS.KICH_CO_GIAY,
      },

      // Chất liệu
      {
        value: 'Cotton',
        displayOrder: 1,
        attributeId: ATTRIBUTE_IDS.CHAT_LIEU,
      },
      {
        value: 'Jeans / Denim',
        displayOrder: 2,
        attributeId: ATTRIBUTE_IDS.CHAT_LIEU,
      },
      {
        value: 'Da (Leather)',
        displayOrder: 3,
        attributeId: ATTRIBUTE_IDS.CHAT_LIEU,
      },
    ];

    // BƯỚC 2: Kiểm tra các giá trị đã tồn tại dựa trên cặp (attributeId, value)
    const attributeIds = [...new Set(valuesData.map((v) => v.attributeId))];
    const existingValues = await repository.findBy({
      attributeId: In(attributeIds as Uuid[]),
    });
    const existingKeySet = new Set(
      existingValues.map((v) => `${v.attributeId}:${v.value}`),
    );

    // BƯỚC 3: Chuẩn bị dữ liệu
    const valuesToInsert: AttributeValueEntity[] = [];

    for (const data of valuesData) {
      const key = `${data.attributeId}:${data.value}`;
      if (!existingKeySet.has(key)) {
        valuesToInsert.push(
          new AttributeValueEntity({
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
      await repository.save(valuesToInsert);
      console.log(`🌱 Seeded ${valuesToInsert.length} new attribute values.`);
    } else {
      console.log('🌱 All attribute values already exist. Nothing to seed.');
    }
  }
}
