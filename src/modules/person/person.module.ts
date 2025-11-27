import { Module } from '@nestjs/common';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from 'src/entitys/Question';
import { Statistics } from 'src/entitys/Statistics';
@Module({
  controllers: [PersonController],
  providers: [PersonService],
  imports: [TypeOrmModule.forFeature([Question, Statistics])],
})
export class PersonModule {}
