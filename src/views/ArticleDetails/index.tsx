import { articleAPi } from '@/api';
import './index.scss';
import { useCallback, useEffect, useState } from 'react';
import { IArticleItem } from '/#/views/home';
import { useParams } from 'react-router';
import { MdCatalog, MdPreview } from 'md-editor-rt';
import 'md-editor-rt/lib/preview.css';
import AuthorIntro from '@/components/common/AuthorIntro';

const ArticleDetails: React.FC = () => {
  const { articleId } = useParams();

  const [editorId] = useState('article-details-only');
  const [scrollElement] = useState(document.documentElement);
  const [det, setDet] = useState<IArticleItem>({});

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
  );
};

export default ArticleDetails;
