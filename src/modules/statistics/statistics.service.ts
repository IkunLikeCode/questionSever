import { Injectable } from '@nestjs/common';
import { StatisticsDto } from './statistics.dto';
import { Statistics } from 'src/entitys/Statistics';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { COUNT } from './const';
@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Statistics)
    private readonly statisticsRepository: Repository<Statistics>,
  ) {}

  createStatistics(statisticsDto: StatisticsDto) {
    const statistics = this.statisticsRepository.create({
      questionId: statisticsDto.questionId,
      componentsList: statisticsDto.componentsList,
    });
    // 保存实体
    return this.statisticsRepository.save(statistics);
  }
  /**
   * 根据问卷id获取问卷统计信息
   * @param id 问卷 ID
   * @returns 问卷统计信息
   */
  async getQuestionStatisticsById(id: string) {
    const [statistics, count] = await this.statisticsRepository.findAndCount({
      where: {
        questionId: id,
      },
    });
    if (count === 0) {
      return {
        statistics: [],
        count,
      };
    }
    let newStatistics = this.formStatistics(statistics);
    return {
      statistics: newStatistics,
      count,
    };
  }

  formStatistics(statistics: Statistics[]) {
    let questionRadioStatistics: any[] = [];
    let questionCheckBoxStatistics: any[] = [];
    for (let i = 0; i < statistics.length; i++) {
      const item = statistics[i].componentsList;
      if (item) {
        for (let j = 0; j < item.length; j++) {
          if (item[j].type === 'questionRadio') {
            questionRadioStatistics.push({
              type: item[j].type,
              fe_id: item[j].fe_id,
              props: {
                title: item[j].props.title,
                value: item[j].props.value,
                options: item[j].props.options,
              },
            });
          }
          if (item[j].type === 'questionCheckBox') {
            questionCheckBoxStatistics.push({
              type: item[j].type,
              fe_id: item[j].fe_id,
              props: {
                title: item[j].props.title,
                value: item[j].props.value,
                options: item[j].props.options,
              },
            });
          }
        }
      }
    }
    let questionRadioFeidGroup: any = {};
    let questionCheckBoxFeidGroup: any = {};
    questionRadioFeidGroup = questionRadioStatistics.reduce((p, c) => {
      if (!p[c.fe_id]) {
        p[c.fe_id] = [];
        p[c.fe_id].push(c);
      } else {
        p[c.fe_id].push(c);
      }
      return p;
    }, {});
    questionCheckBoxFeidGroup = questionCheckBoxStatistics.reduce((p, c) => {
      if (!p[c.fe_id]) {
        p[c.fe_id] = [];
        p[c.fe_id].push(c);
      } else {
        p[c.fe_id].push(c);
      }
      return p;
    }, {});
    let questionRadioResult: any = {};
    let questionCheckBoxResult: any = {};
    for (let key in questionRadioFeidGroup) {
      if (
        questionRadioFeidGroup[key] &&
        Array.isArray(questionRadioFeidGroup[key])
      ) {
        for (let i = 0; i < questionRadioFeidGroup[key].length; i++) {
          const item = questionRadioFeidGroup[key][i];
          if (!questionRadioResult[key]) {
            questionRadioResult[key] = item.props.options;
          }
          if (item) {
            for (let j = 0; j < questionRadioResult[item.fe_id].length; j++) {
              if (
                questionRadioResult[item.fe_id][j].value === item.props.value
              ) {
                if (!questionRadioResult[item.fe_id][j][COUNT]) {
                  questionRadioResult[item.fe_id][j][COUNT] = 1;
                } else {
                  questionRadioResult[item.fe_id][j][COUNT]++;
                }
              }
            }
          }
        }
      }
    }
    for (let key in questionCheckBoxFeidGroup) {
      if (
        questionCheckBoxFeidGroup[key] &&
        Array.isArray(questionCheckBoxFeidGroup[key])
      ) {
        for (let i = 0; i < questionCheckBoxFeidGroup[key].length; i++) {
          const item = questionCheckBoxFeidGroup[key][i];
          if (!questionCheckBoxResult[key]) {
            questionCheckBoxResult[key] = item.props.options;
          }
          for (let j = 0; j < questionCheckBoxResult[item.fe_id].length; j++) {
            if (
              item.props.value.includes(
                questionCheckBoxResult[item.fe_id][j].value,
              )
            ) {
              if (!questionCheckBoxResult[item.fe_id][j][COUNT]) {
                questionCheckBoxResult[item.fe_id][j][COUNT] = 1;
              } else {
                questionCheckBoxResult[item.fe_id][j][COUNT]++;
              }
            }
          }
        }
      }
    }
    return {
      questionRadioResult,
      questionCheckBoxResult,
    };
  }
}
