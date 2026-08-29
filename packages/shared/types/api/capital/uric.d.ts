import { ApiPaginateParams, MakeOptional } from '../common';

/**
 * @description: 尿酸血糖测量记录的id
 */
export interface ApiUricId {
    uricId: string;
}

/**
 * @description: 尿酸血糖测量记录的字段
 */
export interface ApiUric {
    // 测量时间
    measureTime: string;

    // 尿酸测量值
    uricAcid: number;

    // 血糖测量值
    bloodGlucose: number;

    // 测量方式
    measureType: string;

    // 血糖检测时段(1凌晨/2空腹/3早餐后/4午餐前/5午餐后/6晚餐前/7晚餐后/8睡前/101随机)
    bloodSugarPeriod: number;

    // 创建的用户id
    userId: string;
}

/**
 * @description: 尿酸血糖测量记录的列表
 */
export type ApiUricItem = ApiUric & ApiUricId

/**
 * @description: 尿酸血糖测量记录的查询
 */
export type ApiUricSearchParams = {
    measureType?: string;
};


/**
 * @description: 尿酸血糖测量记录的分页查询
 */
export type ApiUricFindPageData = ApiPaginateParams & ApiUricSearchParams;


/**
 * @description: 尿酸血糖测量记录的保存数据(不含 userId，由后端写入)
 */
export type ApiUricSaveData = MakeOptional<
  Omit<ApiUric, 'userId'>,
  'uricAcid' | 'bloodGlucose' | 'bloodSugarPeriod'
>;

/**
 * @description: 尿酸血糖测量记录的修改数据
 */
export type ApiUricUpdateData = ApiUricSaveData & ApiUricId;
