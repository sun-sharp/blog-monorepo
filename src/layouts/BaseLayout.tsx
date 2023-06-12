import { Layout, Space } from 'antd';
import LayoutHeader from './header/LayoutHeader';
import LayoutFooter from './footer/LayoutFooter';
import LayoutMain from './main/LayoutMain';
import { setupHeartAnimation } from '@/plugins/heart.ts';
import { setupParticleBack } from '@/plugins/particle-back.ts';

const LayoutStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  background: 'transparent',
};

const LayoutIndex: React.FC = () => {
  setupHeartAnimation();
  setupParticleBack();

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
