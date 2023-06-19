// import { useState } from 'react';
import AuthorIntro from '@/components/common/AuthorIntro';
import './index.scss';
import { useEffect, useState } from 'react';
import { articleAPi } from '@/api';
import ArticleItem from '@/components/common/ArticleItem';

const Home: React.FC = () => {
  const [articleData, setArticleData] = useState([]);

  // 查询文章
  const loadArticle = () => {
    articleAPi
      .getFindPage({
        size: 10,
        current: 1,
      })
      .then((res) => {
        setArticleData(res.list);
      });
  };

  useEffect(() => {
    loadArticle();
  }, []);
  return (
    <div className="home">
      <div className="home-main">
        <ArticleItem data={articleData} />
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
