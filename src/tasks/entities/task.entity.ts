import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

enum Action {
  FETCH_BUILD_INFO = 'fetch_build_info',
}

enum State {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILURE = 'failure',
}

@Entity({
  orderBy: {
    created_at: 'DESC',
    updated_at: 'DESC',
  },
})
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'simple-enum',
    nullable: false,
  })
  action: Action;

  @Column({
    type: 'simple-enum',
    nullable: false,
    default: 'pending',
  })
  state: State;

  @Column('simple-json')
  data: {
    target: {
      environment: string;
      deployment: string;
      external_url: string;
    };
  };

  @CreateDateColumn({ select: true })
  created_at?: Date;

  @UpdateDateColumn({ select: true })
  updated_at?: Date;
}
