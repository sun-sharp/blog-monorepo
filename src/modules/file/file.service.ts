import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  index() {
    return '文件内容';
  }
}
