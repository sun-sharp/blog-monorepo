import { ResultEnum, RequestEnum, ContentTypeEnum } from '@shared/constants/http-enum';

export const RESULT_ENUM = {
  SUCCESS: ResultEnum.SUCCESS as number,
  ERROR: ResultEnum.ERROR as number,
  TIMEOUT: ResultEnum.TIMEOUT as number,
  TYPE: ResultEnum.TYPE,
};

export const REQUEST_ENUM = {
  GET: RequestEnum.GET,
  POST: RequestEnum.POST,
  PATCH: RequestEnum.PATCH,
  PUT: RequestEnum.PUT,
  DELETE: RequestEnum.DELETE,
};

export const CONTENT_TYPE_ENUM = {
  JSON: ContentTypeEnum.JSON,
  TEXT: ContentTypeEnum.TEXT,
  FORM_URLENCODED: ContentTypeEnum.FORM_URLENCODED,
  FORM_DATA: ContentTypeEnum.FORM_DATA,
};
