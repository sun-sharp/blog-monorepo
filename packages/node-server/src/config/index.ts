import { GlobalEnvConfig } from '/#/api/config';
import * as dotenv from 'dotenv';
import { resolve } from 'node:path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const {
  PORT,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  BLOG_DATABASE_NAME,
  CAPITAL_DATABASE_NAME,
  IMAGE_REFIX_NAME,
  STATIC_DIR_NAME,
  STATIC_DIR_POSITION,
  FILE_ACCESS_PATH,
  SERVER_IP,
  DATABASE_PORT,
  MONGODB_ACCOUNT,
  MONGODB_PASSWORD,
  MONGODB_QUERY,
} = process.env;

export const useCustomConfig = (): GlobalEnvConfig => ({
  port: Number(PORT) || 3000,
  jwtSecret: JWT_SECRET || 'xxx',
  jwtExpiresIn: JWT_EXPIRES_IN || '1d',
  blogDatabaseName: BLOG_DATABASE_NAME || 'blog',
  capitalDatabaseName: CAPITAL_DATABASE_NAME || 'capital',
  imageRefixName: IMAGE_REFIX_NAME || 'sharp_',
  staticDirName: STATIC_DIR_NAME || 'api_static_dir',
  staticDirPosition: STATIC_DIR_POSITION || '../',
  fileAccessPath: FILE_ACCESS_PATH || 'api_file',
  serverIp: SERVER_IP || '0.0.0.0',
  databasePort: Number(DATABASE_PORT) || 1111,
  mongodbAccount: MONGODB_ACCOUNT || 'xxxx',
  mongodbPassword: MONGODB_PASSWORD || 'xxxx',
  mongodbQuery: MONGODB_QUERY || '?xx=xx',
});
