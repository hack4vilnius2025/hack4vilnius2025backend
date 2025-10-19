import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

// Base configuration
const baseConfig = {
  type: 'mysql' as const,
  synchronize: true, // Set to false in production
  logging: process.env.NODE_ENV === 'development',
  entities: ['src/modules/**/models/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
};

// If StackHero URL is provided, use it; otherwise use individual parameters
const dataSourceConfig: DataSourceOptions = process.env.STACKHERO_MYSQL_DATABASE_URL
  ? {
      ...baseConfig,
      url: process.env.STACKHERO_MYSQL_DATABASE_URL,
    }
  : {
      ...baseConfig,
      host: process.env.STACKHERO_MYSQL_HOST || process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.STACKHERO_MYSQL_PORT || process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.STACKHERO_MYSQL_ROOT_PASSWORD || process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'main',
    };

export const AppDataSource = new DataSource(dataSourceConfig);

