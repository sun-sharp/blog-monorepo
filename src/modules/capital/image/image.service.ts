import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { nowDateFun } from 'src/common/date';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { existsSyncHandle, readdirOfImageHandle, readFileHandle, readFileListHandle, unlinkHandle, unlinkListHandle } from 'src/common/fs-handle';
import { logger } from 'src/common/journal';
import { PaginateHandle } from 'src/common/paginate/paginate-handle';
import { IResponse } from 'src/interfaces/response.interface';
import { UserService } from 'src/modules/capital/user/user.service';
import { Image } from 'src/schemas/capital/image.schema';
import { PageImageDto } from './dto/page-image.dto';
import { RemoveDataAllImageDto, RemovePublicAllImageDto, RemovePublicAndDataAllImageDto } from './dto/remove-all-image.dto';
import { ImageFindPageParams, UploadedImage } from 'types/capital/image';
import { ArticleService } from 'src/modules/blog/article/article.service';
import { useCustomConfig } from 'src/config';

const customConfig = useCustomConfig();
const imageReadDir = `${customConfig.fileAccessPath}/image`;
const imageFsDir = `${customConfig.staticDirPosition}${customConfig.staticDirName}/image/`;

@Injectable()
export class ImageService {
  response: IResponse;
  constructor(
    @InjectModel('Image') private readonly imageModel: Model<Image>,
    private readonly userService: UserService,
    private readonly articleService: ArticleService,
  ) {}

  /**
   * @description: 单图片上传
   * @param {UploadedImage} image
   * @return {Promise<IResponse>}
   */
  uploadImage(image: UploadedImage, source: string | string[]): Promise<IResponse> {
    return (
      Promise.resolve({ image, source })
        // 上传参数是否有问题
        .then(async ({ image, source }) => {
          const { filename, size } = image;
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
            url: `${imageReadDir}/${filename}`,
            uploadTime: nowDateFun(),
            source: source,
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
   * @return {Promise<IResponse>}
   */
  getPublic(): Promise<IResponse> {
    return (
      Promise.resolve()
        .then(async () => {
          const result = await readdirOfImageHandle(imageFsDir);
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
   * @return {Promise<IResponse>}
   */
  getOnlyPublic(): Promise<IResponse> {
    return (
      Promise.resolve()
        // 查询图片目录的全部文件
        .then(async () => {
          return await readdirOfImageHandle(imageFsDir);
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
   * @description: 查询未使用的图片
   * @return {Promise<IResponse>}
   */
  getOntUse(): Promise<IResponse> {
    return (
      Promise.resolve()
        // 查询全部的图片数据
        .then(async () => {
          const imageData = await this.imageModel.find();
          return { imageData };
        })
        // 获取只有图片文件没有数据的文件
        .then(async ({ imageData }) => {
          const result = [];
          for (let i = 0; i < imageData.length; i++) {
            const f = imageData[i];
            const [lib] = f.source.split('_');
            let useStatus = false;
            // 是否用户
            if (lib === 'user') {
              const userFindOne = await this.userService.findOneByAvatar(f.url);
              useStatus = !userFindOne;
            }
            // 是否文章
            if (lib === 'article') {
              const userFindOne = await this.articleService.findOneByImage(f.url);
              useStatus = !userFindOne;
            }
            if (useStatus) result.push(f);
          }
          logger.log(`获取只有图片文件没有数据的文件`, result);
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
   * @description: 获取图片全部列表数据
   * @return {Promise<IResponse>}
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
   * @param {PageImageDto} pageImageDto
   * @return {Promise<IResponse>}
   */
  public findPage(pageImageDto: PageImageDto): Promise<IResponse> {
    return (
      Promise.resolve(pageImageDto)
        // 查询
        .then(async (body) => {
          const { size, current, name, source } = body;
          const { limit, skip } = PaginateHandle(size, current);
          const findData: ImageFindPageParams = { name: { $regex: name } };
          if (source) findData.source = source;
          const total = await this.imageModel.find(findData).count();
          const list = await this.imageModel.find(findData).limit(limit).skip(skip).sort({ uploadTime: -1 });
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
   * @return {Promise<IResponse>}
   */
  public removePublic(fileName: string): Promise<IResponse> {
    return (
      Promise.resolve(fileName)
        // 读取文件
        .then(async (fileName) => {
          const publicName = `${imageFsDir}/${fileName}`;
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
   * @description: 批量删除图片目录下的图片
   * @param {RemovePublicAllImageDto} removePublicAllImageDto
   * @return {Promise<IResponse>}
   */
  public removePublicAll(removePublicAllImageDto: RemovePublicAllImageDto): Promise<IResponse> {
    return (
      Promise.resolve(removePublicAllImageDto)
        // 读取文件
        .then(async ({ fileNameArr }) => {
          await readFileListHandle(`${customConfig.staticDirPosition}${customConfig.staticDirName}/image`, fileNameArr);
          return fileNameArr;
        })
        // 删除文件
        .then(async (fileNameArr) => {
          const result = await unlinkListHandle(`${customConfig.staticDirPosition}${customConfig.staticDirName}/image`, fileNameArr);
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
   * @return {Promise<IResponse>}
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
   * @description: 批量删除图片下的数据
   * @param {RemoveDataAllImageDto} removeDataAllImageDto
   * @return {Promise<IResponse>}
   */
  public removeDataAll(removeDataAllImageDto: RemoveDataAllImageDto): Promise<IResponse> {
    return (
      Promise.resolve(removeDataAllImageDto)
        .then(async ({ imageIdArr }) => {
          await this.imageModel.deleteMany({ _id: { $in: imageIdArr } });
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
   * @return {Promise<IResponse>}
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

  /**
   * @description: 批量删除 图片目录下的图片 和 图片下的数据
   * @param {RemovePublicAndDataAllImageDto} removePublicAndDataAllImageDto
   * @return {Promise<IResponse>}
   */
  public removePublicAndDataAll(removePublicAndDataAllImageDto: RemovePublicAndDataAllImageDto): Promise<IResponse> {
    return (
      Promise.resolve(removePublicAndDataAllImageDto)
        // 先查找数据
        .then(async ({ imageIdArr }) => {
          const find = await this.imageModel.find({ _id: { $in: imageIdArr } });
          if (find.length <= 0)
            throw {
              message: '未找到当前图片数据！',
            };
          return { imageIdArr, fileNameArr: find.map((m) => m.fileName) };
        })
        // 删除文件
        .then(async ({ imageIdArr, fileNameArr }) => {
          const { code, message } = await this.removePublicAll({ fileNameArr });
          if (code === ApiCode.ERROR) {
            throw {
              message,
            };
          }
          return imageIdArr;
        })
        // 删除数据
        .then(async (imageIdArr) => {
          return await this.removeDataAll({ imageIdArr });
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
