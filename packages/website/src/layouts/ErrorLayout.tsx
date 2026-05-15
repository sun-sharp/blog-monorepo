import { clearParticleBack, initParticleBack } from '@/plugins/canvas/particle-back';
import { Row } from 'antd';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const ErrorLayout: React.FC = () => {
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
    <Row style={{ height: '100%' }} align={'middle'} justify={'center'}>
      <Outlet />
    </Row>
  );
};

export default ErrorLayout;
