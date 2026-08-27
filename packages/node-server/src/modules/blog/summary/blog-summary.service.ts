import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { billUploadTypeEnum } from 'src/common/enums/money.enum';
import { logger } from 'src/common/journal';
import { useCustomConfig } from 'src/config';
import { RoleService } from 'src/modules/capital/role/role.service';
import { User } from 'src/schemas/capital/user.schema';
import { Role } from 'src/schemas/capital/role.schema';
import { Menu } from 'src/schemas/capital/menu.schema';
import { Image } from 'src/schemas/capital/image.schema';
import { Uric } from 'src/schemas/capital/uric.schema';
import { Article } from 'src/schemas/blog/article.schema';
import { Bank } from 'src/schemas/blog/money/bank.schema';
import { WeChat } from 'src/schemas/blog/money/we-chat.schema';
import { AliPay } from 'src/schemas/blog/money/ali-pay.schema';
import { BillUpload } from 'src/schemas/blog/money/bill-upload.schema';
import {
  ApiHomeStatBillUploadTypeCount,
  ApiHomeStatFinancialTypeCount,
  ApiHomeStatImageSourceCount,
  ApiHomeStatImageTypeCount,
  ApiHomeStatUricTypeCount,
  ApiHomeStatistics,
} from '/#/api/blog/home-statistics';
import { IResponse } from '/#/common/common';

const customConfig = useCustomConfig();
const { blogDatabaseName, capitalDatabaseName } = customConfig;

const billUploadTypeNameMap: Record<number, string> = {
  [billUploadTypeEnum.weChat]: '微信账单',
  [billUploadTypeEnum.aliPay]: '支付宝账单',
  [billUploadTypeEnum.bank]: '银行账单',
};

// 银行类型(与 bankExcelCellMap 的 key 对应)
const bankTypeNameMap: Record<number, string> = {
  1: '工商银行',
  2: '农业银行',
  3: '建设银行',
  4: '民生银行',
  5: '招商银行',
};

@Injectable()
export class BlogSummaryService {
  constructor(
    // capital 数据库
    @InjectModel(User.name, capitalDatabaseName) private readonly userModel: Model<User>,
    @InjectModel(Role.name, capitalDatabaseName) private readonly roleModel: Model<Role>,
    @InjectModel(Menu.name, capitalDatabaseName) private readonly menuModel: Model<Menu>,
    @InjectModel(Image.name, capitalDatabaseName) private readonly imageModel: Model<Image>,
    @InjectModel(Uric.name, capitalDatabaseName) private readonly uricModel: Model<Uric>,
    // blog 数据库
    @InjectModel(Article.name, blogDatabaseName) private readonly articleModel: Model<Article>,
    @InjectModel(Bank.name, blogDatabaseName) private readonly bankModel: Model<Bank>,
    @InjectModel(WeChat.name, blogDatabaseName) private readonly weChatModel: Model<WeChat>,
    @InjectModel(AliPay.name, blogDatabaseName) private readonly aliPayModel: Model<AliPay>,
    @InjectModel(BillUpload.name, blogDatabaseName) private readonly billUploadModel: Model<BillUpload>,
    // 服务
    private readonly roleService: RoleService,
  ) {}

  /**
   * @description: 首页统计
   * @param {string} userId 当前用户
   * @param {string} roleCode 当前用户角色编码
   * @return {Promise<IResponse>}
   */
  public homeStatistics(userId: string, roleCode: string): Promise<IResponse> {
    return Promise.resolve({ userId, roleCode })
      .then(async ({ userId, roleCode }) => {
        // 判断是否为系统管理员(roleType === 1 统计全表，否则按当前用户)
        const roleFind = await this.roleService.findOneByRoleCode(roleCode);
        const isAdmin = !!(roleFind && roleFind.roleType === 1);

        // 财务账单各类型数量(按范围)
        const financialMineCondition = { userId: userId.toString() };
        const weChatCondition = isAdmin ? {} : financialMineCondition;
        const aliPayCondition = isAdmin ? {} : financialMineCondition;
        const bankCondition = isAdmin ? {} : financialMineCondition;
        const [weChatCount, aliPayCount, bankCount, bankTypeGroup] = await Promise.all([
          this.weChatModel.countDocuments(weChatCondition),
          this.aliPayModel.countDocuments(aliPayCondition),
          this.bankModel.countDocuments(bankCondition),
          this.bankModel.aggregate<{ _id: number; count: number }>([{ $match: bankCondition }, { $group: { _id: '$bankType', count: { $sum: 1 } } }]),
        ]);
        const financialCount = weChatCount + aliPayCount + bankCount;
        const bankChildren: ApiHomeStatFinancialTypeCount[] = (bankTypeGroup || [])
          .map((m) => ({
            source: `bank_${m._id}`,
            label: bankTypeNameMap[m._id] || `银行${m._id}`,
            count: m.count,
          }))
          .sort((a, b) => a.count - b.count);
        const financialTypeCount: ApiHomeStatFinancialTypeCount[] = [
          { source: 'weChat', label: '微信账单', count: weChatCount },
          { source: 'aliPay', label: '支付宝账单', count: aliPayCount },
          {
            source: 'bank',
            label: '银行账单',
            count: bankCount,
            children: bankChildren,
          },
        ];

        // 文章数(普通用户看自己，管理员看全表)
        const articleCondition = isAdmin ? {} : { authorId: userId.toString() };
        const articleCount = await this.articleModel.countDocuments(articleCondition);

        // 用户数
        const userCount = await this.userModel.countDocuments({});

        // 角色数
        const roleCount = await this.roleModel.countDocuments({});

        // 菜单数
        const menuCount = await this.menuModel.countDocuments({});

        // 尿酸盐糖测量总数 + 按类型分组
        const [uricCount, uricTypeGroup] = await Promise.all([
          this.uricModel.countDocuments({}),
          this.uricModel.aggregate<{ _id: string; count: number }>([{ $group: { _id: '$measureType', count: { $sum: 1 } } }]),
        ]);
        const uricTypeCount: ApiHomeStatUricTypeCount[] = (uricTypeGroup || []).map((m) => ({
          type: m._id,
          count: m.count,
        }));

        // 上传规则每个大类的数量
        const billUploadGroup = await this.billUploadModel.aggregate<{ _id: number; count: number }>([
          { $group: { _id: '$billUploadType', count: { $sum: 1 } } },
        ]);
        const billUploadTypeCount: ApiHomeStatBillUploadTypeCount[] = (billUploadGroup || [])
          .map((m) => ({
            type: m._id,
            label: billUploadTypeNameMap[m._id] || String(m._id),
            count: m.count,
          }))
          .sort((a, b) => a.type - b.type);

        // 每个类型图片数量
        const imageGroup = await this.imageModel.aggregate<{ _id: string; count: number }>([{ $group: { _id: '$imageType', count: { $sum: 1 } } }]);
        const imageTypeCount: ApiHomeStatImageTypeCount[] = (imageGroup || []).map((m) => ({
          type: m._id,
          count: m.count,
        }));

        // 图片按使用来源(user-个人用户 article-文章)分组
        const imageSourceGroup = await this.imageModel.aggregate<{ _id: { source: string; imageType: string }; count: number }>([
          {
            $group: {
              _id: {
                source: { $arrayElemAt: [{ $split: ['$source', '_'] }, 0] },
                imageType: '$imageType',
              },
              count: { $sum: 1 },
            },
          },
        ]);
        const imageSourceLabelMap: Record<string, string> = {
          user: '个人用户图片',
          article: '文章图片',
        };
        const imageSourceMap: Record<string, ApiHomeStatImageSourceCount> = {};
        (imageSourceGroup || []).forEach((m) => {
          const lib = m._id.source;
          if (!imageSourceMap[lib]) {
            imageSourceMap[lib] = {
              source: lib,
              label: imageSourceLabelMap[lib] || lib,
              count: 0,
              children: [],
            };
          }
          imageSourceMap[lib].count += m.count;
          imageSourceMap[lib].children!.push({ type: m._id.imageType, count: m.count });
        });
        const imageSourceCount: ApiHomeStatImageSourceCount[] = Object.values(imageSourceMap);

        // 总接口数
        const apiArr = await this.roleService.findApiAllOneDimensional();
        const apiCount = apiArr.length;

        const result: ApiHomeStatistics = {
          financialCount,
          financialTypeCount,
          articleCount,
          userCount,
          roleCount,
          menuCount,
          apiCount,
          uricCount,
          billUploadTypeCount,
          imageTypeCount,
          imageSourceCount,
          uricTypeCount,
        };
        return {
          code: ApiCode.SUCCESS,
          result,
          message: '获取成功！',
        };
      })
      .catch((err) => {
        logger.error(`首页统计 失败! ${err}`);
        return {
          code: ApiCode.ERROR,
          message: err || '获取失败！',
        };
      });
  }
}
