import { reloadAuthorized } from './Authorized';

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str?: string): string | string[] {
  const authorityString =
    typeof str === 'undefined' && localStorage ? localStorage.getItem('antd-pro-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  // preview.pro.ant.design only do not use in your production.
  // preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  if (!authority && ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return ['admin'];
  }
  return authority;
}

export function setAuthority(authority: string | string[]): void {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
  // auto reload
  reloadAuthorized();
}

export function getCurrentUser() {
  let user = {};
  try {
    const userstring = localStorage.getItem('current-user');
    if (userstring) {
      user = JSON.parse(userstring);
    }
    // eslint-disable-next-line no-empty
  } catch (e) {}
  return user;
}

export function setCurrentUser(user: any) {
  if (typeof user === 'undefined') {
    localStorage.removeItem('current-user');
  } else {
    localStorage.setItem('current-user', JSON.stringify(user));
  }
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_NAME);
}

export function setAuthToken(authToken: any) {
  if (typeof authToken === 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_NAME);
  } else {
    localStorage.setItem(AUTH_TOKEN_NAME, authToken);
  }
}
