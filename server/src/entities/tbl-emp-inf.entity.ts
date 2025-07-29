import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('TBL_EMP_INF')
export class TblEmpInf {
  @PrimaryColumn({ name: 'EMP_NO' })
  empNo: string;

  @Column({ name: 'OWN_OUTS_DIV' })
  ownOutsDiv: string;

  @Column({ name: 'ENTR_NO' })
  entrNo: string;

  @Column({ name: 'EMP_NM' })
  empNm: string;

  @Column({ name: 'ENTR_DT' })
  entrDt: string;

  @Column({ name: 'RETIR_DT', nullable: true })
  retirDt: string;

  @Column({ name: 'HQ_DIV_CD' })
  hqDivCd: string;

  @Column({ name: 'DEPT_DIV_CD' })
  deptDivCd: string;

  @Column({ name: 'DUTY_CD' })
  dutyCd: string;

  @Column({ name: 'EMAIL_ADDR', nullable: true })
  emailAddr: string;
}


