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
 * @description: 尿酸血糖测量记录的保存数据
 */
export type ApiUricSaveData = MakeOptional<ApiUric, 'uricAcid' | 'bloodGlucose'>;


/**
 * @description: 尿酸血糖测量记录的修改数据
 */
export type ApiUricUpdateData = ApiUricSaveData & ApiUricId;
