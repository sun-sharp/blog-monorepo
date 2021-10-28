import { renderIcon } from '@/utils/index';
import { DashboardOutlined, HomeOutlined, CheckCircleOutlined } from '@vicons/antd';
import { DesktopOutline, DocumentTextOutline } from '@vicons/ionicons5';

//前端路由图标映射表
export const constantRouterIcon = {
  DashboardOutlined: renderIcon(DashboardOutlined),
  HomeOutlined: renderIcon(HomeOutlined),
  CheckCircleOutlined: renderIcon(CheckCircleOutlined),
  DesktopOutline: renderIcon(DesktopOutline),
  DocumentTextOutline: renderIcon(DocumentTextOutline),
};
