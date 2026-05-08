import AuthorIntro from '@/components/common/AuthorIntro';
import './index.scss';
import { useCallback, useEffect, useState } from 'react';
import { articleAPi } from '@/api';
import ArticleItem from '@/components/common/ArticleItem';
import { Pagination, PaginationProps } from 'antd';
import { ApiArticleItem } from '/#/api/blog/article';

const Home: React.FC = () => {
  const [articleData, setArticleData] = useState<ApiArticleItem[]>([]);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageSize] = useState(10);
  const [pageTotal, setPageTotal] = useState(0);

  // 查询文章
  const loadArticle = useCallback(() => {
    articleAPi
      .getFindPage({
        size: pageSize,
        current: pageCurrent,
      })
      .then((res) => {
        setArticleData(res.list);
        setPageTotal(res.total);
        window.scrollTo(0, 0);
      });
  }, [pageCurrent, pageSize]);

  // 分页
  const onPageChange: PaginationProps['onChange'] = (page) => {
    setPageCurrent(page);
  };

  useEffect(() => {
    loadArticle();
  }, [loadArticle]);

  return (
    <div className="home">
      <div className="home-main">
        <ArticleItem data={articleData} />
        {pageTotal > pageSize ? <Pagination className="home-main__page" showQuickJumper current={pageCurrent} total={pageTotal} onChange={onPageChange} /> : ''}
      </div>
      <div className="home-slider">
        <div className="home-slider__cont">
          <AuthorIntro backgroundColor="rgba(255, 255, 255, 0.4)" />
        </div>
      </div>
    </div>
  );
};

export default Home;
