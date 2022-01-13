import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { IResponse } from 'src/interfaces/response.interface';
import { Menu } from 'src/schemas/menu.schema';
import { CreateMenuDto } from './dto/create-menu.dto';
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
  public save(createMenuDto: CreateMenuDto): Promise<IResponse> {
    return (
      Promise.resolve(createMenuDto)
        // 添加
        .then(async () => {
          return (this.response = {
            code: ApiCode.SUCCESS,
            massage: '添加成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            massage: err.codeName || '添加失败！',
          });
        })
    );
  }

  /**
   * @description: 查询全部系统菜单
   * @param {*}
   * @return {Promise<IResponse>}
   */
  public findAll(): Promise<IResponse> {
    return (
      Promise.resolve()
        // 查询
        .then(async () => {
          const roleList = await this.menuModel.find({ sort: 1 });
          return (this.response = {
            code: ApiCode.SUCCESS,
            result: roleList.map((m) => ({
              id: m._id,
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
            massage: '查询成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            massage: err.codeName || '查询失败！',
          });
        })
    );
  }

  /**
   * @description: 根据权限的permission查找系统菜单详情
   * @param {Array<string>} permission
   * @return {Promise<Menu>}
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

  findOne(id: number) {
    return `This action returns a #${id} menu`;
  }

  /**
   * @description: 修改系统菜单
   * @param {UpdateMenuDto} updateMenuDto
   * @return {Promise<IResponse>}
   */
  update(updateMenuDto: UpdateMenuDto): Promise<IResponse> {
    return (
      Promise.resolve(updateMenuDto)
        // 修改
        .then(async () => {
          return (this.response = {
            code: ApiCode.SUCCESS,
            massage: '修改成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            massage: err.codeName || '修改失败！',
          });
        })
    );
  }

  remove(id: number) {
    return `This action removes a #${id} menu`;
  }
}
