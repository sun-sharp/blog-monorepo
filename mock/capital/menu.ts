import { resultError, resultSuccess } from '../_util';

const basic = '/capital-api/menu';

let menusList = [
  {
    menuId: '6167d18f45e23c7808001334',
    name: 'system',
    title: '系统管理',
    // path: '/system',
    sort: 1,
    icon: 'SettingOutlined',
    parentId: '0',
    iframeSrc: '',
    component: 'layout',
    menuType: 1,
    hidden: false,
  },
  {
    menuId: '6167d87845e23c7808001335',
    name: 'menu',
    title: '菜单管理',
    // path: '/menu',
    sort: 1,
    icon: 'DocumentTextOutline',
    parentId: '6167d18f45e23c7808001334',
    iframeSrc: '',
    component: '/system/menu/index',
    menuType: 5,
    hidden: false,
  },
  {
    menuId: '620daf49e6f0ff83c48685db',
    name: 'image',
    title: '图片管理',
    // path: '/file/image',
    sort: 1,
    icon: 'DocumentTextOutline',
    parentId: '620dae82e6f0ff83c48685d2',
    component: '/file/image/index',
    menuType: 5,
    hidden: false,
  },
  {
    menuId: '61eaa1665810633e6c4220ac',
    name: 'role',
    title: '角色管理',
    // path: '/role',
    sort: 2,
    icon: 'PersonOutline',
    parentId: '6167d18f45e23c7808001334',
    component: '/system/role/index',
    menuType: 5,
    hidden: false,
  },
  {
    menuId: '620dae82e6f0ff83c48685d2',
    name: 'file',
    title: '文件管理',
    // path: '/file',
    sort: 2,
    icon: 'DocumentTextOutline',
    parentId: '0',
    component: 'layout',
    menuType: 1,
    hidden: false,
  },
  {
    menuId: '61eaa1a95810633e6c4220b0',
    name: 'user',
    title: '用户管理',
    // path: '/user',
    sort: 3,
    icon: 'UsergroupAddOutlined',
    parentId: '6167d18f45e23c7808001334',
    iframeSrc: null,
    component: '/system/user/index',
    menuType: 5,
    hidden: false,
  },
  {
    menuId: '620629e45cda1331a76b027b',
    name: 'about',
    title: '关于',
    // path: '/about',
    sort: 10,
    icon: 'DocumentTextOutline',
    parentId: '0',
    component: '/about/index',
    menuType: 5,
    hidden: false,
  },
];

export default [
  {
    url: `${basic}/find_term`,
    timeout: 1000,
    method: 'get',
    response: () => {
      return resultSuccess(menusList);
    },
  },
  {
    url: `${basic}/save`,
    timeout: 1000,
    method: 'post',
    response: (data) => {
      menusList.push({
        ...data,
        menuId: new Date().getTime(),
      });
      return resultSuccess(null, { message: '保存成功！' });
    },
  },
  {
    url: `${basic}/update`,
    timeout: 1000,
    method: 'put',
    response: (data) => {
      const findIndex = menusList.findIndex((f) => f.menuId === data.menuId);
      if (findIndex !== -1) {
        menusList[findIndex] = data;
        return resultSuccess(null, { message: '修改成功!' });
      } else {
        return resultError('修改失败!', { code: -1, result: null });
      }
    },
  },
  {
    url: `${basic}`,
    timeout: 1000,
    method: 'delete',
    response: (menuId) => {
      menusList = menusList.filter((f) => f.menuId !== menuId);
      return resultSuccess(null, { message: '删除成功!' });
    },
  },
];
