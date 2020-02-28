import gql from 'graphql-tag';
import { query } from '@/utils/graphql';

export async function queryMenus(params: any) {
  return query(
    gql`
      query($filter: String, $pageInfo: PageInfo!) {
        payload: getAllMenus(filter: $filter, pageInfo: $pageInfo) {
          count
          nodes {
            id
            name
            icon
            path
            seq
            parentId
            parentPath
            hideInMenu
            desc
            resourceId
          }
        }
      }
    `,
    {
      variables: {
        filter: params.filter,
        pageInfo: params.pageInfo,
      },
    },
  );
}
