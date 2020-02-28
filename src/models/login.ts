import { Reducer } from 'redux';
import { Effect } from 'dva';
import { stringify } from 'querystring';
import { router } from 'umi';

import { login } from '@/services/login';
import { setAuthority, setCurrentUser, setAuthToken } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

export interface StateType {
  status?: 'ok' | 'error';
  currentAuthority?: 'user' | 'guest' | 'admin';
  operator?: any;
  authToken?: string;
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      if (!response) {
        yield put({
          type: 'changeLoginStatus',
          payload: { status: 'error' },
        });
        return;
      }
      const {
        data: {
          payload: { user, authToken },
        },
      } = response;
      const ok = authToken && authToken.length > 0;

      yield put({
        type: 'changeLoginStatus',
        payload: { status: ok ? 'ok' : 'error', user, currentAuthority: 'admin', authToken },
      });

      // Login successfully
      if (ok) {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        router.replace(redirect || '/');
      }
    },

    logout() {
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        router.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
      setAuthority('guest');
      setAuthToken(undefined);
      setCurrentUser(undefined);
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      setAuthToken(payload.authToken);
      setCurrentUser(payload.user);
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};

export default Model;
