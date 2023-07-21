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
  // 待办id
  waitForDoId: string;

  // 状态
  state: number;
}

/**
 * @description: 修改待办的排序参数
 */
export interface ApiWaitForDoUpdateSortData {
  // 待办id
  waitForDoId: string;

  // 排序
  sort: number;
}

/**
 * @description: 修改待办的名称，备注，截止时间参数
 */
export interface ApiWaitForDoUpdateData {
  // 待办id
  waitForDoId: string;

  // 标题
  title?: string;

  // 截止时间
  deadline?: string;

  // 备注
  remark?: string;
}
