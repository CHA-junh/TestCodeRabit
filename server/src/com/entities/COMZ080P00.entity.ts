import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'TBL_EMPLOYEE' })
export class EmployeeEntity {
  @PrimaryColumn({ name: 'EMP_NO', type: 'varchar2', length: 20 })
  empNo: string;

  @Column({ name: 'EMP_NM', type: 'varchar2', length: 100 })
  empNm: string;

  @Column({ name: 'OWN_OUTS_DIV', type: 'char', length: 1 })
  ownOutsDiv: string;

  @Column({ name: 'RETIR_YN', type: 'char', length: 1 })
  retirYn: string;

  @Column({ name: 'DEPT_CD', type: 'varchar2', length: 20, nullable: true })
  deptCd: string | null;

  // λ³Έλ? κ΄???λ
  @Column({ name: 'HQ_DIV_CD', type: 'varchar2', length: 20, nullable: true })
  hqDivCd: string | null;

  @Column({ name: 'HQ_DIV_NM', type: 'varchar2', length: 100, nullable: true })
  hqDivNm: string | null;

  // λΆ??κ΄???λ
  @Column({ name: 'DEPT_DIV_CD', type: 'varchar2', length: 20, nullable: true })
  deptDivCd: string | null;

  @Column({ name: 'DEPT_DIV_NM', type: 'varchar2', length: 100, nullable: true })
  deptDivNm: string | null;

  // μ§κΈ κ΄???λ
  @Column({ name: 'DUTY_CD', type: 'varchar2', length: 20, nullable: true })
  dutyCd: string | null;

  @Column({ name: 'DUTY_NM', type: 'varchar2', length: 50, nullable: true })
  dutyNm: string | null;

  @Column({ name: 'DUTY_DIV_CD', type: 'varchar2', length: 20, nullable: true })
  dutyDivCd: string | null;

  @Column({ name: 'DUTY_DIV_CD_NM', type: 'varchar2', length: 50, nullable: true })
  dutyDivCdNm: string | null;

  // κΆν κ΄???λ
  @Column({ name: 'AUTH_CD', type: 'varchar2', length: 20, nullable: true })
  authCd: string | null;

  @Column({ name: 'AUTH_CD_NM', type: 'varchar2', length: 50, nullable: true })
  authCdNm: string | null;

  // ?¬μ©κΆν κ΄???λ
  @Column({ name: 'BSN_USE_YN', type: 'char', length: 1, nullable: true })
  bsnUseYn: string | null;

  @Column({ name: 'WPC_USE_YN', type: 'char', length: 1, nullable: true })
  wpcUseYn: string | null;

  @Column({ name: 'PSM_USE_YN', type: 'char', length: 1, nullable: true })
  psmUseYn: string | null;

  // ?°λ½μ²?κ΄???λ
  @Column({ name: 'EMAIL_ADDR', type: 'varchar2', length: 200, nullable: true })
  emailAddr: string | null;

  // ?ΉμΈ κ΄???λ
  @Column({ name: 'APV_APOF_ID', type: 'varchar2', length: 20, nullable: true })
  apvApofId: string | null;

  // ?μ¬/?΄μ¬ κ΄???λ
  @Column({ name: 'ENTR_NO', type: 'varchar2', length: 20, nullable: true })
  entrNo: string | null;

  @Column({ name: 'ENTR_DT', type: 'date', nullable: true })
  entrDt: Date | null;

  @Column({ name: 'RETIR_DT', type: 'date', nullable: true })
  retirDt: Date | null;

  // κΈ°ν? ?λ
  @Column({ name: 'WMAIL_YN', type: 'char', length: 1, nullable: true })
  wmailYn: string | null;

  @Column({ name: 'WRK_CNT', type: 'number', nullable: true })
  wrkCnt: number | null;

  @Column({ name: 'LAST_WRK', type: 'varchar2', length: 200, nullable: true })
  lastWrk: string | null;

  // λΉκ³  ?λ
  @Column({ name: 'RMK', type: 'varchar2', length: 500, nullable: true })
  rmk: string | null;
} 

