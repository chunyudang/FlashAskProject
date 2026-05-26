import { get, post } from './index'

interface ProgressItem {
  id: string
  level_id: string
  status: string
  best_score: number
  attempts: number
  completed_at: string | null
  level_name: string
  level_number: number
  category_id: string
  category_name: string
}

interface ProgressStats {
  total_score: number
  total_correct: number
  total_wrong: number
  completed_levels: number
  total_levels: number
}

interface ProgressResponse {
  data: ProgressItem[]
  stats: ProgressStats
}

export const getProgress = () =>
  get<ProgressResponse>('/progress', {}, true)

export const unlockLevel = (levelId: string) =>
  post<{ success: boolean; message: string }>('/progress/unlock', { levelId }, true)
