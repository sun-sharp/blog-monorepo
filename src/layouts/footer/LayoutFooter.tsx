import { VITE_APP_SHORT_NAME } from '@/constants';
import { Footer } from 'antd/es/layout/layout';

const LayoutFooter: React.FC = () => {
  return (
    <>
      <Footer className="layout-footer">
        ©2023
        {/* <i className="icon-aixin layouts-footer--love" /> */}
        <span> {VITE_APP_SHORT_NAME} | </span>
        <a href="https://beian.miit.gov.cn">黔ICP备2021008571号</a>
      </Footer>
    </>
  );
};

export default LayoutFooter;
