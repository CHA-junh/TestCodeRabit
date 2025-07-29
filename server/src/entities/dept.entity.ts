import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'TBL_DEPT' })
export class Dept {
  @PrimaryColumn({ name: 'DEPT_CD', type: 'varchar2', length: 20 })
  deptCd: string;

  @Column({ name: 'DEPT_NM', type: 'varchar2', length: 100, nullable: true })
  deptNm?: string;

  @Column({ name: 'DEPT_DIV_CD', type: 'varchar2', length: 4, nullable: true })
  deptDivCd?: string;

  @Column({ name: 'HQ_DIV_CD', type: 'varchar2', length: 4, nullable: true })
  hqDivCd?: string;

  @Column({
    name: 'WEBMAIL_DEPT_CD',
    type: 'varchar2',
    length: 100,
    nullable: true,
  })
  webmailDeptCd?: string;

  @Column({ name: 'USE_YN', type: 'char', length: 1, nullable: true })
  useYn?: string;

  @Column({ name: 'EXPL', type: 'varchar2', length: 500, nullable: true })
  expl?: string;

  @Column({ name: 'CHNG_DTTM', type: 'varchar2', length: 14, nullable: true })
  chngDttm?: string;

  @Column({ name: 'CHNGR_ID', type: 'varchar2', length: 10, nullable: true })
  chngrId?: string;
}


