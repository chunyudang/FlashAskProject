/**
 * 答题状态管理（纯 TS + reactive）
 */
import { reactive } from 'vue'
import { getQuestions as apiGetQuestions, submitAnswers as apiSubmit } from '../api/questions'

interface Answer {
  questionId: string
  selectedIndex: number
}

interface Question {
  id: string
  question: string
  options: string[]
  explanation: string
  correctIndex?: number
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

interface QuizState {
  questions: Question[]
  answers: Answer[]
  currentIndex: number
  loading: boolean
  result: SubmitResult | null
  levelId: string
  levelName: string
  categoryName: string
}

// ===== 响应式状态 =====
const state = reactive<QuizState>({
  questions: [],
  answers: [],
  currentIndex: 0,
  loading: false,
  result: null,
  levelId: '',
  levelName: '',
  categoryName: ''
})

// ===== 方法（纯箭头函数） =====
export const fetchQuestions = async (id: string): Promise<boolean> => {
  state.loading = true
  try {
    const res = await apiGetQuestions(id)
    state.questions = res.data || []
    state.answers = state.questions.map((q): Answer => ({ questionId: q.id, selectedIndex: -1 }))
    state.currentIndex = 0
    state.result = null
    return true
  } catch (e: any) {
    uni.showToast({ title: e.message || '加载失败', icon: 'none' })
    return false
  } finally {
    state.loading = false
  }
}

export const selectAnswer = (index: number): void => {
  if (state.answers[state.currentIndex]) {
    state.answers[state.currentIndex].selectedIndex = index
  }
}

export const nextQuestion = (): void => {
  if (state.currentIndex < state.questions.length - 1) state.currentIndex++
}

export const prevQuestion = (): void => {
  if (state.currentIndex > 0) state.currentIndex--
}

export const submit = async (): Promise<boolean> => {
  state.loading = true
  try {
    const res = await apiSubmit({
      levelId: state.levelId,
      answers: state.answers.filter((a) => a.selectedIndex >= 0)
    })
    state.result = res
    return true
  } catch (e: any) {
    uni.showToast({ title: e.message || '提交失败', icon: 'none' })
    return false
  } finally {
    state.loading = false
  }
}

export const resetQuiz = (): void => {
  state.questions = []
  state.answers = []
  state.currentIndex = 0
  state.result = null
  state.levelId = ''
  state.levelName = ''
  state.categoryName = ''
}

export { state as quizState }
