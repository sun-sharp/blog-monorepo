import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { logger } from '../journal';
import { checkCode } from './check-code';
import { checkMessage } from './check-message';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const excRes: any = exception instanceof HttpException && exception.getResponse();
    const message = checkMessage(
      status,
      excRes.message instanceof Array ? excRes.message.join('，') : typeof excRes.message === 'string' ? excRes.message : '',
    );
    const code = checkCode(status);
    // @todo 记录日志
    logger.log('%s %s error: %s', request.method, request.url, message);
    response.status(status).json({
      code,
      message,
    });
  }
}
