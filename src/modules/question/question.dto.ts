import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
export class CreateQuestionDto {
  @IsNotEmpty({ message: '标题不能为空' })
  @IsString({ message: '标题必须为字符串' })
  @MaxLength(50, { message: '标题长度不能超过 50 个字符' })
  title?: string;
  desc?: string;
  author?: string;
  js?: string;
  css?: string;
  isDelete?: boolean;
  isPublished?: boolean;
  isStar?: boolean;

  @IsNotEmpty({ message: '用户 ID 不能为空' })
  @IsString({ message: '用户 ID 必须为字符串' })
  userId?: string;
  componentsList?: {
    fe_id: string;
    isHide: boolean;
    isLock: boolean;
    type: string;
    title: string;
    props: Record<string, any>;
  }[];
}
