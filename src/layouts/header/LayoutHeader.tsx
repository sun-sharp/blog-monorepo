import {
  // Input,
  Tooltip,
  Avatar,
} from 'antd';
import { Header } from 'antd/es/layout/layout';
import { Link, useLocation } from 'react-router-dom';
import logoImage from '@/assets/logo.png';
import headSculptureImage from '@/assets/head_sculpture.jpg';
import { IHeadMenuArr, IHeaderProp } from '/#/layouts/header';
import { useEffect, useState } from 'react';
import cn from 'classnames';
import { useDispatch } from 'react-redux';
import { setAuthorSlideVisible } from '@/store/modules/common';

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

  const toActivePathChange = (item: IHeadMenuArr) => {
    setActivePath(item.path);
  };

  // 监听路由变化
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

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
          <Tooltip title="个人介绍">
            <Avatar className="header-avatar" src={headSculptureImage} size={33} onClick={() => dispatch(setAuthorSlideVisible(true))} />
          </Tooltip>
        </div>
      </div>
    </Header>
  );
};

export default LayoutHeader;
