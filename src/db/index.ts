import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'node:path';
import { ConfigModule, ConfigService } from '@nestjs/config';
// Use forRootAsync to ensure .env variables are loaded before reading them
export const TypeOrmModuleConfig = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: 'mysql',
    host: config.get<string>('host'),
    port: Number(config.get<number>('DB_PORT') ?? 3306),
    username: 'root',
    password: config.get<string>('password'),
    database: config.get<string>('database'),
    entities: [join(__dirname, '../entitys/**/*.{ts,js}')],
    synchronize: true,
  }),
});
