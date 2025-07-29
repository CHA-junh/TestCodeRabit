import {
  Column,
  Entity,
  PrimaryColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity('TBL_MENU_DTL')
export class TblMenuDtl {
  @PrimaryColumn('varchar2', { name: 'MENU_ID', length: 20 })
  menuId: string;

  @PrimaryColumn('number', { name: 'MENU_SEQ', precision: 8, scale: 0 })
  menuSeq: number;

  @Column('varchar2', { name: 'PGM_ID', nullable: true, length: 20 })
  pgmId: string | null;

  @Column('number', { name: 'HGRK_MENU_SEQ', nullable: true, precision: 8, scale: 0 })
  hgrkMenuSeq: number | null;

  @Column('varchar2', { name: 'MENU_DSP_NM', nullable: true, length: 100 })
  menuDspNm: string | null;

  @Column('varchar2', { name: 'MENU_SHP_DVCD', nullable: true, length: 4 })
  menuShpDvcd: string | null;

  @Column('number', { name: 'SORT_SEQ', nullable: true, precision: 8, scale: 0 })
  sortSeq: number | null;

  @Column('char', { name: 'USE_YN', nullable: true, length: 1 })
  useYn: string | null;

  @Column('varchar2', { name: 'REG_DTTM', nullable: true, length: 14 })
  regDttm: string | null;

  @Column('varchar2', { name: 'CHNG_DTTM', nullable: true, length: 14 })
  chngDttm: string | null;

  @Column('varchar2', { name: 'CHNGR_ID', nullable: true, length: 10 })
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