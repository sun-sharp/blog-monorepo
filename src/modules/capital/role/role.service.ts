import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { IResponse } from 'src/interfaces/response.interface';
import { Role } from 'src/schemas/role.schema';

@Injectable()
export class RoleService {
  response: IResponse;
  constructor(@InjectModel('Role') private readonly roleModel: Model<Role>) {}

  /**
   * @description 条件并分页获取权限列表
   * @return {*}  {Promise<IResponse>}
   * @memberof RoleService
   */
  public getRolePage(): Promise<IResponse> {
    return (
      Promise.resolve()
        // 查询
        .then(async () => {
          return (this.response = {
            code: ApiCode.SUCCESS,
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
   * @description 获取全部权限列表
   * @return {*}  {Promise<IResponse>}
   * @memberof RoleService
   */
  public findAll(): Promise<IResponse> {
    return (
      Promise.resolve()
        // 查询
        .then(async () => {
          const result = await this.roleModel.find().sort({ sort: 1 });
          return (this.response = {
            code: ApiCode.SUCCESS,
            result: result.map((m) => ({
              id: m._id,
              name: m.name,
              roleCode: m.roleCode,
              roleType: m.roleType,
              permission: m.permission,
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
   * @description 修改权限列表
   * @return {*}  {Promise<IResponse>}
   * @memberof RoleService
   */
  public update(): Promise<IResponse> {
    return (
      Promise.resolve()
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

  /**
   * @description 新增权限
   * @return {*}  {Promise<IResponse>}
   * @memberof RoleService
   */
  public save(): Promise<IResponse> {
    return (
      Promise.resolve()
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
   * @description 删除权限
   * @return {*}  {Promise<IResponse>}
   * @memberof RoleService
   */
  public remove(): Promise<IResponse> {
    return (
      Promise.resolve()
        // 删除
        .then(async () => {
          return (this.response = {
            code: ApiCode.SUCCESS,
            massage: '删除成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            massage: err.codeName || '删除失败！',
          });
        })
    );
  }

  /**
   * @description: 根据roleCode查找权限详情
   * @param {string} roleCode
   * @return {*}  {Promise<IResponse>}
   */
  public findOneByRoleCode(roleCode: string): Promise<Role> {
    return (
      Promise.resolve(roleCode)
        .then(async (roleCode) => {
          return await this.roleModel.findOne({ roleCode }, { _id: 0 });
        })
        // 返回错误
        .catch((err) => {
          return err;
        })
    );
  }
}
