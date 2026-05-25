import request from '../utils/request';

export interface LoginParams {
  username: string;
  password: string;
}

export interface AdminInfo {
  id: string;
  username: string;
  nickname: string;
}

export interface LoginResult {
  token: string;
  admin: AdminInfo;
}

export function loginApi(params: LoginParams): Promise<LoginResult> {
  return request.post('/api/admin/login', params).then((res) => res.data);
}
