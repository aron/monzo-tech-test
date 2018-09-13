let id = 0;
/** Returns a client local unique id with optional prefix */

export function uniqueId(prefix = '') {
  return `${prefix}${++id}`;
}
/** i18n placeholder */

export function gettext(str) {
  return str;
}
/** Token Storage */

const TOKEN_KEY = 'auth_token';
export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || null;
}
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

//# sourceMappingURL=utils.js.map