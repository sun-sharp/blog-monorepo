import { paginateDefault } from '../enums/paginate.enum';

/**
 * @description 对分页进行处理
 * @date 26/11/2021
 * @param {*} { size = paginateDefault.SIZE, current = paginateDefault.CURRENT }
 * @return {*}  {*}
 */
export const PaginateHandle = ({ size = paginateDefault.SIZE, current = paginateDefault.CURRENT }): any => {
  const skip = (current - 1) * size;
  return {
    limit: size,
    skip,
  };
};
