import { Injectable } from '@nestjs/common';

@Injectable()
export class MoneyService {
  index() {
    return '金钱内容';
  }
}
