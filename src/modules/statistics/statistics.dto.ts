import { IsNotEmpty } from 'class-validator';

export class StatisticsDto {
  @IsNotEmpty({ message: '问卷统计id不能为空' })
  id: string;

  @IsNotEmpty({ message: '问卷id不能为空' })
  questionId: string;

  @IsNotEmpty({ message: '组件列表不能为空' })
  componentsList: {
    fe_id: string;
    type: string;
    isHide: boolean;
    isLock: boolean;
    title: string;
    props: Record<string, any>;
  }[];
}
