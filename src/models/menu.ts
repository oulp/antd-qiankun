import { Reducer } from 'redux';
import { Effect } from 'dva';
import arrayToTree from 'array-to-tree';
import TreeModel from 'tree-model';
import _ from 'lodash';

import { ITreeNodeType, IQuery } from '@/utils/data.d';
import { queryMenus } from '@/services/menu';

export interface StateType {
  query: IQuery;
  data: { nodes: Array<any> };
  treeData: Array<ITreeNodeType>;
  roots: Array<any>;
}

export interface MenuTreeModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: MenuTreeModelType = {
  namespace: 'menu',

  state: {
    query: { pageInfo: { orderBy: 'createdAt ASC', offset: 0, limit: 0 }, filter: '' },
    data: {
      nodes: [],
    },
    treeData: [],
    roots: [],
  },

  effects: {
    *fetch({ payload, callback }, { call, put, select }) {
      let query = payload;
      if (!query) {
        query = yield select((state: { menu: { query: any } }) => state.menu.query);
      }
      const {
        data: { payload: menu },
      } = yield call(queryMenus, query);
      const treeData = arrayToTree(_.get(menu, 'nodes', []), {
        parentProperty: 'parentId',
      });
      const roots = treeData.map(td => {
        const tree = new TreeModel();
        return tree.parse(td);
      });
      yield put({
        type: 'save',
        payload: menu,
        treeData,
        query,
        roots,
      });
      if (callback) callback(menu);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
        query: action.query || (state ? state.query : {}),
        treeData: action.treeData,
        roots: action.roots,
      };
    },
  },
};

export default Model;
