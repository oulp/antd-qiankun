import { Effect } from 'dva';
import { Reducer } from 'redux';

import { getCurrentUser } from '@/utils/authority';

export interface CurrentUser {
  name?: string;
  id?: string;
  phone?: string;
  email?: string;
}

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetchCurrent(_, { put }) {
      yield put({
        type: 'saveCurrentUser',
        payload: getCurrentUser(),
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
  },
};

export default UserModel;
