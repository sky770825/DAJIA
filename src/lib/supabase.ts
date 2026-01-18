import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase 配置缺失，请检查环境变量 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// 后台管理密码
export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '123456';

// 登录状态管理
const ADMIN_SESSION_KEY = 'admin_session';

export const adminAuth = {
  login: (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'authenticated');
      return true;
    }
    return false;
  },

  logout: (): void => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  },

  isAuthenticated: (): boolean => {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'authenticated';
  },
};
