import { Entity, Column, PrimaryColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity({ name: 'TBL_PGM_INF' })
export class ProgramEntity {
  @PrimaryColumn({ name: 'PGM_ID', type: 'varchar2', length: 20 })
  pgmId: string;

  @Column({ name: 'PGM_NM', type: 'varchar2', length: 100, nullable: true })
  pgmNm: string;

  @Column({ name: 'PGM_DIV_CD', type: 'varchar2', length: 4, nullable: true })
  pgmDivCd: string;

  @Column({ name: 'BIZ_DIV_CD', type: 'varchar2', length: 4, nullable: true })
  bizDivCd: string;

  @Column({ name: 'SORT_SEQ', type: 'number', nullable: true })
  sortSeq: number;

  @Column({ name: 'USE_YN', type: 'char', length: 1, nullable: true })
  useYn: string;

  @Column({ name: 'UP_PGM_ID', type: 'varchar2', length: 20, nullable: true })
  upPgmId: string;

  @Column({ name: 'LINK_PATH', type: 'varchar2', length: 200, nullable: true })
  linkPath: string;

  @Column({ name: 'PGM_WDTH', type: 'number', nullable: true })
  pgmWdth: number;

  @Column({ name: 'PGM_HGHT', type: 'number', nullable: true })
  pgmHght: number;

  @Column({ name: 'PGM_PSN_TOP', type: 'number', nullable: true })
  pgmPsnTop: number;

  @Column({ name: 'PGM_PSN_LFT', type: 'number', nullable: true })
  pgmPsnLft: number;

  @Column({ name: 'POPUP_MONI', type: 'char', length: 1, nullable: true })
  popupMoni: string;

  @Column({ name: 'TGT_MDI_DIV_CD', type: 'varchar2', length: 4, nullable: true })
  tgtMdiDivCd: string;

  @Column({ name: 'SZ_UPD_USE_YN', type: 'char', length: 1, nullable: true })
  szUpdUseYn: string;

  @Column({ name: 'POPUP_SWT_USE_YN', type: 'char', length: 1, nullable: true })
  popupSwtUseYn: string;

  @Column({ name: 'SVC_SRVR_ID', type: 'varchar2', length: 20, nullable: true })
  svcSrvrId: string;

  @Column({ name: 'LINK_SVC_ID', type: 'varchar2', length: 20, nullable: true })
  linkSvcId: string;

  @Column({ name: 'REG_DTTM', type: 'varchar2', length: 14, nullable: true })
  regDttm: string;

  @Column({ name: 'CHNG_DTTM', type: 'varchar2', length: 14, nullable: true })
  chngDttm: string;

  @Column({ name: 'CHNGR_ID', type: 'varchar2', length: 10, nullable: true })
  chngrId: string;

  @BeforeInsert()
  beforeInsert() {
    const now = new Date();
    const timestamp = now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0') +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0');
    
    this.regDttm = timestamp;
    this.chngDttm = timestamp;
    if (!this.chngrId) {
      this.chngrId = 'SYSTEM';
    }
  }

  @BeforeUpdate()
  beforeUpdate() {
    const now = new Date();
    const timestamp = now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0') +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0');
    
    this.chngDttm = timestamp;
    if (!this.chngrId) {
      this.chngrId = 'SYSTEM';
    }
  }
}


