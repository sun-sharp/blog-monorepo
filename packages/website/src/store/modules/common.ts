import { createSlice } from '@reduxjs/toolkit';

export interface IUserInitialState {
  articleCategoryData: string[];
  authorSlideVisible: boolean;
}

// 默认状态
const initialState: IUserInitialState = {
  articleCategoryData: [],
  authorSlideVisible: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setArticleCategoryData: (state, action) => {
      state.articleCategoryData = action.payload;
    },
    setAuthorSlideVisible: (state, action) => {
      state.authorSlideVisible = action.payload;
    },
  },
});

export const { setArticleCategoryData, setAuthorSlideVisible } = userSlice.actions;

export default userSlice.reducer;
