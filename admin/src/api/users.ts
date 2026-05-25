import request from '../utils/request';

export interface User {
  id: string;
  nickname: string;
  avatar_url: string | null;
  phone: string;
  total_score: number;
  total_correct: number;
  total_wrong: number;
  last_login_at: string;
  created_at: string;
}

export interface UserListResult {
  data: User[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export function fetchUsers(params: {
  page?: number;
  pageSize?: number;
}): Promise<UserListResult> {
  return request.get('/api/admin/users', { params }).then((res) => res.data);
}
