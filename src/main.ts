import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpFormatInterceptor } from './interceptors/http-format-interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { CodeExceptionFilter } from './filters/code-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); //设置全局前缀
  app.useGlobalInterceptors(new HttpFormatInterceptor()); // 全局注册格式化拦截器
  // 全局注册校验管道和异常过滤器（顺序很重要）
  app.useGlobalFilters(new HttpExceptionFilter()); // 先注册 HTTP 异常过滤器
  app.useGlobalFilters(new CodeExceptionFilter()); // 最后注册通用异常过滤器
  await app.listen(process.env.APP_PORT ? Number(process.env.APP_PORT) : 9000);
}
bootstrap();
