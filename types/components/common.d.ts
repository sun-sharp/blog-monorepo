export interface IAuthorIntroProp {
  backgroundColor: string;
  user?: {
    avatar?: string;
    nickname?: string;
  };
}

export interface IArticleItemProps {
  data: IArticleItem[];
}
