import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  orderBy: {
    environment: 'ASC',
    ocp_namespace: 'ASC',
    name: 'ASC',
  },
})
export class Deployment {
  @PrimaryColumn('varying character')
  environment: string;

  @Column({
    type: 'varying character',
    nullable: false,
  })
  ocp_namespace: string;

  @PrimaryColumn('varying character')
  name: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  is_gateway: boolean;

  @Column({
    type: 'varying character',
    nullable: true,
  })
  memory_min?: string;

  @Column({
    type: 'varying character',
    nullable: true,
  })
  memory_max?: string;

  @Column({
    type: 'varying character',
    nullable: true,
  })
  cpu_min?: string;

  @Column({
    type: 'varying character',
    nullable: true,
  })
  cpu_max?: string;

  @Column({
    type: 'integer',
    nullable: true,
  })
  replicas_target?: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  replicas_current?: number;

  @Column({
    type: 'varying character',
    default: '/bygginfo',
  })
  build_info_api_path: string;

  @Column({
    type: 'varying character',
    nullable: true,
  })
  spring_profiles_active?: string;

  @Column({
    type: 'varying character',
    nullable: true,
  })
  image_tag?: string;

  @Column({
    type: 'varying character',
    nullable: true,
  })
  build_timestamp?: string;

  @CreateDateColumn({ select: false })
  created_at?: Date;

  @UpdateDateColumn({ select: false })
  updated_at?: Date;
}
