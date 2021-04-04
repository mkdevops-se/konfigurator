import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  orderBy: {
    created_at: 'DESC',
  },
})
export class User {
  @PrimaryColumn('varying character')
  user_id: string;

  @Column({
    type: 'varying character',
    nullable: true,
  })
  id?: string;

  @Column({
    type: 'varying character',
    nullable: true,
  })
  provider?: string;

  @Column({
    type: 'varying character',
    nullable: true,
  })
  display_name?: string;

  @Column({
    type: 'varying character',
    nullable: true,
  })
  nickname?: string;

  @Column({
    type: 'varying character',
    nullable: true,
  })
  family_name?: string;

  @Column({
    type: 'varying character',
    nullable: true,
  })
  given_name?: string;

  @Column({
    type: 'varying character',
    nullable: true,
  })
  email?: string;

  @Column({
    type: 'simple-array',
    array: true,
    nullable: true,
  })
  identities?: string[];

  @Column({
    type: 'simple-array',
    array: true,
    nullable: true,
  })
  groups?: string[];

  @Column({
    type: 'varying character',
    nullable: true,
  })
  picture_url?: string;

  @Column({
    type: 'varying character',
    nullable: true,
  })
  locale?: string;

  @Column({
    type: 'integer',
    default: 0,
  })
  konfigurator_login_count?: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  konfigurator_super_admin?: boolean;

  @CreateDateColumn({ select: false })
  created_at?: Date;

  @UpdateDateColumn({ select: false })
  updated_at?: Date;
}
