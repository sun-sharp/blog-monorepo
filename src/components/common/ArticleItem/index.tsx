import { Link } from 'react-router-dom';
import './index.scss';
import { IArticleItemProps } from '/#/components/common';
import { IArticleItem } from '/#/views/home';

const ArticleItem: React.FC<IArticleItemProps> = ({ data }) => {
  return (
    <ul className="article-cont">
      {data.map((item: IArticleItem) => {
        const linkTo = `/articleDetails/${item.articleId}`;
        return (
          <li key={item.articleId} className="article-item">
            <div className="item-cont">
              {/* {item.image ? (
            <div className="item-cont--img">
              <Link to={linkTo} title={item.title}>
                <img src={item.image} alt={item.title} />
              </Link>
            </div>
          ) : (
            ''
          )} */}
              <div>
                <Link to={linkTo}>
                  <p className="item-cont--title">{item.title}</p>
                </Link>
                <p className="item-cont--info">{item.brief}</p>
              </div>
            </div>
            <div className="item-author">
              <span className="lm">
                <i className="icon-tag2" />
                {item.categoryName}
              </span>
              <span className="time">
                <i className="icon-time1" />
                {item.createTime}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ArticleItem;
