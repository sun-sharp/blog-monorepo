export const componentTable = {
  apiSetting: {
    // 当前页的字段名
    pageField: 'current',
    // 每页数量字段名
    sizeField: 'size',
    // 接口返回的数据字段名
    listField: 'list',
    // 接口返回总页数字段名
    pageCountField: 'pageCount',
    // 接口返回总条数字段名
    totalField: 'total',
  },
  //默认分页数量
  defaultPageSize: 10,
  //可切换每页数量集合
  pageSizes: [10, 20, 30, 40, 50],
};

const { apiSetting, defaultPageSize, pageSizes } = componentTable;

export const DEFAULT_PAGESIZE = defaultPageSize;

export const API_SETTING = apiSetting;

export const PAGE_SIZES = pageSizes;

export const componentUpload = {
  //考虑接口规范不同
  apiSetting: {
    // 集合字段名
    infoField: 'result',
    // 图片地址字段名
    imgField: 'url',
  },
  //最大上传图片大小
  maxSize: 2,
  //图片上传类型
  fileType: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/svg+xml'],
};
