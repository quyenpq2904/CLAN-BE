import { type Uuid } from '@/common/types/common.type';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { ATTRIBUTE_IDS } from './attribute-seeder';
import { CATEGORY_IDS } from './category-seeder';

type RelationPair = {
  category_id: Uuid;
  attribute_id: Uuid;
};

export class CategoryAttributeSeeder implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const queryRunner = dataSource.createQueryRunner();
    const tableName = 'category_attribute';

    const commonAttributes = [
      ATTRIBUTE_IDS.TINH_TRANG,
      ATTRIBUTE_IDS.MAU_SAC,
      ATTRIBUTE_IDS.CHAT_LIEU,
      ATTRIBUTE_IDS.THUONG_HIEU,
      ATTRIBUTE_IDS.XUAT_XU,
    ];

    const desiredRelations: RelationPair[] = [];

    for (const categoryId of Object.values(CATEGORY_IDS)) {
      for (const attributeId of commonAttributes) {
        desiredRelations.push({
          category_id: categoryId as Uuid,
          attribute_id: attributeId as Uuid,
        });
      }
    }

    const clothingCategories = [
      CATEGORY_IDS.AO_SO_MI,
      CATEGORY_IDS.AO_THUN,
      CATEGORY_IDS.AO_KHOAC,
      CATEGORY_IDS.QUAN_JEANS,
      CATEGORY_IDS.QUAN_TAY,
      CATEGORY_IDS.QUAN_SHORT,
      CATEGORY_IDS.DAM_VAY,
    ];

    for (const categoryId of clothingCategories) {
      desiredRelations.push({
        category_id: categoryId as Uuid,
        attribute_id: ATTRIBUTE_IDS.KICH_CO_QUAN_AO as Uuid,
      });
    }

    const shoeCategories = [
      CATEGORY_IDS.GIAY_THE_THAO,
      CATEGORY_IDS.GIAY_CAO_GOT,
    ];
    for (const categoryId of shoeCategories) {
      desiredRelations.push({
        category_id: categoryId as Uuid,
        attribute_id: ATTRIBUTE_IDS.KICH_CO_GIAY as Uuid,
      });
    }

    const existingRelations = (await queryRunner.query(
      `SELECT category_id, attribute_id FROM "${tableName}"`,
    )) as RelationPair[];

    const existingRelationSet = new Set(
      existingRelations.map((r) => `${r.category_id}-${r.attribute_id}`),
    );

    const relationsToInsert = desiredRelations.filter(
      (r) => !existingRelationSet.has(`${r.category_id}-${r.attribute_id}`),
    );

    if (relationsToInsert.length > 0) {
      // Chuẩn bị values (ví dụ: ($1, $2), ($3, $4), ...)
      const valuePlaceholders = relationsToInsert
        .map((_, index) => `($${index * 2 + 1}, $${index * 2 + 2})`)
        .join(', ');

      // Flatten mảng params (ví dụ: [cat1, att1, cat2, att2, ...])
      const parameters = relationsToInsert.flatMap((r) => [
        r.category_id,
        r.attribute_id,
      ]);

      await queryRunner.query(
        `INSERT INTO "${tableName}" (category_id, attribute_id) VALUES ${valuePlaceholders}`,
        parameters,
      );

      console.log(
        `🌱 Seeded ${relationsToInsert.length} new category-attribute relations.`,
      );
    } else {
      console.log(
        '🌱 All category-attribute relations already exist. Nothing to seed.',
      );
    }
  }
}
