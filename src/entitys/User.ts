import {
  Entity,
  PrimaryColumn,
  Column,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { randomUUID } from 'node:crypto';
import { Question } from './Question';
import { File } from './File';

@Entity()
export class User {
  // 使用 32 位字符串作为主键（如 UUID 去掉连字符）
  @PrimaryColumn({ type: 'char', length: 32 })
  id: string;

  // 登录账号
  @Column({ type: 'varchar', length: 255, nullable: true })
  loginId: string;

  @OneToMany(() => Question, (question) => question.user)
  questions: Question[];

  @OneToMany(() => File, (file) => file.user)
  files: File[];

  // 用户名
  @Column({ type: 'varchar', length: 255, nullable: true })
  username: string;

  // 密码
  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  // 头像
  @Column({
    type: 'varchar',
    length: 255,
    default:
      'https://th.bing.com/th/id/OIP.ZGSpSGxvso5ay00ckGgM6gHaE3?o=7&cb=12rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
  })
  avatar: string;

  // nickname
  @Column({ type: 'varchar', length: 255, nullable: true })
  nickname: string;

  // 创建时间 - 自动设置为实体创建时的时间
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  // 更新时间 - 自动设置为实体更新时的时间
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  private setId() {
    // 若未设置 id，则在插入前生成 32 位字符串
    if (!this.id) {
      this.id = randomUUID().replace(/-/g, '');
    }
  }
}
