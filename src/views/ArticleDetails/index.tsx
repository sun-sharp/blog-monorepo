import { articleAPi } from '@/api';
import './index.scss';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MdCatalog, MdPreview } from 'md-editor-rt';
import 'md-editor-rt/lib/preview.css';
import AuthorIntro from '@/components/common/AuthorIntro';
import AuthorIntroSlide from '@/components/common/AuthorIntroSlide';
import CatalogSlide from '@/components/common/CatalogSlide';
import { MenuOutlined } from '@ant-design/icons';
import { ApiArticleItem } from '/#/api/blog/article';

const ArticleDetails: React.FC = () => {
  const { articleId } = useParams();
  const [editorId] = useState('article-details-only');
  const [scrollElement] = useState(document.documentElement);
  const [det, setDet] = useState<ApiArticleItem>({} as ApiArticleItem);
  const [showCatalog, setShowCatalog] = useState(false);

  // 查询文章详情
  const loadArticleDetails = useCallback(() => {
    articleAPi.getDetails(articleId || '').then((res) => {
      setDet(res);
    });
  }, [articleId]);

  useEffect(() => {
    if (articleId) {
      loadArticleDetails();
    }
  }, [articleId, loadArticleDetails]);

  return (
    <div className="article-detail">
      <AuthorIntroSlide />
      <div className="article-detail-cont">
        <p className="article-detail-cont--title">{det.title}</p>
        <div className="article-detail-cont--author">
          {/* <i className="icon-touxiang author01" /> */}
          <span>{det.authorNickname}</span>
          {/* <i className="icon-rili author02" /> */}
          <span>{det.createTime}</span>
        </div>
        <div className="article-detail-cont--about">
          <strong>简介</strong>
          {det.brief}
        </div>
        <div className="article-detail__markdown">
          <MdPreview className="markdown-theme" editorId={editorId} modelValue={det.markdownContent || ''} />
        </div>
      </div>

      {/* PC端右侧固定布局 - 个人介绍 + 目录 */}
      <div className="article-detail-right-side">
        <div className="article-detail-slider">
          <div className="article-detail-slider__author">
            <AuthorIntro backgroundColor="rgba(255, 255, 255, 0.4)" />
          </div>
          {det.markdownContent ? (
            <div className="article-detail-catalog">
              <p className="article-detail-catalog--title">文章目录</p>
              <MdCatalog editorId={editorId} scrollElement={scrollElement} />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      {/* 移动端目录按钮 - 下移60px */}
      <button className="article-detail-catalog-btn" style={{ top: '70px' }} onClick={() => setShowCatalog(true)}>
        <MenuOutlined style={{ fontSize: '20px' }} />
      </button>

      {/* 移动端目录弹窗 */}
      {showCatalog && <CatalogSlide editorId={editorId} scrollElement={scrollElement} visible={showCatalog} onClose={() => setShowCatalog(false)} />}
    </div>
  );
};

export default ArticleDetails;
