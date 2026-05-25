import request from '../utils/request';

export interface Question {
  id: string;
  level_id: string;
  level_name: string;
  level_number: number;
  category_id: string;
  category_name: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  tags: string[];
  difficulty: string;
  sort_order: number;
  created_at: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface QuestionListResult {
  data: Question[];
  pagination: Pagination;
}

export interface QuestionListParams {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  levelId?: string;
}

export interface CreateQuestionBody {
  levelId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tags?: string[];
  difficulty?: string;
  sortOrder?: number;
}

export interface UpdateQuestionBody {
  levelId?: string;
  question?: string;
  options?: string[];
  correctIndex?: number;
  explanation?: string;
  tags?: string[];
  difficulty?: string;
  sortOrder?: number;
}

export function fetchQuestions(params: QuestionListParams): Promise<QuestionListResult> {
  return request
    .get('/api/admin/questions', { params })
    .then((res) => res.data);
}

export function createQuestion(body: CreateQuestionBody): Promise<{ id: string; message: string }> {
  return request.post('/api/admin/questions', body).then((res) => res.data);
}

export function updateQuestion(id: string, body: UpdateQuestionBody): Promise<{ message: string }> {
  return request.put(`/api/admin/questions/${id}`, body).then((res) => res.data);
}

export function deleteQuestion(id: string): Promise<{ message: string }> {
  return request.delete(`/api/admin/questions/${id}`).then((res) => res.data);
}
