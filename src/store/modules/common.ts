import { createSlice } from '@reduxjs/toolkit';

export interface IUserInitialState {
  articleCategoryData: string[];
}

// 默认状态
const initialState: IUserInitialState = {
  articleCategoryData: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setArticleCategoryData: (state, action) => {
      state.articleCategoryData = action.payload;
    },
  },
});

export const { setArticleCategoryData } = userSlice.actions;

export default userSlice.reducer;
