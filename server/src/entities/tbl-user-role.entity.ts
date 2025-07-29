import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity('TBL_USER_ROLE')
export class TblUserRole {
  @PrimaryColumn('varchar2', { name: 'USR_ROLE_ID', length: 20 })
  usrRoleId: string;

  @Column({ name: 'MENU_ID', type: 'varchar2', length: 20, nullable: true })
  menuId: string;

  @Column({
    name: 'USR_ROLE_NM',
    type: 'varchar2',
    length: 100,
    nullable: true,
  })
  usrRoleNm: string;

  @Column({ name: 'ATHR_GRD_CD', type: 'varchar2', length: 4, nullable: true })
  athrGrdCd: string;

  @Column({
    name: 'ORG_INQ_RNG_CD',
    type: 'varchar2',
    length: 4,
    nullable: true,
  })
  orgInqRngCd: string;

  @Column({
    name: 'BASE_OUTPUT_SCRN_PGM_ID_CTT',
    type: 'varchar2',
    length: 20,
    nullable: true,
  })
  baseOutputScrnPgmIdCtt: string;

  @Column({ name: 'USE_YN', type: 'char', length: 1, nullable: true })
  useYn: string;

  @Column({ name: 'REG_DTTM', type: 'varchar2', length: 14, nullable: true })
  regDttm: string;

  @Column({ name: 'CHNG_DTTM', type: 'varchar2', length: 14, nullable: true })
  chngDttm: string;

  @Column({ name: 'CHNGR_ID', type: 'varchar2', length: 10, nullable: true })
  chngrId: string;

  @BeforeInsert()
  generateUsrRoleId() {
    if (!this.usrRoleId || this.usrRoleId.trim() === '') {
      const today = new Date();
      const year = today.getFullYear().toString().slice(-2);
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const timestamp = Date.now().toString().slice(-3);

      this.usrRoleId = `A${year}${month}${day}${timestamp}`;
    }
  }

  @BeforeInsert()
  setRegDttm() {
    const now = new Date();
    if (!this.regDttm) {
      this.regDttm = this.formatDateTime(now);
    }
    // 신규 등록 시에도 CHNG_DTTM 설정
    this.chngDttm = this.formatDateTime(now);
  }

  @BeforeUpdate()
  setChngDttm() {
    const now = new Date();
    this.chngDttm = this.formatDateTime(now);
  }

  private formatDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }
}
