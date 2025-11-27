import { randomUUID } from 'crypto';
import { Entity, Column, PrimaryColumn, BeforeInsert } from 'typeorm';

@Entity()
export class Statistics {
  @PrimaryColumn({
    type: 'char',
    length: 32,
    comment: '问卷统计id',
  })
  id: string;

  @Column({
    type: 'json',
    nullable: true,
    comment: '组件列表',
  })
  componentsList:
    | {
        fe_id: string;
        type: string;
        isHide: boolean;
        isLock: boolean;
        title: string;
        props: Record<string, any>;
      }[]
    | null;

  @BeforeInsert()
  private setId() {
    // 若未设置 id，则在插入前生成 32 位字符串
    if (!this.id) {
      this.id = randomUUID().replace(/-/g, '');
    }
  }

  @Column({
    type: 'char',
    length: 32,
    comment: '问卷id',
  })
  questionId: string;
}
