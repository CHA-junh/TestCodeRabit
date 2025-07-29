import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'TBL_USER' })
export class UserEntity {
  @PrimaryColumn({ name: 'USR_ID', type: 'varchar2', length: 20 })
  usrId: string;

  @Column({ name: 'USR_NM', type: 'varchar2', length: 100 })
  usrNm: string;

  @Column({ name: 'HQ_DIV', type: 'varchar2', length: 20 })
  hqDiv: string;

  @Column({ name: 'DEPT_DIV', type: 'varchar2', length: 20 })
  deptDiv: string;

  @Column({ name: 'USE_YN', type: 'char', length: 1 })
  useYn: string;
} 

