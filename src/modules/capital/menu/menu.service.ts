import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { IResponse } from 'src/interfaces/response.interface';
import { Menu } from 'src/schemas/menu.schema';
import { CreateMenuDto } from './dto/create-menu.dto';
import { menuFindAllDto } from './dto/menu-find-all-dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  response: IResponse;
  constructor(@InjectModel('Menu') private readonly menuModel: Model<Menu>) {}

  /**
   * @description: 新增系统菜单
   * @param {CreateMenuDto} createMenuDto
   * @return {Promise<IResponse>}
   */
  public save(body: CreateMenuDto): Promise<IResponse> {
    return (
      Promise.resolve(body)
        // 添加
        .then(async (body) => {
          await this.menuModel.create({
            ...body,
          });
          return (this.response = {
            code: ApiCode.SUCCESS,
            message: '添加成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.codeName || '添加失败！',
          });
        })
    );
  }

  /**
   * @description: 查询全部系统菜单
   * @param {*}
   * @return {Promise<IResponse>}
   */
  public findAll(query?: menuFindAllDto): Promise<IResponse> {
    return (
      Promise.resolve(query)
        // 查询
        .then(async (query) => {
          const findData = query ? { name: { $regex: query.name || '' } } : {};
          const menuList = await this.menuModel.find(findData).sort({ sort: 1 });
          return (this.response = {
            code: ApiCode.SUCCESS,
            result: menuList.map((m) => ({
              menuId: m._id,
              name: m.name,
              title: m.title,
              path: m.path,
              sort: m.sort,
              icon: m.icon,
              parentId: m.parentId,
              iframeSrc: m.iframeSrc,
              component: m.component,
              menuType: m.menuType,
              hidden: m.hidden,
            })),
            message: '查询成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.codeName || '查询失败！',
          });
        })
    );
  }

  /**
   * @description: 根据权限的permission查找系统菜单详情
   * @param {Array<string>} permission
   * @return {Promise<Array<Menu>>}
   */
  public findByPermission(permission: Array<string>): Promise<Array<Menu>> {
    return (
      Promise.resolve(permission)
        .then(async (permission) => {
          return await this.menuModel.find({ name: { $in: permission } }).sort({ sort: 1 });
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
          return (this.response = {
            code: ApiCode.SUCCESS,
            message: '修改成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.codeName || '修改失败！',
          });
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
          return (this.response = {
            code: ApiCode.SUCCESS,
            message: '删除成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.message || '删除失败！',
          });
        })
    );
  }
}
