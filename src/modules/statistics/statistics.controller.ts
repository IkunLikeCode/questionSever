import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { StatisticsDto } from './statistics.dto';
import { StatisticsService } from './statistics.service';
import { Public } from '../auth/decorators/public.decorator';
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}
  @Public()
  @Post()
  createStatistics(@Body() statisticsDto: StatisticsDto) {
    try {
      return this.statisticsService.createStatistics(statisticsDto);
    } catch (error) {
      console.log(error);
      return {
        message: '创建失败',
      };
    }
  }

  @Public()
  @Get()
  getQuestionStatisticsById(@Query('id') id: string) {
    try {
      return this.statisticsService.getQuestionStatisticsById(id);
    } catch (error) {
      console.log(error);
      return {
        message: '获取失败',
      };
    }
  }
}
