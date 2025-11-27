import { randomUUID } from 'crypto';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Question {
  // 使用 32 位字符串作为主键（如 UUID 去掉连字符）
  @PrimaryColumn({ type: 'char', length: 32, comment: '问卷 ID' })
  id: string;

  @ManyToOne(() => User, (user) => user.questions)
  @JoinColumn({ name: 'userId' }) // 外键列名
  user: User;

  @BeforeInsert()
  private setId() {
    // 若未设置 id，则在插入前生成 32 位字符串
    if (!this.id) {
      this.id = randomUUID().replace(/-/g, '');
    }
  }

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: '问卷标题',
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: '问卷描述',
  })
  desc: string;

  @Column({
    type: 'varchar',
    length: 255,
    default: '#ffffff',
    comment: '问卷文本主颜色',
  })
  textMainColor: string;

  @Column({
    type: 'varchar',
    length: 255,
    default: '#ffffff',
    comment: '问卷背景主颜色',
  })
  bgMainColor: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: '作者',
  })
  author: string;

  @Column({
    type: 'varchar',
    length: 255,
    default: '',
    comment: '问卷 js 代码',
  })
  js: string;

  @Column({
    type: 'varchar',
    length: 255,
    default: '',
    comment: '问卷 css 代码',
  })
  css: string;

  @Column({
    type: 'boolean',
    default: false,
    comment: '是否发布（0是未发布,1是发布）',
  })
  isPublished: boolean;

  @Column({
    type: 'boolean',
    default: false,
    comment: '是否标星',
  })
  isStar: boolean;

  @Column({
    type: 'boolean',
    default: false,
    comment: '是否删除',
  })
  isDelete: boolean;

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

  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  updatedAt: Date;
}
