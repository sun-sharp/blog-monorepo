import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { nowDateFun } from 'src/common/date';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { existsSyncHandle, readdirHandle, readFileHandle, readFileListHandle, unlinkHandle, unlinkListHandle } from 'src/common/fs-handle';
import { PaginateHandle } from 'src/common/paginate/paginate-handle';
import { IResponse } from 'src/interfaces/response.interface';
import { Image } from 'src/schemas/image.schema';
import { PageImageDto } from './dto/page-image.dto';
import { RemovePublicAllImageDto } from './dto/remove-public-all-image.dto';
import { UploadImageDto } from './dto/upload-image.dto';

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
  uploadImage(image: any, body: UploadImageDto): Promise<IResponse> {
    return (
      Promise.resolve({ image, body })
        // 上传参数是否有问题
        .then(async ({ image, body }) => {
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
            fileName: filename,
            url: path.replace(/\\/g, '/'),
            uploadTime: nowDateFun(),
            source: body.source,
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
              fileName: result.fileName,
              url: result.url,
              uploadTime: result.uploadTime,
              source: result.source,
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
   * @description: 获取图片目录的全部文件
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
   * @description: 查询只有图片文件没有数据的文件
   * @param {*}
   * @return {*}
   */
  getOnlyPublic(): Promise<IResponse> {
    return (
      Promise.resolve()
        // 查询图片目录的全部文件
        .then(async () => {
          return await readdirHandle(basicPublic);
        })
        // 查询全部的图片数据
        .then(async (imagePublic) => {
          const imageData = await this.imageModel.find();
          return { imagePublic, imageData };
        })
        // 获取只有图片文件没有数据的文件
        .then(({ imagePublic, imageData }) => {
          const result = imagePublic.filter((p: { name: string }) => {
            const findIndex = imageData.findIndex((d) => p.name === d.name);
            return findIndex === -1;
          });
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
            result: (result || []).map((m) => {
              return {
                imageId: m._id,
                size: m.size,
                fileName: m.fileName,
                name: m.name,
                imageType: m.imageType,
                url: m.url,
                uploadTime: m.uploadTime,
                source: m.source,
              };
            }),
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
   * @description: 条件并分页获取图片数据列表
   * @param {*}
   * @return {*}
   */
  public findPage(pageImageDto: PageImageDto): Promise<IResponse> {
    return (
      Promise.resolve(pageImageDto)
        // 查询
        .then(async (body) => {
          const { size, current, name } = body;
          const { limit, skip } = PaginateHandle(size, current);
          const findData = { name: { $regex: name } };
          const total = await this.imageModel.find(findData).count();
          const list = await this.imageModel.find(findData).limit(limit).skip(skip);
          return (this.response = {
            code: ApiCode.SUCCESS,
            result: {
              current,
              list: (list || []).map((m) => {
                return {
                  imageId: m._id,
                  size: m.size,
                  fileName: m.fileName,
                  name: m.name,
                  imageType: m.imageType,
                  url: m.url,
                  uploadTime: m.uploadTime,
                  source: m.source,
                  exists: existsSyncHandle(m.url),
                };
              }),
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
   * @description: 删除图片目录下的图片
   * @param {string} fileName
   * @return {*}
   */
  public removePublic(fileName: string): Promise<IResponse> {
    return (
      Promise.resolve(fileName)
        // 读取文件
        .then(async (fileName) => {
          const publicName = `${basicPublic}/${fileName}`;
          await readFileHandle(publicName);
          return publicName;
        })
        // 删除文件
        .then(async (publicName) => {
          await unlinkHandle(publicName);
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
   * @description: 删除图片目录下的图片
   * @param {string} removePublicAllImageDto
   * @return {*}
   */
  public removePublicAll(removePublicAllImageDto: RemovePublicAllImageDto): Promise<IResponse> {
    return (
      Promise.resolve(removePublicAllImageDto)
        // 读取文件
        .then(async ({ fileNameArr }) => {
          await readFileListHandle(fileNameArr);
          return fileNameArr;
        })
        // 删除文件
        .then(async (fileNameArr) => {
          const result = await unlinkListHandle(fileNameArr);
          return (this.response = {
            code: ApiCode.SUCCESS,
            result,
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
   * @description: 删除图片下的数据
   * @param {string} imageId
   * @return {*}
   */
  public removeData(imageId: string): Promise<IResponse> {
    return (
      Promise.resolve(imageId)
        .then(async (imageId) => {
          await this.imageModel.deleteOne({ _id: imageId });
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
   * @description: 删除 图片目录下的图片 和 图片下的数据
   * @param {string} imageId
   * @return {*}
   */
  public removePublicAndData(imageId: string): Promise<IResponse> {
    return (
      Promise.resolve(imageId)
        // 先查找数据
        .then(async (imageId) => {
          const findOne = await this.imageModel.findOne({ _id: imageId });
          if (!findOne)
            throw {
              message: '未找到当前图片数据！',
            };
          return { imageId, fileName: findOne.fileName };
        })
        // 删除文件
        .then(async ({ imageId, fileName }) => {
          const { code, message } = await this.removePublic(fileName);
          if (code === ApiCode.ERROR) {
            throw {
              message,
            };
          }
          return imageId;
        })
        // 删除数据
        .then(async (imageId) => {
          return await this.removeData(imageId);
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
