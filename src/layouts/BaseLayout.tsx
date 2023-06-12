import { Layout, Space } from 'antd';
import LayoutHeader from './header/LayoutHeader';
import LayoutFooter from './footer/LayoutFooter';
import LayoutMain from './main/LayoutMain';
import { clearParticleBack, initParticleBack } from '@/plugins/canvas/particle-back';
import { useEffect } from 'react';

const LayoutStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  background: 'transparent',
};

const LayoutIndex: React.FC = () => {
  useEffect(() => {
    // 这里的代码块 等价于 componentDidMount
    // do something...
    initParticleBack();
    // return的写法 等价于 componentWillUnmount
    return () => {
      // do something...
      clearParticleBack();
    };
  });

  return (
    <>
      <Space direction="vertical" style={{ width: '100%' }} size={[0, 48]}>
        <Layout style={LayoutStyle}>
          <LayoutHeader />
          <LayoutMain />
          <LayoutFooter />
        </Layout>
      </Space>
    </>
  );
};

export default LayoutIndex;
