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
   * @description: 查询全部 css 名称列表
   * @return {Promise<{ name: string }[]>}
   */
  public async findAllNames(): Promise<{ name: string }[]> {
    try {
      const docs = await this.articleCssModel.find().select('name -_id').lean().exec();
      return docs.map((d) => ({ name: d.name }));
    } catch (err) {
      logger.error(`查询 css 名称列表 失败！${err}`);
      return [];
    }
  }

  /**
   * @description: 运用name查找文件css内容
   * @param {string} name
   * @return {Promise<User>}
   */
  public async findOneByName(name: string): Promise<string> {
    try {
      const doc = await this.articleCssModel.findOne({ name }).lean().exec();
      if (!doc) {
        logger.warn(`未找到 css 模板: ${name}`);
        return '';
      }
      logger.log('运用name查找文件css内容，成功');
      return doc.cssContent;
    } catch (err) {
      logger.error(`单图片上传 失败！${err}`);
      return '';
    }
  }
}
