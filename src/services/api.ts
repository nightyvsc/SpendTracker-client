import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000',
  withCredentials: false,
});

const ACCESS_KEY = 'st_access';
const REFRESH_KEY = 'st_refresh';

export const Tokens = {
  get access() { return Cookies.get(ACCESS_KEY) ?? ''; },
  set access(v: string) { Cookies.set(ACCESS_KEY, v, { sameSite: 'lax' }); },
  get refresh() { return Cookies.get(REFRESH_KEY) ?? ''; },
  set refresh(v: string) { Cookies.set(REFRESH_KEY, v, { sameSite: 'lax' }); },
  clear() { Cookies.remove(ACCESS_KEY); Cookies.remove(REFRESH_KEY); }
};

api.interceptors.request.use(cfg => {
  const tk = Tokens.access;
  if (tk) cfg.headers.Authorization = `Bearer ${tk}`;
  return cfg;
});

let refreshing = false;
let waiters: Array<() => void> = [];

async function doRefresh() {
  try {
    const { data } = await axios.post(
      `${api.defaults.baseURL}/api/auth/refresh/`,
      { refresh: Tokens.refresh }
    );
    Tokens.access = data.access;
  } finally {
    refreshing = false;
    waiters.forEach(fn => fn());
    waiters = [];
  }
}

api.interceptors.response.use(
  r => r,
  async (err) => {
    const original: any = err.config;
    if (err.response?.status === 401 && Tokens.refresh && !original._retry) {
      if (!refreshing) {
        refreshing = true;
        await doRefresh();
      } else {
        await new Promise<void>(res => waiters.push(res));
      }
      original._retry = true;
      original.headers = original.headers ?? {};
      original.headers.Authorization = `Bearer ${Tokens.access}`;
      return api(original);
    }
    return Promise.reject(err);
  }
);

export default api;
