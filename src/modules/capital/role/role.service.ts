import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { PaginateHandle } from 'src/common/paginate/paginate-handle';
import { IResponse } from 'src/interfaces/response.interface';
import { Role } from 'src/schemas/capital/role.schema';
import { CreateRoleDto } from './dto/create-role.dto';
import { PageRoleDto } from './dto/page-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  response: IResponse;
  constructor(@InjectModel('Role') private readonly roleModel: Model<Role>) {}

  /**
   * @description: 条件并分页获取权限列表
   * @param {PageRoleDto} pageRoleDto
   * @return {Promise<IResponse>}
   */
  public getRolePage(pageRoleDto: PageRoleDto): Promise<IResponse> {
    return (
      Promise.resolve(pageRoleDto)
        // 查询
        .then(async (body) => {
          const { size, current, name, roleCode } = body;
          const { limit, skip } = PaginateHandle(size, current);
          const findData = { name: { $regex: name }, roleCode: { $regex: roleCode } };
          const total = await this.roleModel.find(findData).count();
          const list = await this.roleModel.find(findData).limit(limit).skip(skip);
          return (this.response = {
            code: ApiCode.SUCCESS,
            result: {
              current,
              list: list.map((m) => ({
                roleId: m._id,
                name: m.name,
                roleCode: m.roleCode,
                roleType: m.roleType,
                permission: m.permission,
              })),
              size,
              total,
            },
            message: '查询成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.message || '查询失败！',
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
              roleId: m._id,
              name: m.name,
              roleCode: m.roleCode,
              roleType: m.roleType,
              permission: m.permission,
            })),
            message: '查询成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.message || '查询失败！',
          });
        })
    );
  }

  /**
   * @description: 修改权限列表
   * @param {UpdateRoleDto} body
   * @return {Promise<IResponse>}
   */
  public update(body: UpdateRoleDto): Promise<IResponse> {
    return (
      Promise.resolve(body)
        // 修改
        .then(async (body) => {
          const { roleId, ...other } = body;
          await this.roleModel.updateOne({ _id: roleId }, other);
          return (this.response = {
            code: ApiCode.SUCCESS,
            message: '修改成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.message || '修改失败！',
          });
        })
    );
  }

  /**
   * @description 新增权限
   * @return {*}  {Promise<IResponse>}
   * @memberof RoleService
   */
  public save(createRoleDto: CreateRoleDto): Promise<IResponse> {
    return (
      Promise.resolve(createRoleDto)
        // 添加
        .then(async (body) => {
          await this.roleModel.create({
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
            message: err.message || '添加失败！',
          });
        })
    );
  }

  /**
   * @description: 删除权限
   * @param {string} roleId
   * @return {Promise<IResponse>}
   */
  public remove(roleId: string): Promise<IResponse> {
    return (
      Promise.resolve(roleId)
        // 删除
        .then(async (roleId) => {
          await this.roleModel.deleteOne({ _id: roleId });
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
