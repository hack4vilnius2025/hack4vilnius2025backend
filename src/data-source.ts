import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.STACKHERO_MYSQL_HOST || process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.STACKHERO_MYSQL_PORT || process.env.DB_PORT || '3306'),
  username: 'root',
  password: process.env.STACKHERO_MYSQL_ROOT_PASSWORD || process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'main',
  synchronize: true, // Set to false in production
  logging: process.env.NODE_ENV === 'development',
  entities: ['src/modules/**/models/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});

