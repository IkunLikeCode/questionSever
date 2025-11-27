import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './question.dto';
import { FindManyOptions, In, Like, Repository } from 'typeorm';
import { Question } from 'src/entitys/Question';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import trim from 'src/util/trim';
import handleRequestError from 'src/util/handleRequestError';
@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  createQuestion(createQuestionDto: CreateQuestionDto) {
    // 创建 Question 实体
    const question = this.questionRepository.create({
      ...trim(createQuestionDto),
      id: randomUUID().replace(/-/g, ''), // 手动设置 ID
      user: { id: createQuestionDto.userId },
    });
    // 保存实体
    return this.questionRepository.save(question);
  }

  /**
   * 更新问卷
   * @param questionId 问卷 ID
   * @param createQuestionDto 创建问题的 DTO
   * @returns
   */
  async updateQuestion(
    questionId: string,
    createQuestionDto: CreateQuestionDto,
  ) {
    // 更新问卷
    const result = await this.questionRepository.update(
      { id: questionId },
      trim(createQuestionDto),
    );
    return result;
  }

  /**
   * 根据问卷id获取问卷信息
   * @param questionId 问卷 ID
   * @returns 问卷信息
   */
  getQuestionById(questionId: string) {
    return this.questionRepository.findOne({
      where: { id: questionId },
      relations: ['user'],
      // 不允许返回的字段
      select: {
        user: {
          id: true,
          username: true,
          avatar: true,
          nickname: true,
        },
      },
    });
  }
  /**
   * 根据用户 ID 获取问题列表
   * @param userId 用户 ID
   * @returns 问题列表
   */
  async getQuestionListByUserId(
    userId: string,
    page: number,
    pageSize: number,
    state?: 'all' | 'isStar' | 'isDelete',
    searchText?: string,
  ) {
    const sqlObj: FindManyOptions<Question> = {
      // 排序
      order: {
        createdAt: 'DESC',
      },
      relations: ['user'],
      // 明确指定需要返回的字段，不包含 componentsList
      select: {
        id: true,
        title: true,
        desc: true,
        isPublished: true,
        isStar: true,
        isDelete: true,
        createdAt: true,
        user: {
          id: true,
          username: true,
          nickname: true,
        },
      },
      // 分页
      skip: (page - 1) * pageSize,
      take: pageSize,
    };
    switch (state) {
      case 'all':
        sqlObj.where = { user: { id: userId }, isDelete: false };
        break;
      case 'isStar':
        sqlObj.where = { user: { id: userId }, isDelete: false, isStar: true };
        break;
      case 'isDelete':
        sqlObj.where = { user: { id: userId }, isDelete: true };
        break;
      default:
        break;
    }
    console.log(searchText);
    // 只要有searchText，就进行模糊查询
    if (searchText) {
      sqlObj.where = {
        ...sqlObj.where,
        title: Like(`%${searchText}%`),
      };
    }
    const result = await this.questionRepository.findAndCount({
      ...sqlObj,
    });
    return {
      list: result[0],
      total: result[1],
    };
  }

  /**
   * 根据问卷id删除问卷
   * @param questionId 问卷 ID
   * @returns 删除结果
   */
  async deleteQuestion(questionId: string) {
    // 检查问卷是否存在
    const isExist = await this.isQuestionExist(questionId);
    if (!isExist) {
      handleRequestError(
        new HttpException('问卷不存在', HttpStatus.NOT_FOUND),
        '问卷不存在',
      );
    }
    // 删除问卷
    const result = await this.questionRepository.delete({ id: questionId });
    return result;
  }

  /**
   * 批量删除问卷
   * @param questionIds 问卷 ID 列表
   * @returns 删除结果
   */
  async deleteQuestionBatch(questionIds: string[]) {
    // 删除问卷
    const result = await this.questionRepository.delete({
      id: In(questionIds),
    });
    return result;
  }

  /**
   * 检查问卷是否存在
   * @param questionId 问卷 ID
   * @returns 是否存在
   */
  async isQuestionExist(questionId: string) {
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
    });
    return question !== null;
  }
}
