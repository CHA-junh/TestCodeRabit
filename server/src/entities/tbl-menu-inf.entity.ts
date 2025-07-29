import {
  Column,
  Entity,
  PrimaryColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity('TBL_MENU_INF')
export class TblMenuInf {
  @PrimaryColumn('varchar2', { name: 'MENU_ID', length: 20 })
  menuId: string;

  @Column('varchar2', { name: 'MENU_NM', nullable: true, length: 100 })
  menuNm: string | null;

  @Column('char', { name: 'USE_YN', nullable: true, length: 1 })
  useYn: string | null;

  @Column('varchar2', { name: 'REG_DTTM', nullable: true, length: 14 })
  regDttm: string | null;

  @Column('varchar2', { name: 'CHNG_DTTM', nullable: true, length: 14 })
  chngDttm: string | null;

  @Column('varchar2', { name: 'CHBGR_ID', nullable: true, length: 10 })
  chngrId: string | null;

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
