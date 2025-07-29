import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity({ name: 'TBL_PGM_GRP_INF' })
export class TblPgmGrpInf {
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
    this.regDttm = this.formatDateToYYYYMMDDHH24MISS(now);
    this.chngDttm = this.formatDateToYYYYMMDDHH24MISS(now);
  }

  @BeforeUpdate()
  beforeUpdate() {
    const now = new Date();
    this.chngDttm = this.formatDateToYYYYMMDDHH24MISS(now);
  }

  private formatDateToYYYYMMDDHH24MISS(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }
}


