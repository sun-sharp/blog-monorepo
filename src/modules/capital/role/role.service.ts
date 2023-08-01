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
import { readFileDataHandle } from 'src/common/fs-handle';
import { logger } from 'src/common/journal';
import { groupArray } from 'src/common/array';
import { useCustomConfig } from 'src/config';

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
                menuPermission: m.menuPermission,
                apiPermission: m.apiPermission,
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
              menuPermission: m.menuPermission,
              apiPermission: m.apiPermission,
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
            // result: true,
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

  /**
   * @description
   * @return {*}  {Promise<any>}
   * @memberof RoleService
   */
  /**
   * @description: 获取全部swagger-api.json数据
   * @return {*}
   */
  public findSwaggerApi(): Promise<any> {
    return (
      Promise.resolve()
        // 查询
        .then(async () => {
          const customConfig = useCustomConfig();
          const jsonPath = `${customConfig.staticDirPosition}/${customConfig.fileAccessPath}/json/swagger-api.json`;
          const jsonData = await readFileDataHandle(jsonPath);
          return JSON.parse(jsonData.toString()); //将二进制的数据转换为字符串， 将字符串转换为json对象
        })
        // 返回错误
        .catch((err) => {
          return err;
        })
    );
  }

  /**
   * @description 获取全部接口列表的一维数据
   * @return {*}  {Promise<IResponse>}
   * @memberof RoleService
   */
  public findApiAllOneDimensional(): Promise<Array<any>> {
    return (
      Promise.resolve()
        // 查询
        .then(async () => {
          const { paths: swaggerApiPaths = {} } = await this.findSwaggerApi();
          const oneArr = [];
          for (const url in swaggerApiPaths) {
            const methodObj = swaggerApiPaths[url];
            if (methodObj && Object.keys(methodObj).length > 0) {
              for (const method in methodObj) {
                const itemObj = methodObj[method];
                const item: any = { url, method };
                if (itemObj.operationId) {
                  item.operationId = itemObj.operationId;
                  const operationIdSplit = itemObj.operationId.split('_');
                  if (operationIdSplit.length > 0) item.tagId = operationIdSplit[0];
                }
                if (itemObj.summary) item.summary = itemObj.summary;
                let itemParameters = [];
                if (itemObj.parameters && itemObj.parameters.length > 0)
                  itemParameters = itemParameters.concat(
                    itemObj.parameters
                      .map((m: any) => m.in)
                      .filter((f: string, index: number, arr: any) => {
                        return arr.indexOf(f, 0) === index;
                      }),
                  );
                if (itemObj.requestBody) itemParameters.push('body');
                if (itemParameters.length > 0) item.parameterTransferMode = itemParameters;
                if (itemObj.tags && itemObj.tags.length > 0) item.tagName = itemObj.tags[0] || '';
                if (itemObj.security && itemObj.security.length > 0 && !!('jwt' in itemObj.security[0])) item.jwt = true;
                oneArr.push(item);
              }
            }
          }

          return oneArr;
        })
        // 返回错误
        .catch((err) => {
          logger.error(`获取全部接口列表的一维数据`, err);
          return [];
        })
    );
  }

  /**
   * @description 获取需要jwt验证的接口一维列表
   * @return {*}  {Promise<IResponse>}
   * @memberof RoleService
   */
  public findApiJwtAll(): Promise<Array<any>> {
    return (
      Promise.resolve()
        // 查询
        .then(async () => {
          const oneArr = await this.findApiAllOneDimensional();
          return oneArr.filter((f) => f.jwt);
        })
        // 返回错误
        .catch((err) => {
          logger.error(`查询需要jwt验证的接口列表失败`, err);
          return [];
        })
    );
  }

  /**
   * @description: jwt权限接口认证
   * @param {string} roleCode
   * @return {*}
   */
  public validateRoleByRoleCode(roleCode: string, url: string, method: string): Promise<boolean> {
    return (
      Promise.resolve(roleCode)
        // 查询
        .then(async (roleCode) => {
          if (!roleCode) return false;
          const roleFind = await this.findOneByRoleCode(roleCode);
          const apiPermission = roleFind.apiPermission;
          const apiJwtAll = await this.findApiJwtAll();
          const filterArr = apiJwtAll.filter((f) => apiPermission.includes(f.operationId));
          const urlFind = filterArr.find((f) => {
            if (f.url.includes(['{']) && f.url.includes(['}'])) {
              return f.url.replace('{', '').replace('}', '') === url.replace(':', '') && f.method === method;
            } else {
              return f.url === url && f.method === method;
            }
          });
          return !!urlFind;
        })
        // 返回错误
        .catch((err) => {
          logger.error(`查询需要jwt验证的接口列表失败`, err);
          return false;
        })
    );
  }

  /**
   * @description 获取全部接口列表并关联
   * @return {*}  {Promise<IResponse>}
   * @memberof RoleService
   */
  public findApiAll(): Promise<IResponse> {
    return (
      Promise.resolve()
        // 查询
        .then(async () => {
          const oneArr = await this.findApiAllOneDimensional();
          const result = groupArray(oneArr, 'children', ['tagId', 'tagName']);
          return (this.response = {
            code: ApiCode.SUCCESS,
            result,
            message: '查询成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          logger.error(`返回错误`, err);
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.message || '查询失败！',
          });
        })
    );
  }
}
