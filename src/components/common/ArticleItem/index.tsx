import { useNavigate } from 'react-router-dom';
import './index.scss';
import { IArticleItemProps } from '/#/components/common';
import { ApiArticleItem } from '/#/api/blog/article';

const ArticleItem: React.FC<IArticleItemProps> = ({ data }) => {
  const navigate = useNavigate();
  return (
    <ul className="article-cont">
      {data.map((item: ApiArticleItem) => {
        const linkTo = `/articleDetails/${item.articleId}`;
        return (
          <li key={item.articleId} className="article-item">
            <div className="item-cont">
              <div
                className="item-cont--title"
                onClick={() => {
                  navigate(linkTo);
                }}>
                {item.title}
              </div>
              <div className="item-author">
                {/* <span className="lm">
                  <i className="icon-tag2" />
                  {item.categoryName}
                </span> */}
                <span className="time">
                  {/* <i className="icon-time1" /> */}
                  {item.createTime}
                </span>
              </div>
              <div className="item-cont--info">{item.brief}</div>
              <div className="item-cont--btn">
                <span
                  className="more"
                  onClick={() => {
                    navigate(linkTo);
                  }}>
                  阅读原文
                </span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ArticleItem;
