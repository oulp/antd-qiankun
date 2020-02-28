import { notification } from 'antd';
import _ from 'lodash';

import client from './apollo';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  409: '请求的资源冲突，服务器上已经存在。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const checkStatus = (response: any) => {
  if (!response.errors || response.errors.length === 0) {
    return response;
  }

  const error = new Error(response.errors[0].message);
  error.name = response.errors[0].message;
  error.response = response;
  error.graphQLErrors = response.errors;
  throw error;
};

// error: {graphQLErrors, message, networkError, extraInfo, stack}
const handleGraphqlError = (error: any) => {
  if (error.graphQLErrors) {
    // graphQLErrors
    error.graphQLErrors.forEach((e: any) => {
      // extensions: {
      //   error:{
      //     code: "AlreadyExists"
      //     message: "There is already an existing 'operators' object with the same 'phone'."
      //     status: 409
      //   }
      // },
      // message: "There is already an existing 'operators' object with the same 'phone'.",
      // path: ["payload"]
      if (_.has(e, ['extensions', 'error'])) {
        const {
          extensions: {
            error: { status },
          },
        } = e;
        const errortext = codeMessage[status] || e.extensions.error.message;
        notification.error({
          message: `请求错误 ${status}: ${e.extensions.error.code}`,
          description: errortext,
        });
        if (status === 401) {
          // @HACK
          /* eslint-disable no-underscore-dangle */
          window.g_app._store.dispatch({
            type: 'login/logout',
          });
        }
        // // environment should not be used
        // if (status === 403) {
        //   router.push('/exception/403');
        //   return;
        // }
        // if (status <= 504 && status >= 500) {
        //   router.push('/exception/500');
        //   return;
        // }
        // if (status >= 404 && status < 422) {
        //   router.push('/exception/404');
        // }
      } else {
        const errortext = e.message;
        notification.error({
          message: `请求错误`,
          description: errortext,
        });
      }
    });
  } else {
    const errortext = error.message;
    notification.error({
      message: `请求错误`,
      description: errortext,
    });
  }
};

/**
 * Excute a query, returning a promise.
 *
 * @param  {any} gql       The query string we want to query
 * @param {object} options  The options for query
 * @return {object}           An object containing either "data" or "err"
 */
export function query(gql: any, options: any) {
  return client
    .query(
      Object.assign(
        {
          query: gql,
        },
        options,
      ),
    )
    .then(checkStatus)
    .catch((e: any) => {
      handleGraphqlError(e);
    });
}

/**
 * Excute a watchQuery, returning a promise.
 *
 * @param  {any} gql       The query string we want to query
 * @param {object} options  The options for query
 * @return {object}           An object containing either "data" or "err"
 */
export function watchQuery(gql: any, options: any) {
  return client.watchQuery(
    Object.assign(
      {
        query: gql,
      },
      options,
    ),
  );
}

/**
 * Excute a mutate, returning a promise.
 *
 * @param  {any} gql       The query string we want to query
 * @param {object} options  The options for query
 * @return {object}           An object containing either "data" or "err"
 */
export function mutate(gql: any, options: any) {
  return client
    .mutate(
      Object.assign(
        {
          mutation: gql,
        },
        options,
      ),
    )
    .then(checkStatus)
    .catch((e: any) => {
      handleGraphqlError(e);
    });
}

export function queryFilter(filterKeys: any) {
  // let filter = '';
  // Object.entries(filterKeys).forEach(([k, v]) => {
  //   filter = filter === '' ? `${k} ~ '^.*${v}.*$'` : `${filter} and ${k} ~ '^.*${v}.*$'`;
  // });
  // return filter;
  return JSON.stringify(filterKeys);
}

export function queryParams({ sorter, current, pageSize, ...filterKeys }: any, filterFn: any) {
  return {
    filter: (filterFn || queryFilter)(filterKeys),
    orderBy: sorter || 'updatedAt DESC',
    offset: ((current === undefined ? 1 : current) - 1) * (pageSize || 10),
    limit: pageSize === undefined ? 10 : pageSize,
  };
}

export function parseLisData(
  { currentPage, pageSize }: any,
  {
    data: {
      payload: { count, nodes },
    },
  }: any,
) {
  return {
    success: true,
    data: nodes || [],
    total: count || 0,
    pageSize: pageSize || 10,
    current: currentPage || 1,
  };
}
