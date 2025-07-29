import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'TBL_PGM_GRP_PGM' })
export class TblPgmGrpPgm {
  @PrimaryColumn({ name: 'PGM_GRP_ID', type: 'varchar2', length: 20 })
  pgmGrpId: string;

  @PrimaryColumn({ name: 'PGM_ID', type: 'varchar2', length: 20 })
  pgmId: string;

  @Column({ name: 'USE_YN', type: 'char', length: 1, nullable: true })
  useYn: string;

  @Column({ name: 'REG_DTTM', type: 'varchar2', length: 14, nullable: true })
  regDttm: string;

  @Column({ name: 'CHNG_DTTM', type: 'varchar2', length: 14, nullable: true })
  chngDttm: string;

  @Column({ name: 'CHNGR_ID', type: 'varchar2', length: 10, nullable: true })
  chngrId: string;
} 