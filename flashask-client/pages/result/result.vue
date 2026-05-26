<template>
  <view class="result">
    <view class="result-header" :class="{ 'result-passed': passed, 'result-failed': !passed }">
      <text class="result-emoji">{{ passed ? '🎉' : '😅' }}</text>
      <text class="result-title">{{ passed ? '恭喜通关！' : '再接再厉！' }}</text>
      <text class="result-subtitle">{{ passed ? '你已经掌握了这一关的知识' : '答对 4 题以上即可过关' }}</text>
    </view>

    <view class="score-card">
      <view class="score-item">
        <text class="score-value">{{ score }}</text>
        <text class="score-label">总分</text>
      </view>
      <view class="score-divider" />
      <view class="score-item">
        <text class="score-value correct">{{ correct }}</text>
        <text class="score-label">答对</text>
      </view>
      <view class="score-divider" />
      <view class="score-item">
        <text class="score-value wrong">{{ total - correct }}</text>
        <text class="score-label">答错</text>
      </view>
    </view>

    <view class="explanations">
      <text class="section-title">答案解析</text>
      <view v-if="explanations.length > 0" class="explanation-list">
        <view v-for="(item, index) in explanations" :key="item.questionId" class="explanation-item">
          <view class="explanation-header">
            <text class="question-number">第 {{ index + 1 }} 题</text>
            <text class="badge" :class="item.isCorrect ? 'badge-correct' : 'badge-wrong'">
              {{ item.isCorrect ? '正确' : '错误' }}
            </text>
          </view>
          <text v-if="!item.isCorrect && item.explanation" class="explanation-text">{{ item.explanation }}</text>
        </view>
      </view>
    </view>

    <view class="actions">
      <button class="btn-retry" @tap="retry">重新挑战</button>
      <button class="btn-back" @tap="backToLevels">返回关卡</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { quizState, resetQuiz, fetchQuestions } from '../../store/quiz'

const qs = quizState
const score = ref(0)
const correct = ref(0)
const total = ref(6)
const passed = ref(false)

const explanations = qs.result?.explanations || []

onMounted(() => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as any
  const query = page.$page?.options || page.options || {}
  score.value = parseInt(query.score) || 0
  correct.value = parseInt(query.correct) || 0
  total.value = parseInt(query.total) || 6
  passed.value = query.passed === 'true'
})

const retry = (): void => {
  resetQuiz()
  uni.redirectTo({
    url: `/pages/quiz/quiz?levelId=${qs.levelId}&levelName=${encodeURIComponent(qs.levelName)}&categoryName=${encodeURIComponent(qs.categoryName)}`
  })
}

const backToLevels = (): void => {
  resetQuiz()
  uni.navigateBack()
}
</script>

<style scoped>
.result { min-height: 100vh; background: #f5f7fa; padding-bottom: 48rpx; }
.result-header { text-align: center; padding: 64rpx 32rpx 48rpx; }
.result-passed { background: linear-gradient(135deg, #10b981, #059669); }
.result-failed { background: linear-gradient(135deg, #f59e0b, #d97706); }
.result-emoji { font-size: 80rpx; display: block; }
.result-title { font-size: 44rpx; font-weight: 700; color: #fff; display: block; margin-top: 16rpx; }
.result-subtitle { font-size: 26rpx; color: rgba(255,255,255,0.8); display: block; margin-top: 8rpx; }
.score-card {
  display: flex; justify-content: space-around; background: #fff;
  margin: -24rpx 24rpx 24rpx; border-radius: 16rpx; padding: 32rpx 0; box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.06);
}
.score-item { text-align: center; flex: 1; }
.score-value { font-size: 44rpx; font-weight: 700; color: #1f2937; display: block; }
.score-value.correct { color: #10b981; }
.score-value.wrong { color: #ef4444; }
.score-label { font-size: 24rpx; color: #9ca3af; display: block; margin-top: 4rpx; }
.score-divider { width: 2rpx; background: #e5e7eb; }
.explanations { padding: 0 24rpx; }
.section-title { font-size: 30rpx; font-weight: 600; color: #1f2937; display: block; margin-bottom: 16rpx; }
.explanation-item { background: #fff; border-radius: 12rpx; padding: 20rpx; margin-bottom: 12rpx; }
.explanation-header { display: flex; justify-content: space-between; align-items: center; }
.question-number { font-size: 26rpx; font-weight: 500; color: #6b7280; }
.badge { font-size: 22rpx; padding: 4rpx 16rpx; border-radius: 20rpx; }
.badge-correct { background: #d1fae5; color: #059669; }
.badge-wrong { background: #fee2e2; color: #dc2626; }
.explanation-text { font-size: 24rpx; color: #6b7280; display: block; margin-top: 8rpx; line-height: 1.5; }
.actions { padding: 24rpx; }
.btn-retry, .btn-back { width: 100%; height: 88rpx; line-height: 88rpx; font-size: 32rpx; border-radius: 12rpx; border: none; margin-bottom: 16rpx; }
.btn-retry { background: #2563eb; color: #fff; }
.btn-back { background: #fff; color: #2563eb; border: 2rpx solid #2563eb; }
</style>
