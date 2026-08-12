import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { useCustomConfig } from 'src/config';
import { ArticlePolicy } from 'src/schemas/blog/article-policy.schema';
import { Model, Types } from 'mongoose';
import { logger } from 'src/common/journal';

const customConfig = useCustomConfig();
const { blogDatabaseName } = customConfig;

@Injectable()
export class ArticlePolicyService {
  private readonly logger = new Logger(ArticlePolicyService.name);

  constructor(@InjectModel(ArticlePolicy.name, blogDatabaseName) private readonly policyModel: Model<ArticlePolicy>) {}

  /**
   * 创建一个新的访问策略（管理端使用）
   * @param articleId 文章ID
   * @param maxVisits 最大访问次数
   * @param expireDays 有效天数
   * @returns 创建的策略文档
   */
  public async createPolicy(articleId: string, maxVisits: number = 5, expireDays: number = 1): Promise<string | null> {
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expireDays);
      // 先批量删除掉以前同样文章的策略
      const deleteResult = await this.policyModel.deleteMany({ articleId });
      if (!deleteResult) {
        throw '批量删除策略 失败！';
      }
      logger.error(`批量删除策略 成功！${JSON.stringify(deleteResult)}`);
      const result = await this.policyModel.create({ articleId, maxVisits, expiresAt });
      logger.error(`创建策略 成功！${JSON.stringify(result)}`);
      return result._id;
    } catch (err) {
      logger.error(`创建策略 失败！${JSON.stringify(err)}`);
      return null;
    }
  }

  /**
   * 校验并消费一次访问（只校验，不创建，不删除）
   * @param policyId 策略的 _id 字符串
   * @returns 如果有效，返回关联的 articleId；否则返回 null
   */
  async consumePolicy(policyId: string): Promise<string | null> {
    try {
      if (!Types.ObjectId.isValid(policyId)) {
        logger.warn(`非法 policyId 格式: ${policyId}`);
        return null;
      }

      const policy = await this.policyModel.findById(policyId);
      if (!policy) {
        logger.warn(`策略不存在: ${policyId}`);
        return null;
      }

      if (new Date() > policy.expiresAt) {
        logger.warn(`策略已过期: ${policyId}`);
        return null;
      }

      if (policy.visitCount >= policy.maxVisits) {
        logger.warn(`策略访问次数用尽: ${policyId}`);
        return null;
      }

      const updated = await this.policyModel.findOneAndUpdate(
        { _id: policy._id, visitCount: { $lt: policy.maxVisits } },
        { $inc: { visitCount: 1 } },
        { new: true },
      );
      if (!updated) {
        logger.warn(`并发更新导致策略超限: ${policyId}`);
        return null;
      }
      logger.log(`校验并消费一次访问成功: ${JSON.stringify(updated)}`);
      return updated.articleId;
    } catch (err) {
      logger.error(`消费策略时发生异常: ${JSON.stringify(err)}`);
      return null;
    }
  }

  async findById(policyId: string): Promise<ArticlePolicy | null> {
    try {
      if (!Types.ObjectId.isValid(policyId)) {
        return null;
      }
      return await this.policyModel.findById(policyId).exec();
    } catch (err) {
      logger.error(`查询策略失败: ${JSON.stringify(err)}`);
      return null;
    }
  }
}
