import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'TBL_MENU_DTL' })
export class MenuEntity {
  @PrimaryColumn({ name: 'MENU_ID', type: 'varchar2', length: 20 })
  menuId: string;

  @PrimaryColumn({ name: 'MENU_SEQ', type: 'number' })
  menuSeq: number;

  @Column({ name: 'PGM_ID', type: 'varchar2', length: 20, nullable: true })
  pgmId: string | null;

  @Column({ name: 'HGRK_MENU_SEQ', type: 'number' })
  hgrkMenuSeq: number;

  @Column({ name: 'MENU_SHP_DVCD', type: 'varchar2', length: 2 })
  menuShpDvcd: string;

  @Column({ name: 'SORT_SEQ', type: 'number' })
  sortSeq: number;

  @Column({ name: 'USE_YN', type: 'char', length: 1 })
  useYn: string;

  @Column({ name: 'REG_DTTM', type: 'varchar2', length: 14 })
  regDttm: string;

  @Column({ name: 'CHNG_DTTM', type: 'varchar2', length: 14 })
  chngDttm: string;

  @Column({ name: 'CHNGR_ID', type: 'varchar2', length: 10 })
  chngrId: string;
}
