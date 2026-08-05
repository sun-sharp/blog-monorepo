import { plainToInstance } from 'class-transformer';
import { IsIn, IsNotEmpty, IsString, MinLength, validateSync } from 'class-validator';

class EnvConfig {
  @IsIn(['dev', 'prod'])
  RUNNING_ENV: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(16, { message: 'JWT_SECRET 至少需要 16 个字符' })
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRES_IN: string;
}

export function validateEnv(config: Record<string, any>) {
  const validatedConfig = plainToInstance(EnvConfig, config, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig);
  if (errors.length > 0) {
    const messages = errors.map((e) => Object.values(e.constraints || {}).join(', ')).join('\n');
    throw new Error(`环境变量校验失败:\n${messages}`);
  }
  return validatedConfig;
}
