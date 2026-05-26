import { get } from './index'

interface LevelProgress {
  status: 'locked' | 'unlocked' | 'completed'
  best_score: number
  completed_at: string | null
}

interface Level {
  id: string
  category_id: string
  name: string
  level_number: number
  pass_threshold: number
  description: string
  progress: LevelProgress | null
}

export const getLevels = (categoryId: string) =>
  get<{ data: Level[] }>(`/levels/${categoryId}`, {}, false)

export const getLevelsWithAuth = (categoryId: string) =>
  get<{ data: Level[] }>(`/levels/${categoryId}`, {}, true)
