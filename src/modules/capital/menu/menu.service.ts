import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { Menu } from 'src/schemas/capital/menu.schema';
import { CreateMenuDto } from './dto/create-menu.dto';
import { menuFindAllDto } from './dto/menu-find-all-dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ApiMenuItem } from 'types/capital/menu';
import { IResponse } from 'types/common';
import { useCustomConfig } from 'src/config';

const customConfig = useCustomConfig();
const { capitalDatabaseName } = customConfig;

@Injectable()
export class MenuService {
  constructor(@InjectModel(Menu.name, capitalDatabaseName) private readonly menuModel: Model<Menu>) {}

  /**
   * @description: 新增系统菜单
   * @param {CreateMenuDto} createMenuDto
   * @return {Promise<IResponse>}
   */
  public save(createMenuDto: CreateMenuDto): Promise<IResponse> {
    return (
      Promise.resolve(createMenuDto)
        // 添加
        .then(async (body) => {
          await this.menuModel.create({
            ...body,
          });
          return {
            code: ApiCode.SUCCESS,
            message: '添加成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          return {
            code: ApiCode.ERROR,
            message: err.message || '添加失败！',
          };
        })
    );
  }

  /**
   * @description: 查询全部系统菜单
   * @param {menuFindAllDto} query
   * @return {Promise<IResponse>}
   */
  public findAll(query?: menuFindAllDto): Promise<IResponse> {
    return (
      Promise.resolve(query)
        // 查询
        .then(async (query) => {
          const findData = query ? { name: { $regex: query.name || '' } } : {};
          const menuList = await this.menuModel.find(findData).sort({ sort: 1 });
          const result: ApiMenuItem[] = menuList.map((m) => ({
            menuId: m.id,
            name: m.name,
            title: m.title,
            parentId: m.parentId,
            menuType: m.menuType,
            hidden: m.hidden,
            component: m.component,
            sort: m.sort,
            icon: m.icon,
            iframeSrc: m.iframeSrc,
            externalLink: m.externalLink,
            noKeepAlive: m.noKeepAlive,
          }));
          return {
            code: ApiCode.SUCCESS,
            result,
            message: '查询成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          return {
            code: ApiCode.ERROR,
            message: err.message || '查询失败！',
          };
        })
    );
  }

  /**
   * @description: 根据权限的menuPermission查找系统菜单详情
   * @param {Array<string>} menuPermission
   * @return {Promise<Array<Menu>>}
   */
  public findByMenuPermission(menuPermission: Array<string>): Promise<Array<Menu>> {
    return (
      Promise.resolve(menuPermission)
        .then(async (menuPermission) => {
          const findAll = await this.menuModel.find();
          const findNameArr = [];
          const menuFindById = (parentId: string) => {
            const arr = [];
            const findById = findAll.find((c) => String(c._id) === parentId);
            if (findById && findById.parentId) {
              if (findById.parentId === '0') {
                arr.push(findById.name);
              } else {
                arr.push(...menuFindById(findById.parentId));
              }
            }
            return arr;
          };
          findAll.forEach((f) => {
            if (menuPermission.includes(f.name)) {
              findNameArr.push(f.name);
              if (f.parentId !== '0') {
                findNameArr.push(...menuFindById(f.parentId));
              }
            }
          });
          return await this.menuModel.find({ name: { $in: findNameArr } }).sort({ sort: 1 });
        })
        // 返回错误
        .catch((err) => {
          return err;
        })
    );
  }

  /**
   * @description: 修改系统菜单
   * @param {UpdateMenuDto} body
   * @return {Promise<IResponse>}
   */
  update(body: UpdateMenuDto): Promise<IResponse> {
    return (
      Promise.resolve(body)
        // 修改
        .then(async (body) => {
          const { menuId, ...other } = body;
          await this.menuModel.updateOne({ _id: menuId }, other);
          return {
            code: ApiCode.SUCCESS,
            message: '修改成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          return {
            code: ApiCode.ERROR,
            message: err.message || '修改失败！',
          };
        })
    );
  }

  remove(menuId: string) {
    return (
      Promise.resolve(menuId)
        // 查询当前以下有菜单
        .then(async (menuId) => {
          const findResult = await this.menuModel.findOne({ parentId: menuId });
          if (findResult)
            throw {
              message: '请先删除当前下面的菜单',
            };
          return menuId;
        })
        // 删除
        .then(async (menuId) => {
          await this.menuModel.deleteOne({ _id: menuId });
          return {
            code: ApiCode.SUCCESS,
            message: '删除成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          return {
            code: ApiCode.ERROR,
            message: err.message || '删除失败！',
          };
        })
    );
  }
}
