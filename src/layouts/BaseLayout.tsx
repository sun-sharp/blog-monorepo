import { Layout } from 'antd';
import LayoutHeader from './header/LayoutHeader';
import LayoutFooter from './footer/LayoutFooter';
import LayoutMain from './main/LayoutMain';
import { clearParticleBack, initParticleBack } from '@/plugins/canvas/particle-back';
import { useEffect, useId, useState } from 'react';

const LayoutIndex: React.FC = () => {
  const [headerHide, setHeaderHide] = useState(false);

  const layoutId = useId();

  const scrollChange = () => {
    // 向下滚动时
    const scrollTop = document.getElementById(layoutId)?.scrollTop;
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
    <Layout id={layoutId} className="base-layout">
      <LayoutHeader hide={headerHide} />
      <LayoutMain />
      <LayoutFooter />
    </Layout>
  );
};

export default LayoutIndex;
