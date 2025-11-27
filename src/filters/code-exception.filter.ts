// 自定义异常过滤器 捕获代码异常
import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';

@Catch()
export class CodeExceptionFilter implements ExceptionFilter {
  catch(_exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // 统一返回 200 状态码，错误信息通过 JSON 传递
    response.status(200).json({
      errno: -1,
      msg: _exception.response?.message || _exception.message || '服务器错误',
      success: false,
    });
  }
}
