import { Content } from 'antd/es/layout/layout';
import { Outlet } from 'react-router-dom';

const LayoutMain: React.FC = () => {
  return (
    <>
      <Content className="layout-main">
        <Outlet />
      </Content>
    </>
  );
};

export default LayoutMain;
