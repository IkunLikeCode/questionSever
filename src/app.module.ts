import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionModule } from './modules/question/question.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModuleConfig } from './db/index';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { FileModule } from './modules/file/file.module';
import { TosModule } from './modules/tos/tos.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { PersonModule } from './modules/person/person.module';

@Module({
  imports: [
    QuestionModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModuleConfig,
    UserModule,
    AuthModule,
    FileModule,
    TosModule,
    StatisticsModule,
    PersonModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
