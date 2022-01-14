import { paginateDefault } from '../enums/paginate.enum';

interface PaginateType {
  limit: number;
  skip: number;
}

/**
 * @description: 对分页进行处理
 * @param {*} size
 * @param {*} current
 * @return {*}
 */
export const PaginateHandle = (size: number = paginateDefault.SIZE, current: number = paginateDefault.CURRENT): PaginateType => {
  const skip = (current - 1) * size;
  return {
    limit: size,
    skip,
  };
};
