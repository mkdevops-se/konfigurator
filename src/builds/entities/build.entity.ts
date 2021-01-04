import { Entity, Column, PrimaryColumn } from 'typeorm';

enum BuildType {
  LATEST = 'latest',
  NEXT = 'next',
  DEVELOP = 'develop',
}

@Entity({
  orderBy: {
    build_timestamp: 'DESC',
    image_name: 'ASC',
    image_tag: 'ASC',
  },
})
export class Build {
  @PrimaryColumn('varying character')
  image_name: string;

  @PrimaryColumn('varying character')
  image_tag: string;

  @Column({
    type: 'varying character',
    nullable: false,
  })
  build_timestamp: string;

  @Column({
    type: 'varying character',
    nullable: false,
  })
  commit_link: string;

  @Column({
    type: 'simple-enum',
    nullable: true,
  })
  build_type?: BuildType;

  @Column({
    type: 'varying character',
    nullable: true,
  })
  spring_profiles_active?: string; // TODO(@mblomdahl): Find out what it's called in a non-Java app.

  @Column({
    type: 'varying character',
    nullable: true,
  })
  artifactory_path?: string;

  @Column({
    type: 'varying character',
    nullable: true,
  })
  jenkins_host?: string; // Which Jenkins instance built it?

  @Column({
    type: 'varying character',
    nullable: true,
  })
  operator_id?: string; // Who initiated the build?
}
