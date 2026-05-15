/**
 * @description: 待办数据字段
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
 * @description: 待办的id
 */
export interface ApiWaitForDoId {
  // 待办id
  waitForDoId: string;
}

/**
 * @description: 待办的列表每项
 */
export interface ApiWaitForDoItem extends ApiWaitForDo, ApiWaitForDoId {}

/**
 * @description: 修改待办的状态 修改参数
 */
export interface ApiWaitForDoUpdateStateData {
  state: number;
  completionTime?: Date;
  $unset?: { completionTime: '' };
}
