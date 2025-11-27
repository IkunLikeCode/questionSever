import { Injectable } from '@nestjs/common';
import { TosClient } from '@volcengine/tos-sdk';
const connectionTimeout = 10000;
const requestTimeout = 120000;
@Injectable()
export class TosService {
  readonly tosClient: TosClient;
  constructor() {
    const accessKeyId = process.env['TOS_ACCESS_KEY'];
    const accessKeySecret = process.env['TOS_SECRET_KEY'];

    if (!accessKeyId || !accessKeySecret) {
      console.warn('⚠️  TOS 配置警告: 缺少必要的环境变量');
      console.warn('请在 .env 文件中配置:');
      console.warn('TOS_ACCESS_KEY=your_access_key_here');
      console.warn('TOS_SECRET_KEY=your_secret_key_here');
      console.warn('如果不使用 TOS 服务，可以忽略此警告');
    }

    this.tosClient = new TosClient({
      region: 'cn-beijing',
      endpoint: 'tos-cn-beijing.volces.com',
      accessKeyId: accessKeyId || '',
      accessKeySecret: accessKeySecret || '',
      connectionTimeout,
      requestTimeout,
    });
  }
}
