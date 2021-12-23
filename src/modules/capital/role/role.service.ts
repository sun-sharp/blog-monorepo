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
   * @description 获取全部权限列表
   * @return {*}  {Promise<IResponse>}
   * @memberof RoleService
   */
  public findAll(): Promise<IResponse> {
    return (
      Promise.resolve()
        // 分页查询
        .then(async () => {
          const roleList = await this.roleModel.find();
          return (this.response = {
            code: ApiCode.SUCCESS,
            result: roleList.map((m) => ({
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
            massage: err.codeName || '查询报错！',
          });
        })
    );
  }
}
