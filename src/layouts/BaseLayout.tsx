import { Layout } from 'antd';
import LayoutHeader from './header/LayoutHeader';
import LayoutFooter from './footer/LayoutFooter';
import LayoutMain from './main/LayoutMain';
import { clearParticleBack, initParticleBack } from '@/plugins/canvas/particle-back';
import { useEffect } from 'react';

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
    <Layout className="base-layout">
      <LayoutHeader />
      <LayoutMain />
      <LayoutFooter />
    </Layout>
  );
};

export default LayoutIndex;
