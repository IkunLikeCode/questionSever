import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const message = exception.message ? exception.message : '未知错误';
    const responseBody = exception.getResponse();
    
    // 统一返回 200 状态码，错误信息通过 JSON 传递
    response.status(200).json({
      errno: -1,
      msg: (responseBody as any).msg || message,
      code: status, // 保留原始 HTTP 状态码作为错误代码
      success: false,
    });
  }
}
