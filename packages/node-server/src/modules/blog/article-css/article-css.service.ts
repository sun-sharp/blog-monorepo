import { Injectable } from '@nestjs/common';
import { logger } from 'src/common/journal';
import { useCustomConfig } from 'src/config';
import { InjectModel } from '@nestjs/mongoose';
import { ArticleCss } from 'src/schemas/blog/article-css.schema';
import { Model } from 'mongoose';

const customConfig = useCustomConfig();
const { blogDatabaseName } = customConfig;

@Injectable()
export class ArticleCssService {
  constructor(@InjectModel(ArticleCss.name, blogDatabaseName) private readonly articleCssModel: Model<ArticleCss>) {}

  /**
   * @description: 运用name查找文件css内容
   * @param {string} name
   * @return {Promise<User>}
   */
  public async findOneByName(name: string): Promise<string> {
    try {
      const { cssContent } = await this.articleCssModel.findOne({ name }).lean().exec();
      logger.log('运用name查找文件css内容，成功');
      return cssContent;
    } catch (err) {
      logger.error(`单图片上传 失败！${err}`);
      return '';
    }
  }
}
