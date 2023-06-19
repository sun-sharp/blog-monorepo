import { FloatButton, Layout } from 'antd';
import LayoutHeader from './header/LayoutHeader';
import LayoutFooter from './footer/LayoutFooter';
import LayoutMain from './main/LayoutMain';
import { clearParticleBack, initParticleBack } from '@/plugins/canvas/particle-back';
import { useEffect, useState } from 'react';
import BackTopIcon from '@/components/icon/BackTopIcon';

const LayoutIndex: React.FC = () => {
  const [headerHide, setHeaderHide] = useState(false);

  const scrollChange = () => {
    // 向下滚动时
    const scrollTop = document.documentElement.scrollTop;
    if (scrollTop && scrollTop > 300) {
      setHeaderHide(true);
    } else {
      setHeaderHide(false);
    }
  };

  useEffect(() => {
    /* 这里的代码块 等价于 componentDidMount */
    // 创建滚动条监听
    window.addEventListener('scroll', scrollChange, true);
    scrollChange();
    /* return的写法 等价于 componentWillUnmount */
    return () => {
      // 删除滚动条监听
      window.removeEventListener('scroll', scrollChange, false);
    };
  });

  // 粒子背景
  useEffect(() => {
    /* 这里的代码块 等价于 componentDidMount */
    initParticleBack();
    /* return的写法 等价于 componentWillUnmount */
    return () => {
      clearParticleBack();
    };
  }, []);

  return (
    <Layout className="base-layout">
      <LayoutHeader hide={headerHide} />
      <LayoutMain />
      <LayoutFooter />
      <FloatButton.Group style={{ right: 100 }}>
        <FloatButton.BackTop icon={<BackTopIcon style={{ fontSize: '20px' }} />} />
      </FloatButton.Group>
    </Layout>
  );
};

export default LayoutIndex;
