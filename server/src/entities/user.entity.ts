import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'TBL_USER_INF' })
export class User {
  @PrimaryColumn({ name: 'USER_ID', type: 'varchar2', length: 10 })
  userId: string;

  @Column({ name: 'USER_NM', type: 'varchar2', length: 20, nullable: true })
  userName?: string;

  @Column({ name: 'DEPT_CD', type: 'varchar2', length: 20, nullable: true })
  deptCd?: string;

  @Column({ name: 'DUTY_CD', type: 'varchar2', length: 4, nullable: true })
  dutyCd?: string;

  @Column({ name: 'DUTY_DIV_CD', type: 'varchar2', length: 4, nullable: true })
  dutyDivCd?: string;

  @Column({ name: 'AUTH_CD', type: 'varchar2', length: 10, nullable: true })
  authCd?: string;

  @Column({ name: 'WRK01_USE_YN', type: 'char', length: 1, nullable: true })
  wrk01UseYn?: string;

  @Column({ name: 'WRK02_USE_YN', type: 'char', length: 1, nullable: true })
  wrk02UseYn?: string;

  @Column({ name: 'APV_APOF_ID', type: 'varchar2', length: 10, nullable: true })
  apvApofId?: string;

  @Column({ name: 'USER_PWD', type: 'varchar2', length: 255, nullable: true })
  userPwd?: string;

  @Column({
    name: 'PWD_CHNG_DTTM',
    type: 'varchar2',
    length: 14,
    nullable: true,
  })
  pwdChngDttm?: string;

  @Column({ name: 'EMAIL_ADDR', type: 'varchar2', length: 100, nullable: true })
  emailAddr?: string;

  @Column({ name: 'USR_ROLE_ID', type: 'varchar2', length: 20, nullable: true })
  usrRoleId?: string;
}
