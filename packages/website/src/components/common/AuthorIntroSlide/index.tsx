import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setAuthorSlideVisible } from '@/store/modules/common';
import AuthorIntro from '../AuthorIntro';
import './index.scss';
import { storage } from '@/utils';
import { CURRENT_USER } from '@/constants';

const AuthorIntroSlide: React.FC = () => {
  const dispatch = useDispatch();
  const visible = useSelector((state: RootState) => state.common.authorSlideVisible);

  const handleMaskClick = () => {
    dispatch(setAuthorSlideVisible(false));
  };

  if (!visible) return null;

  // 从存储中获取用户数据
  const currentUser = storage.get(CURRENT_USER);

  return (
    <>
      <div className="author-slide-mask" onClick={handleMaskClick} />
      <div className="author-slide-container">
        <AuthorIntro backgroundColor="#fff" user={currentUser} />
      </div>
    </>
  );
};

export default AuthorIntroSlide;
