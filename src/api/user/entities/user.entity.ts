import { type Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { hashPassword } from '@/utils/password.util';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SessionEntity } from './session.entity';
import { ShopEntity } from '@/api/shop/entities/shop.entity';

export enum UserStatus {
  UNVERIFIED = 'UNVERIFIED',
  VERIFIED = 'VERIFIED',
  BANNED = 'BANNED',
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity('user')
export class UserEntity extends AbstractEntity {
  constructor(data?: Partial<UserEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_user_id' })
  id!: Uuid;

  @Column({
    length: 50,
    nullable: true,
  })
  @Index('UQ_user_username', {
    where: '"deleted_at" IS NULL',
    unique: true,
  })
  username: string;

  @Column()
  @Index('UQ_user_email', { where: '"deleted_at" IS NULL', unique: true })
  email!: string;

  @Column({ length: 255, name: 'full_name' })
  fullName!: string;

  @Column()
  password!: string;

  @Column({ default: '', name: 'phone_number' })
  phoneNumber?: string;

  @Column({ default: '' })
  bio?: string;

  @Column({ default: '' })
  avatar?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.UNVERIFIED,
  })
  status: UserStatus;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    default: null,
  })
  deletedAt: Date;

  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions?: SessionEntity[];

  @OneToMany(() => ShopEntity, (shop) => shop.user)
  shops: ShopEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await hashPassword(this.password);
    }
  }
}
