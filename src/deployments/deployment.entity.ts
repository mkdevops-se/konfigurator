import { Entity, Column, PrimaryColumn } from 'typeorm';

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
}
