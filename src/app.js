import request from './services/app';
import fetch from 'dva/fetch';

export const qiankun = request().then(apps => ({
  apps,
  fetch: url => {
    console.log('静态资源fetch覆盖');
    return fetch(url);
  },
}));
