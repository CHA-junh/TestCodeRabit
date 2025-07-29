import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('TBL_SML_CSF_CD')
export class TblSmlCsfCd {
  @PrimaryColumn({ name: 'LRG_CSF_CD' })
  lrgCsfCd: string;

  @PrimaryColumn({ name: 'SML_CSF_CD' })
  smlCsfCd: string;

  @Column({ name: 'SML_CSF_NM' })
  smlCsfNm: string;

  @Column({ name: 'EXPL', nullable: true })
  expl: string;

  @Column({ name: 'USE_YN', nullable: true })
  useYn: string;

  @Column({ name: 'SORT_ORD', nullable: true })
  sortOrd: number;
}
