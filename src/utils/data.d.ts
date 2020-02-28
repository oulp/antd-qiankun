export interface IPageInfo {
  orderBy?: string;
  offset?: number;
  limit?: number;
}

export interface IQuery {
  pageInfo?: IPageInfo;
  filter?: string;
}

export interface ITreeNodeType {
  name: string;
  id: string;
  desc: string;
  children: Array<ITreeNodeType>;
}
