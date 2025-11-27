import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/entitys/Question';
import { Statistics } from 'src/entitys/Statistics';
@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Statistics)
    private readonly statisticsRepository: Repository<Statistics>,
  ) {}

  /**
   * 获取所有用户的问题写入次数
   * @param userId 用户ID
   * @returns 所有用户的问题写入次数
   */
  async findAllQuestionWriteCount(userId: string) {
    const questions = await this.questionRepository.findAndCount({
      where: { user: { id: userId } },
    });
    const questionsIdList = questions[0].map((item) => item.id);
    if (!questionsIdList.length) return [];
    const rows = await this.statisticsRepository
      .createQueryBuilder('st')
      .innerJoin(Question, 'q', 'q.id = st.questionId')
      .select('st.questionId', 'questionId')
      .addSelect('q.title', 'title')
      .addSelect('COUNT(*)', 'writeCount')
      .where('st.questionId IN (:...ids)', { ids: questionsIdList })
      .groupBy('st.questionId')
      .addGroupBy('q.title')
      .getRawMany();
    const result = {
      data: [...rows],
      count: questions[1],
    };
    return result;
  }
}
