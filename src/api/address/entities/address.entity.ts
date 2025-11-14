import { type Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ name: 'district_id' })
  districtId!: string;

  @Column({ name: 'is_default', default: false })
  isDefault?: boolean;
}
