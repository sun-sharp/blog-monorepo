import { blogRequest } from '../../../utils/request';
import type { ApiAggregateBillFindPageData, ApiAggregateBillDetail, ApiAggregateBillUpdateData } from '/#/api/blog/money/aggregate';
import type { TablePaginationResult } from '/#/components/table';

const basic = '/money';

export const findAggregatePage = (data: ApiAggregateBillFindPageData): Promise<TablePaginationResult<ApiAggregateBillDetail[]>> => {
  return blogRequest({ url: `${basic}/find_aggregate_page`, method: 'POST', data });
};

export const findAggregateOne = (source: string, billId: string): Promise<ApiAggregateBillDetail> => {
  return blogRequest({ url: `${basic}/find_aggregate_one/${source}/${billId}`, method: 'GET' });
};

export const updateAggregate = (data: ApiAggregateBillUpdateData): Promise<undefined> => {
  return blogRequest({ url: `${basic}/update_aggregate`, method: 'PUT', data, isShowSuccessMessage: true });
};
