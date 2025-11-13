import { UserEntity } from '@/api/user/entities/user.entity';
import { type Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ShopStatus {
  UNVERIFIED = 'UNVERIFIED',
  VERIFIED = 'VERIFIED',
  SUSPENDED = 'SUSPENDED',
}

@Entity('shop')
export class ShopEntity extends AbstractEntity {
  constructor(data?: Partial<ShopEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_shop_id' })
  id!: Uuid;

  @Column({ length: 100 })
  @Index('UQ_shop_name', { where: '"deleted_at" IS NULL', unique: true })
  name!: string;

  @Column({ length: 200 })
  description!: string;

  @Column()
  address!: string;

  @Column({ name: 'phone_number' })
  phoneNumber!: string;

  @Column()
  email!: string;

  @Column({ default: '' })
  avatar?: string;

  @Column({ default: '' })
  banner?: string;

  @Column({
    type: 'enum',
    enum: ShopStatus,
    default: ShopStatus.UNVERIFIED,
  })
  status: ShopStatus;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    default: null,
  })
  deletedAt: Date;

  @Column({
    name: 'user_id',
    type: 'uuid',
  })
  userId: Uuid;

  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_shop_user',
  })
  @ManyToOne(() => UserEntity, (user) => user.shops)
  user!: UserEntity;
}
