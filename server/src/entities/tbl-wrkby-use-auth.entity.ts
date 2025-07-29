import { Entity, Column, PrimaryColumn, BeforeInsert } from 'typeorm';

@Entity('TBL_WRKBY_USE_AUTH')
export class TblWrkbyUseAuth {
  @PrimaryColumn({ name: 'USER_ID' })
  userId: string;

  @PrimaryColumn({ name: 'WRK_DIV' })
  wrkDiv: string;

  @Column({ name: 'REG_DTTM', type: 'varchar2', length: 14, nullable: true })
  regDttm: string;

  @BeforeInsert()
  beforeInsert() {
    const now = new Date();
    this.regDttm = this.formatDateToYYYYMMDDHH24MISS(now);
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
