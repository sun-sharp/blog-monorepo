export interface ImageFindPageParams {
  name:
    | {
        $regex: string;
      }
    | string;
  source?: string;
}
