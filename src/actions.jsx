import {setToken, clearToken, gettext} from './utils.js';
import {initialAppState} from './store.js';
import {login, getApps, updateApp, HTTPError} from './client.js';

/**
 * Performs the login request and updates the token and status.
 */
export async function performLoginAction({email, password, expiry}) {
  try {
    const token = await login(email, password, expiry);
    setToken(token);
    return {
      authToken: token,
      authStatus: 'done',
    };
  } catch (err) {
    if (err instanceof HTTPError) {
      return {authToken: null, authStatus: 'error'};
    } else {
      return Promise.reject(err);
    }
  }
}

/**
 * Loads a list of the current users apps. Requires an auth token.
 */
export async function loadAppsAction(token) {
  try {
    const apps = await getApps(token);
    return {
      appsStatus: 'done',
      apps: apps.reduce((obj, app) => {
        obj[app.id] = app;
        return obj;
      }, {})
    };
  } catch (err) {
    if (err instanceof HTTPError) {
      if (err.isUnauthorized) {
        return logoutAction(gettext('You have been logged out, please log in again'));
      } else {
        return {appsStatus: 'error'};
      }
    } else {
      return Promise.reject(err);
    }
  }
}

/**
 * Updates properties of a single app, requires the app id and an auth token. The
 * two props that can be updated are "title" and "logo", both strings.
 */
export async function updateAppAction(token, appId, props) {
  try {
    const app = await updateApp(token, appId, props);
    return state => ({
      // TODO: Enable babel spread transform...
      apps: Object.assign({}, state.apps, {[app.id]: app}),
    });
  } catch (err) {
    if (err instanceof HTTPError) {
      if (err.isUnauthorized) {
        return logoutAction(gettext('You have been logged out, please log in again'));
      } else {
        return {}; // TODO: Handle this better.
      }
    } else {
      return Promise.reject(err);
    }
  }
}

/** Displays a modal informing the user they have been logged out, and destroys the session */
export function logoutAction(message) {
  if (message) {
    // Ideally should use <dialog> with polyfill.
    alert(message);
  }
  clearToken();
  return initialAppState();
}