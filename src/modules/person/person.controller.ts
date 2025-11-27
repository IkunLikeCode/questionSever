import { Controller, Get, Req } from '@nestjs/common';
import { PersonService } from './person.service';
@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  /**
   * 获取所有用户的问题写入次数
   * @param context 执行上下文
   * @returns 所有用户的问题写入次数
   */
  @Get()
  findAllQuestionWriteCount(@Req() request: Request) {
    try {
      const userId = (request as any).user?.id;
      return this.personService.findAllQuestionWriteCount(userId);
    } catch (error) {
      return error.message;
    }
  }
}
