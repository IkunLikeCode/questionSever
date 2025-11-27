import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    comment: '文件名',
  })
  fileName: string;

  @Column({
    type: 'int',
    comment: '文件大小',
  })
  fileSize: number;

  @Column({
    type: 'varchar',
    comment: '文件url',
  })
  fileUrl: string;

  // 关联用户
  @ManyToOne(() => User, (user) => user.files)
  @JoinColumn({ name: 'userId' })
  user: User;
}
