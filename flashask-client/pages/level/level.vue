<template>
  <view class="levels">
    <view class="header">
      <text class="category-name">{{ categoryName }}</text>
      <text class="progress-text">已完成 {{ completedCount }}/{{ levels.length }} 关</text>
    </view>

    <view v-if="loading" class="loading">加载中...</view>

    <view v-else class="level-list">
      <view
        v-for="(level, index) in levels"
        :key="level.id"
        class="level-card"
        :class="{
          'level-completed': level.progress?.status === 'completed',
          'level-locked': level.progress?.status === 'locked',
          'level-current': level.progress?.status === 'unlocked'
        }"
        @tap="enterLevel(level)"
      >
        <view class="level-left">
          <text class="level-number">{{ index + 1 }}</text>
        </view>
        <view class="level-center">
          <text class="level-name">{{ level.name }}</text>
          <text class="level-desc">{{ level.description }}</text>
        </view>
        <view class="level-right">
          <text v-if="level.progress?.status === 'completed'" class="badge-completed">✓</text>
          <text v-else-if="level.progress?.status === 'locked'" class="badge-locked">🔒</text>
          <text v-else class="badge-unlocked">›</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getLevelsWithAuth } from '../../api/levels'

interface LevelProgress {
  status: 'locked' | 'unlocked' | 'completed'
  best_score: number
  completed_at: string | null
}

interface Level {
  id: string
  name: string
  description: string
  level_number: number
  progress: LevelProgress | null
}

const loading = ref(true)
const levels = ref<Level[]>([])
const categoryName = ref('')
const categoryId = ref('')

const completedCount = computed(() =>
  levels.value.filter((l) => l.progress?.status === 'completed').length
)

onMounted(() => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as any
  const query = page.$page?.options || page.options || {}
  categoryId.value = query.categoryId || ''
  categoryName.value = decodeURIComponent(query.categoryName || '')
  uni.setNavigationBarTitle({ title: categoryName.value })
  loadLevels()
})

const loadLevels = async (): Promise<void> => {
  try {
    const res = await getLevelsWithAuth(categoryId.value)
    levels.value = res.data || []
  } catch {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const enterLevel = (level: Level): void => {
  if (level.progress?.status === 'locked') {
    uni.showToast({ title: '请先完成上一关', icon: 'none' })
    return
  }
  uni.navigateTo({
    url: `/pages/quiz/quiz?levelId=${level.id}&levelName=${encodeURIComponent(level.name)}&categoryName=${encodeURIComponent(categoryName.value)}`
  })
}
</script>

<style scoped>
.levels { min-height: 100vh; background: #f5f7fa; }
.header { padding: 32rpx; background: #fff; margin-bottom: 16rpx; }
.category-name { font-size: 36rpx; font-weight: 700; color: #1f2937; display: block; }
.progress-text { font-size: 24rpx; color: #9ca3af; display: block; margin-top: 8rpx; }
.loading { text-align: center; padding: 100rpx 0; color: #9ca3af; }
.level-list { padding: 0 24rpx 24rpx; }
.level-card {
  display: flex; align-items: center; background: #fff; border-radius: 16rpx;
  padding: 24rpx; margin-bottom: 16rpx; box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}
.level-completed { border-left: 6rpx solid #10b981; }
.level-current { border-left: 6rpx solid #2563eb; }
.level-locked { opacity: 0.5; }
.level-left {
  width: 64rpx; height: 64rpx; border-radius: 50%; background: #eff6ff;
  display: flex; align-items: center; justify-content: center; margin-right: 16rpx;
}
.level-completed .level-left { background: #d1fae5; }
.level-number { font-size: 28rpx; font-weight: 700; color: #2563eb; }
.level-completed .level-number { color: #10b981; }
.level-center { flex: 1; }
.level-name { font-size: 30rpx; font-weight: 500; color: #1f2937; display: block; }
.level-desc { font-size: 24rpx; color: #9ca3af; display: block; margin-top: 4rpx; }
.badge-completed { font-size: 32rpx; color: #10b981; font-weight: 700; }
.badge-locked { font-size: 28rpx; }
.badge-unlocked { font-size: 40rpx; color: #2563eb; }
</style>
