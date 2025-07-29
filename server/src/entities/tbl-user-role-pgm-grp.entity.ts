import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity('TBL_USER_ROLE_PGM_GRP')
export class TblUserRolePgmGrp {
  @PrimaryColumn({ name: 'USR_ROLE_ID', type: 'varchar2', length: 10 })
  usrRoleId: string;

  @PrimaryColumn({ name: 'PGM_GRP_ID', type: 'varchar2', length: 10 })
  pgmGrpId: string;

  @Column({ name: 'USE_YN', type: 'char', length: 1, default: 'Y' })
  useYn: string;

  @Column({ name: 'REG_DTTM', type: 'varchar2', length: 14, nullable: true })
  regDttm?: string;

  @Column({ name: 'CHNG_DTTM', type: 'varchar2', length: 14, nullable: true })
  chngDttm?: string;

  @Column({ name: 'CHNGR_ID', type: 'varchar2', length: 20, nullable: true })
  chngrId?: string;

  // TBL_PGM_GRP ?�이블과 조인?�기 ?�한 가??컬럼 (DB?�는 ?�음)
  @Column({ select: false, insert: false, update: false })
  pgmGrpNm?: string;

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


