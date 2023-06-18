import { Input, Tooltip } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { Link, useLocation } from 'react-router-dom';
import logoImage from '@/assets/logo.png';
import { IHeadMenuArr } from '/#/layouts/header';
import { useState } from 'react';
import cn from 'classnames';

const LayoutHeader: React.FC = () => {
  const headMenuArr: IHeadMenuArr[] = [
    {
      title: '首页',
      path: '/',
    },
    {
      title: '分页',
      path: '/classify',
    },
  ];

  const location = useLocation();

  const [activePath, setActivePath] = useState(location.pathname);

  const toActivePathChange = (item: IHeadMenuArr) => {
    setActivePath(item.path);
  };

  const { Search } = Input;
  const onSearch = (val: string) => {
    console.log(val);
  };

  return (
    <Header className="layout-header">
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
      <div className="header-right">{activePath === '/' ? <Search placeholder="请输入关键字" size="middle" onSearch={onSearch} /> : ''}</div>
    </Header>
  );
};

export default LayoutHeader;
