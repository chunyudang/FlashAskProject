<template>
  <view class="register">
    <view class="register-box">
      <text class="title">创建账号</text>
      <text class="subtitle">注册后开始答题闯关</text>

      <input
        class="phone-input" type="text" maxlength="11"
        :value="phone" @input="onPhoneInput"
        placeholder="请输入手机号" placeholder-class="placeholder"
      />

      <input
        class="nickname-input" type="text" maxlength="12"
        :value="nickname" @input="onNicknameInput"
        placeholder="请输入昵称" placeholder-class="placeholder"
      />

      <input
        class="password-input" type="password" maxlength="20"
        :value="password" @input="onPasswordInput"
        placeholder="请输入密码（至少6位）" placeholder-class="placeholder"
      />

      <input
        class="confirm-input" type="password" maxlength="20"
        :value="confirmPassword" @input="onConfirmInput"
        placeholder="请确认密码" placeholder-class="placeholder"
      />

      <button class="submit-btn" :loading="loading" :disabled="loading" @tap="handleSubmit">
        注册并登录
      </button>

      <text class="login-link" @tap="goLogin">已有账号？去登录</text>

      <text class="error" v-if="errorMsg">{{ errorMsg }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { doRegister } from '../../store/user'

const phone = ref('')
const nickname = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMsg = ref('')

onMounted(() => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as any
  const query = page.$page?.options || page.options || {}
  if (query.phone) {
    phone.value = query.phone
  }
})

const onPhoneInput = (e: any): void => {
  phone.value = e.detail.value
  errorMsg.value = ''
}

const onNicknameInput = (e: any): void => {
  nickname.value = e.detail.value
  errorMsg.value = ''
}

const onPasswordInput = (e: any): void => {
  password.value = e.detail.value
  errorMsg.value = ''
}

const onConfirmInput = (e: any): void => {
  confirmPassword.value = e.detail.value
  errorMsg.value = ''
}

const handleSubmit = async (): Promise<void> => {
  if (!/^1\d{10}$/.test(phone.value)) {
    errorMsg.value = '请输入正确的手机号'
    return
  }
  if (!nickname.value.trim()) {
    errorMsg.value = '请输入昵称'
    return
  }
  if (password.value.length < 6) {
    errorMsg.value = '密码长度不能少于6位'
    return
  }
  if (password.value !== confirmPassword.value) {
    errorMsg.value = '两次密码输入不一致'
    return
  }

  loading.value = true
  errorMsg.value = ''

  const res = await doRegister(phone.value, password.value, nickname.value.trim())

  if (res.success) {
    uni.navigateBack()
  } else {
    errorMsg.value = res.message || '注册失败'
  }

  loading.value = false
}

const goLogin = (): void => {
  uni.navigateBack()
}
</script>

<style scoped>
.register { min-height: 100vh; background: linear-gradient(180deg, #EEF2FF 0%, #F5F7FA 100%); display: flex; align-items: center; justify-content: center; padding: 0 48rpx; }
.register-box { width: 100%; background: #fff; border-radius: 24rpx; padding: 64rpx 40rpx; box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.06); }
.title { font-size: 40rpx; font-weight: 700; color: #1f2937; display: block; text-align: center; }
.subtitle { font-size: 26rpx; color: #9ca3af; display: block; text-align: center; margin-top: 8rpx; margin-bottom: 48rpx; }
.phone-input, .nickname-input, .password-input, .confirm-input { width: 100%; height: 88rpx; border: 2rpx solid #e5e7eb; border-radius: 12rpx; padding: 0 24rpx; font-size: 28rpx; box-sizing: border-box; margin-bottom: 24rpx; }
.submit-btn { width: 100%; height: 88rpx; line-height: 88rpx; font-size: 32rpx; font-weight: 600; color: #fff; background: linear-gradient(135deg, #2563eb, #1d4ed8); border-radius: 12rpx; border: none; margin-top: 16rpx; }
.submit-btn[disabled] { opacity: 0.6; }
.error { display: block; text-align: center; color: #ef4444; font-size: 26rpx; margin-top: 20rpx; }
.login-link { display: block; text-align: center; color: #2563eb; font-size: 26rpx; margin-top: 32rpx; text-decoration: underline; }
.placeholder { color: #d1d5db; font-size: 28rpx; }
</style>
