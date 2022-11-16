import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { checkCode, checkHttpLog, checkMessage } from './check-http';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const excRes: any = exception instanceof HttpException && exception.getResponse();
    console.log(excRes, 'excRes');

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
    checkHttpLog(status, request.method, request.url, message);
    response.status(status).json({
      code,
      message,
    });
  }
}
