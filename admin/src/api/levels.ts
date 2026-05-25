import request from '../utils/request';

export interface Level {
  id: string;
  category_id: string;
  name: string;
  level_number: number;
  pass_threshold: number;
  description: string;
  created_at: string;
}

export interface CreateLevelBody {
  categoryId: string;
  name: string;
  levelNumber?: number;
  passThreshold?: number;
  description?: string;
}

export interface UpdateLevelBody {
  name?: string;
  levelNumber?: number;
  passThreshold?: number;
  description?: string;
}

/** 通过用户端公共 API 获取学科的关卡列表 */
export function fetchLevelsByCategory(categoryId: string): Promise<{ data: Level[] }> {
  return request.get(`/api/levels/${categoryId}`).then((res) => res.data);
}

export function createLevel(body: CreateLevelBody): Promise<{ id: string; message: string }> {
  return request.post('/api/admin/levels', body).then((res) => res.data);
}

export function updateLevel(id: string, body: UpdateLevelBody): Promise<{ message: string }> {
  return request.put(`/api/admin/levels/${id}`, body).then((res) => res.data);
}

export function deleteLevel(id: string): Promise<{ message: string }> {
  return request.delete(`/api/admin/levels/${id}`).then((res) => res.data);
}
