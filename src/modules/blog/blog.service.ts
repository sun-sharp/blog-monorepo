import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { logger } from 'src/common/journal';
import { IResponse } from 'types/common';
import { ArticleService } from './article/article.service';
import { useCustomConfig } from 'src/config';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { MoneyService } from './money/money.service';

const customConfig = useCustomConfig();
const { storeDirPosition, storeDirName } = customConfig;

@Injectable()
export class BlogService {
  constructor(
    private readonly articleService: ArticleService,
    private readonly moneyService: MoneyService,
  ) {}

  /**
   * @description: 备份数据库blog数据
   * @return {Promise<IResponse>}
   */
  public backupsBlog(): Promise<IResponse> {
    return (
      Promise.resolve()
        .then(async () => {
          // 判断store目录是否存在
          const storeDir = `${storeDirPosition}${storeDirName}`;
          const hasStoreDir = existsSync(storeDir);
          if (!hasStoreDir) {
            // 创建store目录
            mkdirSync(storeDir);
            logger.log('创建store存储目录');
          }
          // 判断json目录是否存在
          const jsonDir = `${storeDir}/json`;
          const hasJsonDir = existsSync(jsonDir);
          if (!hasJsonDir) {
            // 创建json目录
            mkdirSync(jsonDir);
            logger.log('创建json目录');
          }
          // 判断json/blog目录是否路径存在
          const blogDir = `${jsonDir}/blog`;
          const hasDir = existsSync(blogDir);
          if (!hasDir) {
            // 创建json/blog目录
            mkdirSync(blogDir);
            logger.log('创建json/capital目录');
          }
          return blogDir;
        })
        .then(async (blogDir) => {
          // 备份blog/article
          const articleData = await this.articleService.findAllToData();
          const articleStr = JSON.stringify(articleData, null, '\t');
          writeFileSync(`${blogDir}/article.json`, articleStr);
          logger.log('备份数据库blog/article数据');
          // 备份blog/money
          await this.moneyService.backupsCapital();
          return {
            code: ApiCode.SUCCESS,
            message: '备份成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`备份数据库blog 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '备份失败！',
          };
        })
    );
  }
}
