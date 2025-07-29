import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'TBL_UNIT_PRICE' })
export class UnitPriceEntity {
  @PrimaryColumn({ name: 'OWN_OUTS_DIV', type: 'char', length: 1 })
  ownOutsDiv: string;

  @PrimaryColumn({ name: 'YEAR', type: 'varchar2', length: 4 })
  year: string;

  @PrimaryColumn({ name: 'TCN_GRD', type: 'varchar2', length: 20 })
  tcnGrd: string;

  @PrimaryColumn({ name: 'DUTY_CD', type: 'varchar2', length: 20 })
  dutyCd: string;

  @Column({ name: 'UNIT_PRICE', type: 'number' })
  unitPrice: number;

  @Column({ name: 'USE_YN', type: 'char', length: 1 })
  useYn: string;
} 