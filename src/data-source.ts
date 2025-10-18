import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'main',
  synchronize: true, // Set to false in production
  logging: process.env.NODE_ENV === 'development',
  entities: ['src/modules/**/models/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});

