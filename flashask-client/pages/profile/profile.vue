<template>
  <view class="profile">
    <view class="user-card">
      <view class="avatar">
        <text class="avatar-text">{{ avatarText }}</text>
      </view>
      <view class="user-info">
        <text class="nickname">{{ getUser()?.nickname || '未登录' }}</text>
        <text class="phone">{{ maskPhone(getUser()?.phone || '') }}</text>
      </view>
    </view>

    <view v-if="stats" class="stats-card">
      <view class="stat-item">
        <text class="stat-value">{{ stats.total_score || 0 }}</text>
        <text class="stat-label">总得分</text>
      </view>
      <view class="stat-divider" />
      <view class="stat-item">
        <text class="stat-value">{{ stats.completed_levels || 0 }}/{{ stats.total_levels || 25 }}</text>
        <text class="stat-label">通关进度</text>
      </view>
      <view class="stat-divider" />
      <view class="stat-item">
        <text class="stat-value correct">{{ stats.total_correct || 0 }}</text>
        <text class="stat-label">答对</text>
      </view>
      <view class="stat-divider" />
      <view class="stat-item">
        <text class="stat-value wrong">{{ stats.total_wrong || 0 }}</text>
        <text class="stat-label">答错</text>
      </view>
    </view>

    <view class="menu-list">
      <view class="menu-item" @tap="goToCategory">
        <text class="menu-icon">📖</text>
        <text class="menu-text">学科选择</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <view v-if="isLoggedIn()" class="logout-section">
      <button class="logout-btn" @tap="handleLogout">退出登录</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { isLoggedIn, getUser, logout } from '../../store/user'
import { getProgress } from '../../api/progress'

interface Stats {
  total_score: number
  total_correct: number
  total_wrong: number
  completed_levels: number
  total_levels: number
}

const stats = ref<Stats | null>(null)

const avatarText = getUser()?.nickname?.charAt(0) || '?'

const maskPhone = (phone: string): string => {
  if (!phone || phone.length < 11) return ''
  return phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
}

const loadStats = async (): Promise<void> => {
  if (isLoggedIn()) {
    try {
      const res = await getProgress()
      stats.value = res.stats || null
    } catch (e) {
      console.error('Failed to load progress', e)
    }
  }
}

onMounted(() => loadStats())

const goToCategory = (): void => {
  uni.navigateTo({ url: '/pages/category/category' })
}

const handleLogout = (): void => {
  uni.showModal({
    title: '提示',
    content: '确定退出登录吗？',
    success: (res) => {
      if (res.confirm) logout()
    }
  })
}
</script>

<style scoped>
.profile { min-height: 100vh; background: #f5f7fa; }
.user-card { display: flex; align-items: center; background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 48rpx 32rpx; }
.avatar { width: 100rpx; height: 100rpx; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; }
.avatar-text { font-size: 44rpx; font-weight: 700; color: #fff; }
.user-info { margin-left: 24rpx; }
.nickname { font-size: 36rpx; font-weight: 600; color: #fff; display: block; }
.phone { font-size: 24rpx; color: rgba(255,255,255,0.7); display: block; margin-top: 4rpx; }
.stats-card { display: flex; background: #fff; margin: -24rpx 24rpx 24rpx; border-radius: 16rpx; padding: 28rpx 0; box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.06); }
.stat-item { flex: 1; text-align: center; }
.stat-value { font-size: 36rpx; font-weight: 700; color: #1f2937; display: block; }
.stat-value.correct { color: #10b981; }
.stat-value.wrong { color: #ef4444; }
.stat-label { font-size: 22rpx; color: #9ca3af; display: block; margin-top: 4rpx; }
.stat-divider { width: 2rpx; background: #e5e7eb; }
.menu-list { background: #fff; margin: 0 24rpx; border-radius: 16rpx; }
.menu-item { display: flex; align-items: center; padding: 28rpx 24rpx; border-bottom: 2rpx solid #f3f4f6; }
.menu-item:last-child { border-bottom: none; }
.menu-icon { font-size: 36rpx; margin-right: 16rpx; }
.menu-text { flex: 1; font-size: 28rpx; color: #1f2937; }
.menu-arrow { font-size: 36rpx; color: #d1d5db; }
.logout-section { padding: 48rpx 24rpx; }
.logout-btn { width: 100%; height: 88rpx; line-height: 88rpx; font-size: 30rpx; color: #ef4444; background: #fff; border-radius: 12rpx; border: none; }
</style>
