import { ApiCode } from '../enums/api-code.enum';

/**
 * @description 状态码的变化
 * @date 26/11/2021
 * @param {(number)} status
 * @return {*}  {number}
 */
export const checkCode = (status: number): number => {
  let code = null;
  switch (status) {
    case 200:
      code = ApiCode.SUCCESS;
      break;
    case 408:
    case 504:
      code = ApiCode.TIMEOUT;
      break;
  }
  return code === null ? status : code;
};
