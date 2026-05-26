<template>
  <view class="quiz">
    <view v-if="qs.loading" class="loading">加载中...</view>

    <view v-else-if="qs.questions.length > 0" class="quiz-content">
      <view class="progress-bar">
        <view class="progress-fill" :style="{ width: ((qs.currentIndex + 1) / qs.questions.length * 100) + '%' }" />
      </view>
      <text class="progress-text">第 {{ qs.currentIndex + 1 }}/{{ qs.questions.length }} 题</text>

      <view class="question-card">
        <text class="question-title">{{ qs.questions[qs.currentIndex]?.question }}</text>
      </view>

      <view class="options">
        <view
          v-for="(option, index) in qs.questions[qs.currentIndex]?.options"
          :key="index"
          class="option-item"
          :class="{
            'option-selected': qs.answers[qs.currentIndex]?.selectedIndex === index,
            'option-correct': submitted && index === correctIndex,
            'option-wrong': submitted && qs.answers[qs.currentIndex]?.selectedIndex === index && index !== correctIndex
          }"
          @tap="selectOption(index)"
        >
          <text class="option-label">{{ ['A', 'B', 'C', 'D'][index] }}</text>
          <text class="option-text">{{ option }}</text>
          <text v-if="submitted && index === correctIndex" class="option-mark">✓</text>
          <text v-else-if="submitted && qs.answers[qs.currentIndex]?.selectedIndex === index && index !== correctIndex" class="option-mark">✗</text>
        </view>
      </view>

      <view v-if="submitted && qs.questions[qs.currentIndex]?.explanation" class="explanation">
        <text class="explanation-title">解析：</text>
        <text class="explanation-text">{{ qs.questions[qs.currentIndex]?.explanation }}</text>
      </view>

      <view class="actions">
        <button
          v-if="!submitted"
          class="btn-confirm"
          :disabled="(qs.answers[qs.currentIndex]?.selectedIndex ?? -1) < 0"
          @tap="confirmAnswer"
        >
          {{ isLastQuestion ? '提交本题' : '下一题' }}
        </button>
        <button v-else class="btn-next" @tap="goNext">
          {{ isLastQuestion ? '查看结果' : '下一题' }}
        </button>
      </view>
    </view>

    <view v-else class="empty"><text>暂无题目</text></view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { quizState, fetchQuestions, selectAnswer as selectAns, nextQuestion, submit as submitQuiz } from '../../store/quiz'

const qs = quizState
const submitted = ref(false)

const isLastQuestion = computed(() => qs.currentIndex >= qs.questions.length - 1)
const correctIndex = computed(() => qs.questions[qs.currentIndex]?.correctIndex ?? -1)

onMounted(() => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as any
  const query = page.$page?.options || page.options || {}
  qs.levelId = query.levelId || ''
  qs.levelName = decodeURIComponent(query.levelName || '')
  qs.categoryName = decodeURIComponent(query.categoryName || '')
  uni.setNavigationBarTitle({ title: qs.levelName || '答题' })
  loadQuestions()
})

const loadQuestions = async (): Promise<void> => {
  await fetchQuestions(qs.levelId)
}

const selectOption = (index: number): void => {
  if (submitted.value) return
  selectAns(index)
}

const confirmAnswer = (): void => {
  const ans = qs.answers[qs.currentIndex]
  if (!ans || ans.selectedIndex < 0) return
  submitted.value = true
  if (!isLastQuestion.value) {
    setTimeout(() => {
      nextQuestion()
      submitted.value = false
    }, 1200)
  }
}

const goNext = (): void => {
  if (isLastQuestion.value) {
    submitAll()
  } else {
    nextQuestion()
    submitted.value = false
  }
}

const submitAll = async (): Promise<void> => {
  uni.showLoading({ title: '提交中...' })
  const ok = await submitQuiz()
  uni.hideLoading()
  if (ok && qs.result) {
    const r = qs.result
    uni.redirectTo({
      url: `/pages/result/result?score=${r.score}&correct=${r.correct}&total=${r.total}&passed=${r.passed}`
    })
  }
}
</script>

<style scoped>
.quiz { min-height: 100vh; background: #f5f7fa; padding: 24rpx; }
.loading, .empty { display: flex; justify-content: center; padding: 100rpx 0; color: #9ca3af; font-size: 28rpx; }
.progress-bar { height: 8rpx; background: #e5e7eb; border-radius: 4rpx; margin-bottom: 8rpx; }
.progress-fill { height: 100%; background: #2563eb; border-radius: 4rpx; transition: width 0.3s; }
.progress-text { font-size: 24rpx; color: #9ca3af; display: block; margin-bottom: 24rpx; }
.question-card { background: #fff; border-radius: 16rpx; padding: 36rpx 28rpx; margin-bottom: 24rpx; box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04); }
.question-title { font-size: 34rpx; font-weight: 500; color: #1f2937; line-height: 1.6; }
.option-item {
  display: flex; align-items: center; background: #fff; border-radius: 12rpx;
  padding: 24rpx; margin-bottom: 16rpx; border: 2rpx solid #e5e7eb;
}
.option-selected { border-color: #2563eb; background: #eff6ff; }
.option-correct { border-color: #10b981; background: #d1fae5; }
.option-wrong { border-color: #ef4444; background: #fee2e2; }
.option-label {
  width: 48rpx; height: 48rpx; line-height: 48rpx; text-align: center; border-radius: 50%;
  background: #f3f4f6; font-size: 26rpx; font-weight: 600; color: #6b7280; margin-right: 16rpx;
}
.option-selected .option-label { background: #2563eb; color: #fff; }
.option-correct .option-label { background: #10b981; color: #fff; }
.option-wrong .option-label { background: #ef4444; color: #fff; }
.option-text { flex: 1; font-size: 28rpx; color: #374151; }
.option-mark { font-size: 32rpx; font-weight: 700; margin-left: 8rpx; }
.option-correct .option-mark { color: #10b981; }
.option-wrong .option-mark { color: #ef4444; }
.explanation { background: #fffbeb; border-radius: 12rpx; padding: 20rpx; margin-bottom: 24rpx; }
.explanation-title { font-size: 24rpx; font-weight: 600; color: #92400e; }
.explanation-text { font-size: 26rpx; color: #78350f; line-height: 1.5; margin-top: 8rpx; display: block; }
.btn-confirm, .btn-next { width: 100%; height: 88rpx; line-height: 88rpx; font-size: 32rpx; border-radius: 12rpx; border: none; }
.btn-confirm { background: #2563eb; color: #fff; }
.btn-confirm[disabled] { opacity: 0.5; }
.btn-next { background: #10b981; color: #fff; }
</style>
