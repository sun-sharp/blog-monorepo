/**
 * @description: 请求结果集
 */
export const RESULT_ENUM = {
  SUCCESS: 0,
  ERROR: -1,
  TIMEOUT: 10042,
  TYPE: 'success',
};

/**
 * @description: 请求方法
 */
export const REQUEST_ENUM = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

/**
 * @description:  常用的contentTyp类型
 */
export const CONTENT_TYPE_ENUM = {
  // json
  JSON: 'application/json;charset=UTF-8',
  // json
  TEXT: 'text/plain;charset=UTF-8',
  // form-data 一般配合qs
  FORM_URLENCODED: 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  上传
  FORM_DATA: 'multipart/form-data;charset=UTF-8',
};
