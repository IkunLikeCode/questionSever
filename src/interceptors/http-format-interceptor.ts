import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// 格式化拦截器 在控制器返回数据之前格式化数据
@Injectable()
export class HttpFormatInterceptor<T> implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler<any>): Observable<T> {
    return next.handle().pipe(
      map((data) => {
        return {
          errno: 0,
          data,
          success: true,
          msg: '操作成功',
        } as T;
      }),
    );
  }
}
