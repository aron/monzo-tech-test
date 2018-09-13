import {getToken} from './utils.js';

export function initialAppState() {
  const token = getToken();
  return {
    authToken: token,
    authStatus: token ? 'done' : 'initial',
    appsStatus: 'initial',
    apps: {},
  };
}
