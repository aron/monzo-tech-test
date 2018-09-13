const API_ROOT = document.body.dataset.apiRoot;
if (!API_ROOT) {
  throw new Error('Host Page missing data-api-root attribute on <body> element');
}

export class HTTPError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.message = message;
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isNotFound() {
    return this.status === 404;
  }

}

export async function login(email, password, expiry) {
  const res =  await request({path: '/login', method: 'POST', payload: {email, password, expiry}});
  return await res.json().then(json => json.accessToken);
}

export async function verifyToken(token) {
  return await request({path: '/', token}).then(res => res.ok);
}

export async function getApps(token) {
  return await request({path: '/apps', token}).then(res => res.json()).then(json => json.apps);
}

export async function updateApp(token, appId, {name, logo}) {
  const res = await request({path: `/apps/${encodeURIComponent(appId)}`, method: 'PUT', payload: {name, logo}, token});
  return await res.json().then(json => json.app);
}

export async function getAppUsers(token, appId) {
  return await request({path: `/apps/${encodeURIComponent(appId)}`, token});
}

async function request({path, method='GET', payload, token}) {
  method = method.toUpperCase();
  const params = new URLSearchParams(method === 'GET' ? payload : {});
  const headers = new Headers({'Content-Type': 'application/json', Accept: 'application/json'});
  if (token) {
    headers.set('Authorization', token);
  }

  const res = await fetch(`${API_ROOT}${path}?${params}`, {
    mode: 'cors',
    method,
    headers,
    body: method !== 'GET' ? JSON.stringify(payload): null,
  });
  
  if (res.ok) {
    return res;
  } else {
    const json = res.json();
    return Promise.reject(new HTTPError(res.status, json.error));
  }
}