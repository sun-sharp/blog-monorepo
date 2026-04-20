import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setAuthorSlideVisible } from '@/store/modules/common';
import AuthorIntro from '../AuthorIntro';
import './index.scss';

const AuthorIntroSlide: React.FC = () => {
  const dispatch = useDispatch();
  const visible = useSelector((state: RootState) => state.common.authorSlideVisible);

  const handleMaskClick = () => {
    dispatch(setAuthorSlideVisible(false));
  };

  if (!visible) return null;

  return (
    <>
      <div className="author-slide-mask" onClick={handleMaskClick} />
      <div className="author-slide-container">
        <AuthorIntro backgroundColor="#fff" />
      </div>
    </>
  );
};

export default AuthorIntroSlide;
