import { CategoryEntity } from '@/api/category/entities/category.entity';
import { type Uuid } from '@/common/types/common.type';
import { DataSource, In } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export const CATEGORY_IDS = {
  AO_SO_MI: 'd8a8f8a0-f8f8-4f8a-8f8a-8f8a8f8a8f8a',
  AO_THUN: 'd8a8f8a0-f8f8-4f8a-8f8a-8f8a8f8a8f8b',
  AO_KHOAC: 'd8a8f8a0-f8f8-4f8a-8f8a-8f8a8f8a8f8c',
  QUAN_JEANS: 'd8a8f8a0-f8f8-4f8a-8f8a-8f8a8f8a8f8d',
  QUAN_TAY: 'd8a8f8a0-f8f8-4f8a-8f8a-8f8a8f8a8f8e',
  QUAN_SHORT: 'd8a8f8a0-f8f8-4f8a-8f8a-8f8a8f8a8f8f',
  DAM_VAY: 'd8a8f8a0-f8f8-4f8a-8f8a-8f8a8f8a8f90',
  TUI_XACH: 'd8a8f8a0-f8f8-4f8a-8f8a-8f8a8f8a8f91',
  BALO: 'd8a8f8a0-f8f8-4f8a-8f8a-8f8a8f8a8f92',
  GIAY_THE_THAO: 'd8a8f8a0-f8f8-4f8a-8f8a-8f8a8f8a8f93',
  GIAY_CAO_GOT: 'd8a8f8a0-f8f8-4f8a-8f8a-8f8a8f8a8f94',
  TRANG_SUC: 'd8a8f8a0-f8f8-4f8a-8f8a-8f8a8f8a8f95',
  MU_NON: 'd8a8f8a0-f8f8-4f8a-8f8a-8f8a8f8a8f96',
  KINH_MAT: 'd8a8f8a0-f8f8-4f8a-8f8a-8f8a8f8a8f97',
};

export class CategorySeeder1763316483295 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(CategoryEntity);

    const categoriesData = [
      { id: CATEGORY_IDS.AO_SO_MI, name: 'Áo Sơ Mi' },
      { id: CATEGORY_IDS.AO_THUN, name: 'Áo Thun' },
      { id: CATEGORY_IDS.AO_KHOAC, name: 'Áo Khoác' },
      { id: CATEGORY_IDS.QUAN_JEANS, name: 'Quần Jeans' },
      { id: CATEGORY_IDS.QUAN_TAY, name: 'Quần Tây' },
      { id: CATEGORY_IDS.QUAN_SHORT, name: 'Quần Short' },
      { id: CATEGORY_IDS.DAM_VAY, name: 'Đầm / Váy' },
      { id: CATEGORY_IDS.TUI_XACH, name: 'Túi Xách' },
      { id: CATEGORY_IDS.BALO, name: 'Balo' },
      { id: CATEGORY_IDS.GIAY_THE_THAO, name: 'Giày Thể Thao' },
      { id: CATEGORY_IDS.GIAY_CAO_GOT, name: 'Giày Cao Gót' },
      { id: CATEGORY_IDS.TRANG_SUC, name: 'Trang Sức' },
      { id: CATEGORY_IDS.MU_NON, name: 'Mũ / Nón' },
      { id: CATEGORY_IDS.KINH_MAT, name: 'Kính Mắt' },
    ];

    const categoryIds = categoriesData.map((c) => c.id);
    const existingCategories = await repository.findBy({
      id: In(categoryIds),
    });
    const existingIdSet = new Set(existingCategories.map((c) => c.id));

    // Chuẩn bị dữ liệu để insert (lọc ra các ID chưa có)
    const categoriesToInsert: CategoryEntity[] = [];

    for (const data of categoriesData) {
      if (!existingIdSet.has(data.id as Uuid)) {
        categoriesToInsert.push(
          new CategoryEntity({
            id: data.id as Uuid,
            name: data.name,
            slug: this.generateSlug(data.name),
            isEnabled: true,
          }),
        );
      }
    }

    // Insert vào DB
    if (categoriesToInsert.length > 0) {
      await repository.insert(categoriesToInsert);
      console.log(`🌱 Seeded ${categoriesToInsert.length} new categories.`);
    } else {
      console.log('🌱 All categories already exist. Nothing to seed.');
    }
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
