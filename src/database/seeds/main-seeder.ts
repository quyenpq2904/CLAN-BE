import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { UserSeeder } from './user-seeder';
import { CategorySeeder } from './category-seeder';
import { AttributeValueSeeder } from './attribute-value-seeder';
import { AttributeSeeder } from './attribute-seeder';
import { CategoryAttributeSeeder } from './category-attribute-seeder';

export default class MainSeeder implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    console.log('---------------------------------------------------');
    console.log('🚀 STARTING DATABASE SEEDING...');
    console.log('---------------------------------------------------');

    await new UserSeeder().run(dataSource);
    console.log('✅ Users seeded');

    await new CategorySeeder().run(dataSource);
    console.log('✅ Categories seeded');

    await new AttributeSeeder().run(dataSource);
    console.log('✅ Attributes seeded');

    await new AttributeValueSeeder().run(dataSource);
    console.log('✅ Attribute Values seeded');

    await new CategoryAttributeSeeder().run(dataSource);
    console.log('✅ Category-Attribute Relations seeded');

    console.log('---------------------------------------------------');
    console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('---------------------------------------------------');
  }
}
