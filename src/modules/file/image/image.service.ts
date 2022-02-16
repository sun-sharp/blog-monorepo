import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { nowDateFun } from 'src/common/date';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { readdirHandle } from 'src/common/fs-handle';
import { IResponse } from 'src/interfaces/response.interface';
import { Image } from 'src/schemas/image.schema';

const basicPublic = 'public/files/image';

@Injectable()
export class ImageService {
  response: IResponse;
  constructor(@InjectModel('Image') private readonly imageModel: Model<Image>) {}

  /**
   * @description: 单图片上传
   * @param {any} image
   * @return {*}
   */
  uploadImage(image: any): Promise<IResponse> {
    return (
      Promise.resolve(image)
        // 上传参数是否有问题
        .then(async (image) => {
          const { filename, size, path } = image;
          const name = filename.split('.')[0];
          if (!name)
            throw {
              message: '图片名称出错！',
            };
          const imageType = filename.split('.')[1];
          if (!imageType)
            throw {
              message: '图片类型出错！',
            };
          return {
            size,
            name,
            imageType,
            src: path.replace(/\\/g, '/'),
            createTime: nowDateFun(),
          };
        })
        .then(async (body) => {
          const result = await this.imageModel.create(body);
          if (!result)
            throw {
              message: '图片类型出错！',
            };
          return (this.response = {
            code: ApiCode.SUCCESS,
            result: {
              imageId: result._id,
              size: result.size,
              name: result.name,
              imageType: result.imageType,
              src: result.src,
              createTime: result.createTime,
            },
            message: '上传成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.message || '上传失败！',
          });
        })
    );
  }

  /**
   * @description: 获取图片目录
   * @param {*}
   * @return {*}
   */
  getPublic(): Promise<IResponse> {
    return (
      Promise.resolve()
        .then(async () => {
          const result = await readdirHandle(basicPublic);
          return (this.response = {
            code: ApiCode.SUCCESS,
            result,
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
   * @description: 获取图片全部列表数据
   * @param {*}
   * @return {*}
   */
  findAll(): Promise<IResponse> {
    return (
      Promise.resolve()
        .then(async () => {
          const result = await this.imageModel.find();
          return (this.response = {
            code: ApiCode.SUCCESS,
            result: (result || []).map((m) => ({
              imageId: m._id,
              size: m.size,
              name: m.name,
              imageType: m.imageType,
              src: m.src,
              createTime: m.createTime,
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
}
