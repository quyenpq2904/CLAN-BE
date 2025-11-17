import 'reflect-metadata';
import 'tsconfig-paths/register';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

const AppDataSource = new DataSource({
  type: process.env.DATABASE_TYPE,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT
    ? parseInt(process.env.DATABASE_PORT, 10)
    : 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  dropSchema: false,
  keepConnectionAlive: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  seeds: [__dirname + '/seeds/main.seeder{.ts,.js}'],
} as DataSourceOptions & SeederOptions);

export default AppDataSource;
