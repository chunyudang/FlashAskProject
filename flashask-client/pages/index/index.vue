<template>
  <view class="home">
    <view class="header">
      <text class="slogan">5 分钟，给大脑充个电</text>
      <text class="sub-slogan">不背答案，只练思维</text>
    </view>

    <view v-if="loading" class="loading">加载中...</view>

    <view v-else class="category-list">
      <view
        v-for="cat in categories"
        :key="cat.id"
        class="category-card"
        @tap="goToLevels(cat)"
        hover-class="category-card-hover"
      >
        <text class="category-icon">{{ cat.icon || '📚' }}</text>
        <view class="category-info">
          <text class="category-name">{{ cat.name }}</text>
          <text class="category-desc">{{ cat.description || '' }}</text>
        </view>
        <text class="arrow">›</text>
      </view>
    </view>

    <view v-if="!isLoggedIn()" class="login-tip">
      <text>登录后可记录答题进度</text>
      <button class="login-btn" @tap="goLogin">去登录</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCategories } from '../../api/categories'
import { isLoggedIn } from '../../store/user'

interface Category {
  id: string
  name: string
  icon: string
  description: string
  sort_order: number
}

const categories = ref<Category[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await getCategories()
    categories.value = res.data || []
  } catch {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
})

const goToLevels = (cat: Category): void => {
  if (!isLoggedIn()) {
    uni.navigateTo({ url: '/pages/login/login' })
    return
  }
  uni.navigateTo({
    url: `/pages/level/level?categoryId=${cat.id}&categoryName=${encodeURIComponent(cat.name)}`
  })
}

const goLogin = (): void => {
  uni.navigateTo({ url: '/pages/login/login' })
}
</script>

<style scoped>
.home { min-height: 100vh; background: #f5f7fa; }
.header {
  padding: 48rpx 32rpx 32rpx;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  text-align: center;
}
.slogan { display: block; font-size: 40rpx; font-weight: 700; color: #fff; margin-bottom: 8rpx; }
.sub-slogan { display: block; font-size: 26rpx; color: rgba(255,255,255,0.8); }
.loading { display: flex; justify-content: center; padding: 100rpx 0; color: #9ca3af; }
.category-list { padding: 24rpx; }
.category-card {
  display: flex; align-items: center; background: #fff; border-radius: 16rpx;
  padding: 28rpx 24rpx; margin-bottom: 16rpx; box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}
.category-card-hover { background: #f9fafb; }
.category-icon { font-size: 48rpx; width: 72rpx; text-align: center; }
.category-info { flex: 1; margin-left: 16rpx; }
.category-name { font-size: 32rpx; font-weight: 600; color: #1f2937; display: block; }
.category-desc { font-size: 24rpx; color: #9ca3af; display: block; margin-top: 4rpx; }
.arrow { font-size: 40rpx; color: #d1d5db; }
.login-tip { text-align: center; padding: 32rpx; color: #9ca3af; font-size: 26rpx; }
.login-btn {
  margin-top: 16rpx; width: 200rpx; height: 64rpx; line-height: 64rpx;
  font-size: 26rpx; color: #fff; background: #2563eb; border-radius: 32rpx; border: none;
}
</style>
