import { Footer } from 'antd/es/layout/layout';

const LayoutFooter: React.FC = () => {
  return (
    <>
      <Footer className="layout-footer">
        ©2020
        <i className="icon-aixin layouts-footer--love" />
        <span>Mr.Yang | </span>
        <a href="https://beian.miit.gov.cn">黔ICP备2021008571号</a>
      </Footer>
    </>
  );
};

export default LayoutFooter;
