import { UserEntity } from '@/api/user/entities/user.entity';
import { type Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';

@Entity('address')
export class AddressEntity extends AbstractEntity {
  constructor(data?: Partial<AddressEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_address_id' })
  id!: Uuid;

  @Column({ name: 'receiver_name' })
  receiverName!: string;

  @Column({ name: 'phone_number' })
  phoneNumber!: string;

  @Column()
  address!: string;

  @Column({ name: 'province_id' })
  provinceId!: string;

  @Column({ name: 'ward_id' })
  wardId!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: Uuid;

  @Column({ name: 'is_default', default: false })
  isDefault?: boolean;

  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_address_user',
  })
  @ManyToOne(() => UserEntity, (user) => user.addresses)
  user: Relation<UserEntity>;
}
