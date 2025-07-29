import { Entity, Column, PrimaryColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity('TBL_PGM_GRP_INF')
export class TblPgmGrp {
  @PrimaryColumn({ name: 'PGM_GRP_ID', type: 'varchar2', length: 20 })
  pgmGrpId: string;

  @Column({ name: 'PGM_GRP_NM', type: 'varchar2', length: 100, nullable: true })
  pgmGrpNm: string;

  @Column({ name: 'USE_YN', type: 'char', length: 1, nullable: true })
  useYn: string;

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
    this.chngrId = 'SYSTEM';
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
    this.chngrId = 'SYSTEM';
  }
}


