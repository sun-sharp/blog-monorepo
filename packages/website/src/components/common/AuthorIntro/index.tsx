import { Avatar } from 'antd';
import './index.scss';
import { IAuthorIntroProp } from '/#/react/components/common';
import headSculptureImage from '@/assets/default-avatar.png';
import { VITE_APP_SHORT_NAME, CURRENT_USER } from '@/constants';
import { storage } from '@/utils';
import { useEffect, useState } from 'react';
import { getImgUrl } from '@shared/utils/files';

// 用户数据类型
interface CurrentUser {
  avatar?: string;
  nickname?: string;
  [key: string]: any;
}

const AuthorIntro: React.FC<IAuthorIntroProp> = ({ backgroundColor, user: propUser }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // 如果通过props传递了用户数据，则使用props，否则从存储中获取
  useEffect(() => {
    if (propUser) {
      setCurrentUser(propUser);
    } else {
      const user = storage.get(CURRENT_USER);
      setCurrentUser(user || null);
    }
  }, [propUser]);

  // 获取头像URL，如果用户有自定义头像则使用，否则使用默认头像
  const avatarSrc = currentUser?.avatar ? getImgUrl(currentUser.avatar) : headSculptureImage;
  // 获取显示名称，优先使用用户昵称，否则使用默认应用名称
  const displayName = currentUser?.nickname || VITE_APP_SHORT_NAME;

  return (
    <div style={{ backgroundColor }} className="author-intro">
      <div className="author-intro--avatar">
        <Avatar
          size={100}
          src={avatarSrc}
          onError={() => {
            // 头像加载失败时使用默认头像
            return false;
          }}
        />
      </div>
      <p className="author-intro--name">{displayName}</p>
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
