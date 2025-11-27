import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './question.dto';
import { NotEmptyPipe } from 'src/pipes/NotEmpty.pipe';
import handleRequestError from 'src/util/handleRequestError';
import { Public } from 'src/modules/auth/decorators/public.decorator';
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}
  /**
   * 批量删除问卷
   * @param questionIds 问卷 ID 列表
   * @returns 删除结果
   */
  @Delete('batch')
  deleteQuestions(@Body('questionIds', NotEmptyPipe) questionIds: string[]) {
    try {
      return this.questionService.deleteQuestionBatch(questionIds);
    } catch (error) {
      handleRequestError(error, '批量删除问卷失败');
    }
  }

  /**
   * 创建问题
   * @param createQuestionDto 创建问题的 DTO
   * @returns
   */
  @Post()
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    try {
      return this.questionService.createQuestion(createQuestionDto);
    } catch (error) {
      handleRequestError(error, '创建问题失败');
    }
  }

  /**
   * 根据用户 ID 获取问题列表
   * @param userId 用户 ID
   * @returns 问题列表 使用Query 来分页
   */
  @Get()
  getQuestionListByUserId(
    @Query('userId', NotEmptyPipe) userId: string,
    @Query('page', NotEmptyPipe) page: number,
    @Query('pageSize', NotEmptyPipe) pageSize: number,
    @Query('state') state?: 'all' | 'isStar' | 'isDelete',
    @Query('searchText') searchText?: string,
  ) {
    try {
      return this.questionService.getQuestionListByUserId(
        userId,
        page,
        pageSize,
        state,
        searchText,
      );
    } catch (error) {
      handleRequestError(error, '获取问题列表失败');
    }
  }

  /**
   * 根据问卷id和用户id修改问卷，自己只能修改自己的问卷
   * @param questionId 问卷 ID
   * @param userId 用户 ID
   * @param createQuestionDto 创建问题的 DTO
   * @returns
   */
  // 绕过全局的校验管道，因为更新问卷时，用户 ID 是从 JWT 中获取的，而不是从请求体中获取的
  @Put(':questionId')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  updateQuestion(
    @Param('questionId', NotEmptyPipe) questionId: string,
    @Body() createQuestionDto: CreateQuestionDto,
  ) {
    try {
      return this.questionService.updateQuestion(questionId, createQuestionDto);
    } catch (error) {
      handleRequestError(error, '更新问卷失败');
    }
  }

  /**
   * 根据问卷id获取问卷信息
   * @param questionId 问卷 ID
   * @returns 问卷信息
   */
  // 不要使用jwt验证
  @Public()
  @Get(':questionId')
  getQuestionById(@Param('questionId') questionId: string) {
    try {
      return this.questionService.getQuestionById(questionId);
    } catch (error) {
      handleRequestError(error, '获取问卷失败');
    }
  }

  /**
   * 根据问卷id删除问卷假删除
   * @param questionId 问卷 ID
   * @returns 删除结果
   */
  @Delete(':questionId')
  deleteQuestion(@Param('questionId', NotEmptyPipe) questionId: string) {
    try {
      return this.questionService.updateQuestion(questionId, {
        isDelete: true,
      });
    } catch (error) {
      handleRequestError(error, '删除问卷失败');
    }
  }
}
