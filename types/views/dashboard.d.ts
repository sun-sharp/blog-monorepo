import { VNodeChild } from 'vue';

export type IWidgetKey = 'time_year' | 'time_Year_month';
export type IDragViewWidget = 1 | 2 | 1001;

// 仪表板编辑组件
export type IWidgetItem = {
  name: string;
  key: IWidgetKey;
  icon: () => VNodeChild;
  defaultWidth: number;
  defaultHeight: number;
  componentType: IDragViewWidget;
  isMatrix: boolean;
};

export type TreeParams = {
  key: string;
  label: string;
};

// 视图绘制数据
export type IDragView = {
  key: string | number;
  x: number;
  y: number;
  w: number;
  h: number;
  left: number;
  top: number;
  width: number;
  height: number;
  componentType: IDragViewWidget;
  isMatrix: boolean;
};

export type resizeEmitType = 'resize' | 'resizeStart' | 'resizeEnd';

export type IDragData = {
  width: number;
  height: number;
  left: number;
  top: number;
};

export type IAreaData = Array<Array<never | string | number> | never>;
