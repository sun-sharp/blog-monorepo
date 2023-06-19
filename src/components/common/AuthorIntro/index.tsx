import { Avatar } from 'antd';
import './index.scss';
import { IAuthorIntroProp } from '/#/components/common';
import headSculptureImage from '@/assets/head_sculpture.jpg';
import { VITE_APP_SHORT_NAME } from '@/constants';

const AuthorIntro: React.FC<IAuthorIntroProp> = ({ backgroundColor }) => {
  return (
    <div style={{ backgroundColor }} className="author-intro">
      <div className="author-intro--avatar">
        <Avatar size={100} src={headSculptureImage} />
      </div>
      <p className="author-intro--name">{VITE_APP_SHORT_NAME}</p>
      <p className="author-intro--position">前端开发工程师</p>
      <div className="author-intro--text">
        <p>一个90后草根站长！18年入行。</p>
        <p>一直潜心研究前端技术，一边工作一边积累经验。</p>
        <p>分享一些个人工作的经历，以及遇到的问题和解决方法。</p>
      </div>
    </div>
  );
};

export default AuthorIntro;
