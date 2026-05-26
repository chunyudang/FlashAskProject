import { get, post } from './index'

interface Question {
  id: string
  level_id: string
  question: string
  options: string[]
  explanation: string
  tags: string[]
  difficulty: string
  sort_order: number
  correctIndex?: number // 提交后返回正确答案索引
}

interface SubmitPayload {
  levelId: string
  answers: { questionId: string; selectedIndex: number }[]
}

interface SubmitResult {
  score: number
  correct: number
  total: number
  passed: boolean
  passThreshold: number
  explanations: {
    questionId: string
    selectedIndex: number
    correctIndex: number
    isCorrect: boolean
    explanation: string
  }[]
}

export const getQuestions = (levelId: string) =>
  get<{ data: Question[]; total: number }>(`/questions/${levelId}`, {}, true)

export const submitAnswers = (data: SubmitPayload) =>
  post<SubmitResult>('/questions/submit', data, true)
