import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { checkCode, checkHttpLog, checkMessage } from './check-http';
import { MongoServerError } from 'mongodb';

@Catch(MongoServerError)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: MongoServerError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (exception.code === 11000) {
      // 提取重复字段
      const fields = Object.keys(exception.keyPattern).join(', ');
      return response.status(409).json({
        code: 409,
        message: `唯一约束冲突: ${fields} 组合已存在，重复为 ${JSON.stringify(exception.keyValue)}`,
      });
    }
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const excRes: any = exception instanceof HttpException && exception.getResponse();

    let excResMessage = '';
    if (excRes.message instanceof Array) {
      excResMessage = excRes.message.join('，');
    } else if (typeof excRes.message === 'string') {
      excResMessage = excRes.message;
    } else if (typeof excRes === 'string') {
      excResMessage = excRes;
    }
    const message = checkMessage(status, excResMessage);
    const code = checkCode(status);
    // @todo 记录日志
    checkHttpLog(status, request.method, request.url, `${message} ${excResMessage}`);
    response.status(status).json({
      code,
      message,
    });
  }
}
