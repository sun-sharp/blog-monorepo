/**
 * @description: 待办参数
 */
export interface WaitForDoItem {
  waitForDoId: string;
  title: string;
  classify: number;
  deadline: string;
  remark: string;
  state: number;
  sort: number;
}
