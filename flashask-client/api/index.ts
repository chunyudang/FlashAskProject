/*
 * @Author: dangchy 14676620+dangchy@user.noreply.gitee.com
 * @Date: 2026-05-25 18:10:01
 * @LastEditors: dangchy 14676620+dangchy@user.noreply.gitee.com
 * @LastEditTime: 2026-05-26 11:43:40
 * @FilePath: /FlashAskProject/flashask-client/api/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const BASE_URL = 'http://localhost:3000/api';

interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: Record<string, any>;
  needAuth?: boolean;
}

/** 封装 uni.request 请求 */
const request = <T = any>({ url, method = 'GET', data = {}, needAuth = false }: RequestOptions): Promise<T> => {
  return new Promise((resolve, reject) => {
    const header: Record<string, string> = { 'Content-Type': 'application/json' };
    if (needAuth) {
      const token = uni.getStorageSync('token') as string;
      if (token) header['Authorization'] = `Bearer ${token}`;
    }
    uni.request({
      url: BASE_URL + url,
      method,
      data,
      header,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as T);
        } else if (res.statusCode === 401) {
          uni.removeStorageSync('token');
          uni.removeStorageSync('user');
          uni.reLaunch({ url: '/pages/login/login' });
          reject(new Error('登录已过期:401'));
        } else {
          reject(new Error((res.data as any)?.message || '请求失败'));
        }
      },
      fail: (err) => reject(new Error(err.errMsg || '网络异常')),
    });
  });
};

export const get = <T = any>(url: string, data?: Record<string, any>, needAuth = false) => request<T>({ url, method: 'GET', data, needAuth });

export const post = <T = any>(url: string, data?: Record<string, any>, needAuth = false) => request<T>({ url, method: 'POST', data, needAuth });

export const put = <T = any>(url: string, data?: Record<string, any>, needAuth = false) => request<T>({ url, method: 'PUT', data, needAuth });

export const del = <T = any>(url: string, needAuth = false) => request<T>({ url, method: 'DELETE', needAuth });
