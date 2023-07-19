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
