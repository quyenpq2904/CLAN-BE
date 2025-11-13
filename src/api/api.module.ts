import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { ShopModule } from './shop/shop.module';

@Module({
  imports: [AuthModule, HealthModule, ShopModule, UserModule],
})
export class ApiModule {}
