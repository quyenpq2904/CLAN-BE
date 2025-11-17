import { UserEntity } from '@/api/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class UserSeeder implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(UserEntity);

    const adminUser = await repository.findOneBy({ username: 'admin' });
    if (!adminUser) {
      const admin = repository.create(
        new UserEntity({
          username: 'admin',
          email: 'admin@gmail.com',
          fullName: 'Administrator',
          password: 'Admin@123',
          bio: "hello, i'm a backend developer",
        }),
      );

      await repository.save(admin);
    }
  }
}
