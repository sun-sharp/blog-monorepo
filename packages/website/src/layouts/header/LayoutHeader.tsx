import {
  // Input,
  Tooltip,
  Avatar,
  Dropdown,
  Button,
} from 'antd';
import type { MenuProps } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { Link, useLocation } from 'react-router-dom';
import logoImage from '@/assets/logo.png';
import headSculptureImage from '@/assets/head_sculpture.jpg';
import { IHeadMenuArr, IHeaderProp } from '/#/layouts/header';
import { useEffect, useState } from 'react';
import cn from 'classnames';
import { useDispatch } from 'react-redux';
import { setAuthorSlideVisible } from '@/store/modules/common';
import { storage } from '@/utils';
import { ACCESS_TOKEN, CURRENT_USER, USER_CONFIG } from '@/constants';
import { getImgUrl } from '@shared/utils/files';

// 用户数据类型定义
interface CurrentUser {
  avatar?: string;
  nickname?: string;
  [key: string]: any;
}

const LayoutHeader: React.FC<IHeaderProp> = ({ hide }) => {
  const dispatch = useDispatch();
  const headMenuArr: IHeadMenuArr[] = [
    {
      title: '首页',
      path: '/',
    },
    // {
    //   title: '分页',
    //   path: '/classify',
    // },
  ];

  const location = useLocation();

  const [activePath, setActivePath] = useState(location.pathname);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // 检查登录状态和获取用户信息
  useEffect(() => {
    const token = storage.get(ACCESS_TOKEN);
    const user = storage.get(CURRENT_USER);
    setIsLoggedIn(!!token);
    setCurrentUser(user || null);
  }, []);

  const toActivePathChange = (item: IHeadMenuArr) => {
    setActivePath(item.path);
  };

  // 监听路由变化
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  // 处理个人介绍点击
  const handleProfileClick = () => {
    dispatch(setAuthorSlideVisible(true));
  };

  // 处理退出登录
  const handleLogout = () => {
    // 删除存储的token和用户信息
    storage.remove(ACCESS_TOKEN);
    storage.remove(CURRENT_USER);
    storage.remove(USER_CONFIG);

    // 更新登录状态
    setIsLoggedIn(false);

    // 刷新页面以更新状态
    window.location.reload();
  };

  // 处理登录跳转
  const handleLogin = () => {
    window.location.href = 'https://www.yangruirui.top/manage';
  };

  // 下拉菜单项
  const dropdownItems: MenuProps['items'] = [
    {
      key: '1',
      label: '个人介绍',
      onClick: handleProfileClick,
    },
    {
      key: '2',
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  // 获取头像URL，如果用户有自定义头像则使用，否则使用默认头像
  const avatarSrc = currentUser?.avatar ? getImgUrl(currentUser.avatar) : headSculptureImage;

  return (
    <Header className="layout-header">
      <div
        className={cn('layout-header-container', {
          hide,
        })}>
        <div className="header-left">
          <Tooltip title="点击可进入过渡页面" overlayClassName="head-tool">
            <Link to="/middle" className="head-logo">
              <img className="head-logo--img" src={logoImage} alt="sun sharp logo" />
              <span className="head-logo--name">阳之锐</span>
            </Link>
          </Tooltip>
          <ul className="head-menu">
            {headMenuArr.map((item, index) => (
              <li className="head-menu--item" key={index}>
                <Link
                  className={cn('item-to', {
                    active: activePath === item.path,
                  })}
                  to={item.path}
                  onClick={() => toActivePathChange(item)}>
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="header-right">
          {isLoggedIn ? (
            <Dropdown menu={{ items: dropdownItems }} placement="bottomRight" arrow>
              <Avatar
                className="header-avatar"
                src={avatarSrc}
                size={33}
                onError={() => {
                  // 头像加载失败时使用默认头像
                  return false; // 阻止Antd Avatar的默认错误处理
                }}
              />
            </Dropdown>
          ) : (
            <Button type="primary" size="small" onClick={handleLogin}>
              登录
            </Button>
          )}
        </div>
      </div>
    </Header>
  );
};

export default LayoutHeader;
