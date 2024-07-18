import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Schedule } from 'src/schemas/blog/schedule.schema';
import { useCustomConfig } from 'src/config';
import { IResponse } from 'types/common';
import { PageScheduleDto } from './dto/page-schedule.dto';
import { PaginateHandle } from 'src/common/paginate/paginate-handle';
import { ApiScheduleItem } from 'types/blog/schedule';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { logger } from 'src/common/journal';
import { UserService } from 'src/modules/capital/user/user.service';
import { User } from 'src/schemas/capital/user.schema';
const customConfig = useCustomConfig();
const { blogDatabaseName } = customConfig;

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name, blogDatabaseName)
    private readonly scheduleModel: Model<Schedule>,
    private readonly userService: UserService,
  ) {}

  /**
   * @description: 条件并分页获取日程列表
   * @param {User} user
   * @param {PageScheduleDto} body
   * @return {Promise<IResponse>}
   */
  public findPage(user: User, body: PageScheduleDto): Promise<IResponse> {
    return (
      Promise.resolve()
        // 分页查询
        .then(async () => {
          const { size, current, keywords } = body;
          const { _id: userId } = user;
          const { limit, skip } = PaginateHandle(size, current);
          const findData: FilterQuery<Schedule> = { userId };
          if (keywords) findData.$or = [{ title: { $regex: keywords } }];
          const total = await this.scheduleModel.find(findData).count();
          const findArr = await this.scheduleModel.find(findData).sort({ createTime: -1 }).limit(limit).skip(skip).lean();
          const list: ApiScheduleItem[] = findArr.map(({ _id, ...m }) => {
            return {
              ...m,
              scheduleId: _id,
              nickName: user.nickname,
            };
          });
          return {
            code: ApiCode.SUCCESS,
            result: { current, list, size, total },
            message: '查询成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`条件并分页获取不加密文章列表 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '查询失败！',
          };
        })
    );
  }
}
