import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { logger } from 'src/common/journal';
import { Category } from 'src/schemas/capital/category.schema';
import { PageCategoryDto } from './dto/page-category.dto';
import { PaginateHandle } from 'src/common/paginate/paginate-handle';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiCategoryItem } from 'types/capital/category';
import { IResponse } from 'types/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { useCustomConfig } from 'src/config';

const customConfig = useCustomConfig();
const { capitalDatabaseName } = customConfig;

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name, capitalDatabaseName) private readonly categoryModel: Model<Category>) {}

  /**
   * @description: 新增文章分类
   * @param {CreateCategoryDto} createCategoryDto
   * @return {Promise<IResponse>}
   */
  public create(createCategoryDto: CreateCategoryDto): Promise<IResponse> {
    return (
      Promise.resolve(createCategoryDto)
        // 处理全局类型标识重复问题
        .then(async (body) => {
          const { type, value, valueStr, label } = body;
          if (!value && !valueStr) {
            throw '请输入全局类型标识';
          }
          const findTypeData = await this.categoryModel.find({ type });
          if (value) {
            const findValue = findTypeData.find((f) => f.value === value);
            if (findValue) {
              throw '全局类型标识重复';
            }
            return { type, value, label };
          } else if (valueStr) {
            const findValueStr = findTypeData.find((f) => f.valueStr === valueStr);
            if (findValueStr) {
              throw '全局类型标识（字符串类型）重复';
            }
            return { type, valueStr, label };
          }
        })
        // 添加
        .then(async (body) => {
          await this.categoryModel.create(body);
          return {
            code: ApiCode.SUCCESS,
            message: '添加成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.log(`新增文章分类失败！ ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '添加失败！',
          };
        })
    );
  }

  /**
   * @description: 某种类型的所有配置
   * @param {string} type
   * @return {Promise<IResponse>}
   */
  public certainTypeAll(type: string): Promise<IResponse> {
    return (
      Promise.resolve(type)
        // 查询
        .then(async (type) => {
          const findArr = await this.findByType(type);
          const result: ApiCategoryItem[] = findArr.map((m) => ({
            categoryId: m.id,
            type: m.type,
            valueStr: m.valueStr,
            value: m.value,
            label: m.label,
          }));
          return {
            code: ApiCode.SUCCESS,
            result,
            message: '查询成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.log(`获取某种类型的所有配置失败！ ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '查询失败！',
          };
        })
    );
  }

  /**
   * @description: 获取某个类型的全部全局类型列表
   * @param {string} type
   * @return {Promise<Category[]>}
   */
  public findByType(type: string): Promise<Category[]> {
    return (
      Promise.resolve(type)
        // 查询
        .then(async (type) => {
          return await this.categoryModel.find({ type }).sort({ value: 1 });
        })
        // 返回错误
        .catch((err) => {
          return err;
        })
    );
  }

  /**
   * @description: 条件并分页获取全局类型列表
   * @param {PageCategoryDto} pageCategoryDto
   * @return {Promise<IResponse>}
   */
  public findPage(pageCategoryDto: PageCategoryDto): Promise<IResponse> {
    return (
      Promise.resolve(pageCategoryDto)
        // 查询
        .then(async (body) => {
          const { size, current, type, label } = body;
          const { limit, skip } = PaginateHandle(size, current);
          const findData: FilterQuery<Category> = {};
          if (type) findData.type = type;
          if (label) findData.label = { $regex: label };
          const total = await this.categoryModel.find(findData).count();
          const findArr = await this.categoryModel.find(findData).limit(limit).skip(skip).sort({ type: 1, value: 1 });
          const list: ApiCategoryItem[] = (findArr || []).map((m) => {
            return {
              categoryId: m.id,
              type: m.type,
              valueStr: m.valueStr,
              value: m.value,
              label: m.label,
            };
          });
          return {
            code: ApiCode.SUCCESS,
            result: { current, list, size, total },
            message: '查询成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`条件并分页获取全局类型列表 失败！${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '查询失败！',
          };
        })
    );
  }

  /**
   * @description: 修改全局类型
   * @param {UpdateCategoryDto} updateCategoryDto
   * @return {Promise<IResponse>}
   */
  public update(updateCategoryDto: UpdateCategoryDto): Promise<IResponse> {
    return (
      Promise.resolve(updateCategoryDto)
        // 修改
        .then(async (body) => {
          const { categoryId, value, type, valueStr } = body;
          const findTypeData = await this.categoryModel.find({ type });
          const filterData = findTypeData.filter((f) => f.id !== categoryId);
          if (value) {
            const findValue = filterData.find((f) => f.value === value);
            if (findValue) {
              throw '全局类型标识重复';
            }
            return body;
          } else if (valueStr) {
            const findValueStr = filterData.find((f) => f.valueStr === valueStr);
            if (findValueStr) {
              throw '全局类型标识（字符串类型）重复';
            }
            return body;
          }
        })
        .then(async (body) => {
          const { categoryId, ...other } = body;
          await this.categoryModel.updateOne({ _id: categoryId }, other);
          return {
            code: ApiCode.SUCCESS,
            message: '修改成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`修改全局类型 失败！${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '修改失败！',
          };
        })
    );
  }

  /**
   * @description: 删除全局类型
   * @param {string} categoryId
   * @return {Promise<IResponse>}
   */
  public remove(categoryId: string): Promise<IResponse> {
    return (
      Promise.resolve(categoryId)
        .then(async (categoryId) => {
          await this.categoryModel.deleteOne({ _id: categoryId });
          return {
            code: ApiCode.SUCCESS,
            message: '删除成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`删除全局类型 失败！${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '删除失败！',
          };
        })
    );
  }

  /**
   * @description: 获取全局类型数据库信息
   * @return {Promise<Category>}
   */
  public findAllToData(): Promise<Category> {
    return (
      Promise.resolve()
        // 分页查询
        .then(async () => {
          const list = await this.categoryModel.find();
          return list;
        })
        // 返回错误
        .catch((err) => {
          return err;
        })
    );
  }
}
