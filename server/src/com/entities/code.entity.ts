import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'TBL_CODE_DTL' })
export class CodeEntity {
  @PrimaryColumn({ name: 'CODE_ID', type: 'varchar2', length: 20 })
  codeId: string;

  @Column({ name: 'CODE_NM', type: 'varchar2', length: 100 })
  codeNm: string;

  @Column({ name: 'USE_YN', type: 'char', length: 1 })
  useYn: string;

  @Column({ name: 'SORT_SEQ', type: 'number' })
  sortSeq: number;
} 