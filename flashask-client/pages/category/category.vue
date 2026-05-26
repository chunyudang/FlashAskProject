<template>
  <view class="category-detail">
    <view class="header">
      <text class="title">选择学科</text>
      <text class="subtitle">选择一个学科开始答题</text>
    </view>

    <view v-if="loading" class="loading">加载中...</view>

    <view v-else class="grid">
      <view
        v-for="cat in categories"
        :key="cat.id"
        class="grid-item"
        @tap="goToLevels(cat)"
        hover-class="grid-item-hover"
      >
        <text class="icon">{{ cat.icon || '📚' }}</text>
        <text class="name">{{ cat.name }}</text>
        <text class="desc">{{ cat.description }}</text>
      </view>
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
</script>

<style scoped>
.category-detail { min-height: 100vh; background: #f5f7fa; }
.header { padding: 32rpx; text-align: center; }
.title { font-size: 36rpx; font-weight: 700; color: #1f2937; display: block; }
.subtitle { font-size: 26rpx; color: #9ca3af; display: block; margin-top: 8rpx; }
.loading { text-align: center; padding: 100rpx 0; color: #9ca3af; }
.grid { display: flex; flex-wrap: wrap; padding: 0 16rpx; }
.grid-item {
  width: 45%; margin: 12rpx 2.5%; background: #fff; border-radius: 16rpx;
  padding: 40rpx 20rpx; text-align: center; box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}
.grid-item-hover { background: #f9fafb; }
.icon { font-size: 64rpx; display: block; }
.name { font-size: 30rpx; font-weight: 600; color: #1f2937; display: block; margin-top: 16rpx; }
.desc { font-size: 22rpx; color: #9ca3af; display: block; margin-top: 8rpx; }
</style>
