import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Schedule } from 'src/schemas/blog/schedule.schema';
import { useCustomConfig } from 'src/config';
import { IResponse } from 'types/common';
import { PageScheduleDto } from './dto/page-schedule.dto';
import { PaginateHandle } from 'src/common/paginate/paginate-handle';
import { ApiSchedule, ApiScheduleItem } from 'types/blog/schedule';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { logger } from 'src/common/journal';
import { User } from 'src/schemas/capital/user.schema';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { nowDateFun } from 'src/common/date';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { StatisticsStartEndTimeDto } from 'src/common/dto/statistics-start-end-time.dto';
import { format } from 'date-fns';
const customConfig = useCustomConfig();
const { blogDatabaseName } = customConfig;

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name, blogDatabaseName)
    private readonly scheduleModel: Model<Schedule>,
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
          logger.error(`条件并分页获取日程列表 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '查询失败！',
          };
        })
    );
  }

  /**
   * @description: 新增日程
   * @param {User} user
   * @param {CreateScheduleDto} body
   * @return {Promise<IResponse>}
   */
  public save(user: User, body: CreateScheduleDto): Promise<IResponse> {
    return (
      Promise.resolve({ user, body })
        // 添加
        .then(async ({ user, body }) => {
          const params: ApiSchedule = {
            title: body.title,
            content: body.content,
            startDate: body.startDate,
            endDate: body.endDate,
            startTime: body.startTime,
            endTime: body.endTime,
            createTime: nowDateFun(),
            userId: user._id,
          };
          await this.scheduleModel.create(params);
          return {
            code: ApiCode.SUCCESS,
            message: '添加成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`新增日程 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '添加失败！',
          };
        })
    );
  }

  /**
   * @description: 修改日程
   * @param {UpdateScheduleDto} body
   * @return {Promise<IResponse>}
   */
  public update(body: UpdateScheduleDto): Promise<IResponse> {
    return (
      Promise.resolve(body)
        // 修改
        .then(async (body) => {
          const params = {
            title: body.title,
            content: body.content,
            startDate: body.startDate,
            endDate: body.endDate,
            startTime: body.startTime,
            endTime: body.endTime,
          };
          await this.scheduleModel.updateOne({ _id: body.scheduleId }, params);
          return {
            code: ApiCode.SUCCESS,
            message: '修改成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`修改日程 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '修改失败！',
          };
        })
    );
  }

  /**
   * @description: 删除文章
   * @return {Promise<IResponse>}
   */
  public remove(id: string): Promise<IResponse> {
    return (
      Promise.resolve(id)
        .then(async (id) => {
          await this.scheduleModel.deleteOne({ _id: id });
          return {
            code: ApiCode.SUCCESS,
            message: '删除成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`删除文章 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '删除失败！',
          };
        })
    );
  }

  /**
   * @description: 每日的日程
   * @param {string} userId
   * @param {StatisticsStartEndTimeDto} query
   * @return {Promise<IResponse>}
   */
  public daily(userId: string, query: StatisticsStartEndTimeDto): Promise<IResponse> {
    return (
      Promise.resolve()
        .then(async () => {
          const findData: FilterQuery<Schedule> = { userId };
          const { startTime, endTime } = query;
          if (startTime && endTime) {
            findData.startDate = { $gte: startTime, $lte: endTime };
            findData.endDate = { $gte: startTime, $lte: endTime };
          }
          const list = await this.scheduleModel.find(findData).lean();
          const startTimeAll = new Date(startTime);
          const endTimeAll = new Date(endTime);
          const differ = endTimeAll.getTime() - startTimeAll.getTime();
          const oneDay = 1000 * 60 * 60 * 24;
          const day = parseInt(String(differ / oneDay)) + 1;
          const result = [];
          for (let i = 0; i < day; i++) {
            const time = startTimeAll.getTime() + oneDay * i;
            const filter = list.filter((f) => {
              const stD = new Date(f.startDate);
              const enD = new Date(f.endDate);
              return time >= stD.getTime() && time <= enD.getTime();
            });
            result.push({
              time: format(time, 'yyyy-MM-dd'),
              children: filter,
            });
          }
          return {
            code: ApiCode.SUCCESS,
            result,
            message: '删除成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`删除文章 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '删除失败！',
          };
        })
    );
  }
}
