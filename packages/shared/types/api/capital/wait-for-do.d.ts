/**
 * @description: 待办的id
 */
export interface ApiWaitForDoId {
  // 待办id
  waitForDoId: string;
}

/**
 * @description: 待办的数据字段
 */
export interface ApiWaitForDo {
  // 标题
  title: string;
  // 分类
  classify: number;
  // 截止时间
  deadline?: string;
  // 备注
  remark: string;
  // 状态
  state: number;
  // 排序
  sort: number;
  // 是否删除
  isRemove: boolean;
  // 用户id
  userId: string;
  // 完成时间
  completionTime?: string;
}

/**
 * @description: 待办的列表每项
 */
export interface ApiWaitForDoItem extends ApiWaitForDo, ApiWaitForDoId {}

/**
 * @description: 保存待办参数
 */
export interface ApiWaitForDoSaveData {
  // 标题
  title: string;
  // 分类
  classify: number;
  // 截止时间
  deadline: string;
  // 状态
  state: number;
}

/**
 * @description: 修改待办的状态参数
 */
export interface ApiWaitForDoUpdateStateData {
  // 状态
  state: number;
  // 完成时间
  completionTime?: Date;
  // 取消完成时间
  $unset?: { completionTime: '' };
}

/**
 * @description: 修改待办的状态参数
 */
export interface ApiWaitForDoUpdateStateHasIdData extends ApiWaitForDoId, ApiWaitForDoUpdateStateData {}

/**
 * @description: 修改待办的排序参数
 */
export type ApiWaitForDoUpdateSortData = ApiWaitForDoId;

/**
 * @description: 修改待办的名称，备注，截止时间参数
 */
export interface ApiWaitForDoUpdateData extends ApiWaitForDoId {
  // 标题
  title?: string;
  // 截止时间
  deadline?: string;
  // 备注
  remark?: string;
}
