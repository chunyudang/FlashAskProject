<template>
  <view class="login">
    <view class="login-box">
      <text class="title">欢迎来到闪问</text>
      <text class="subtitle">通识知识问答游戏</text>

      <input class="phone-input" type="text" maxlength="11" :value="phone" @input="onPhoneInput" placeholder="请输入手机号"
        placeholder-class="placeholder" />

      <input class="password-input" type="password" maxlength="20" :value="password" @input="onPasswordInput"
        placeholder="请输入密码" placeholder-class="placeholder" />

      <button class="submit-btn" :loading="loading" :disabled="loading" @tap="handleSubmit">
        登录
      </button>

      <text class="register-link" @tap="goRegister">还没有账号？立即注册</text>

      <text class="error" v-if="errorMsg">{{ errorMsg }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { doLogin } from '../../store/user'

const phone = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

const onPhoneInput = (e: any): void => {
  phone.value = e.detail.value
  errorMsg.value = ''
}

const onPasswordInput = (e: any): void => {
  password.value = e.detail.value
  errorMsg.value = ''
}

const handleSubmit = async (): Promise<void> => {
  if (!/^1\d{10}$/.test(phone.value)) {
    errorMsg.value = '请输入正确的手机号'
    return
  }
  if (!password.value) {
    errorMsg.value = '请输入密码'
    return
  }

  loading.value = true
  errorMsg.value = ''

  const res = await doLogin(phone.value, password.value)
  if (res.success) {
    uni.navigateBack()
  } else if (res.needRegister) {
    uni.navigateTo({ url: `/pages/register/register?phone=${phone.value}` })
  } else {
    errorMsg.value = res.message || '登录失败'
  }

  loading.value = false
}

const goRegister = (): void => {
  uni.navigateTo({ url: `/pages/register/register?phone=${phone.value}` })
}
</script>

<style scoped>
.login {
  min-height: 100vh;
  background: linear-gradient(180deg, #EEF2FF 0%, #F5F7FA 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 48rpx;
}

.login-box {
  width: 100%;
  background: #fff;
  border-radius: 24rpx;
  padding: 64rpx 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.06);
}

.title {
  font-size: 40rpx;
  font-weight: 700;
  color: #1f2937;
  display: block;
  text-align: center;
}

.subtitle {
  font-size: 26rpx;
  color: #9ca3af;
  display: block;
  text-align: center;
  margin-top: 8rpx;
  margin-bottom: 48rpx;
}

.phone-input,
.password-input {
  width: 100%;
  height: 88rpx;
  border: 2rpx solid #e5e7eb;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  box-sizing: border-box;
  margin-bottom: 24rpx;
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border-radius: 12rpx;
  border: none;
  margin-top: 16rpx;
}

.submit-btn[disabled] {
  opacity: 0.6;
}

.error {
  display: block;
  text-align: center;
  color: #ef4444;
  font-size: 26rpx;
  margin-top: 20rpx;
}

.register-link {
  display: block;
  text-align: center;
  color: #2563eb;
  font-size: 26rpx;
  margin-top: 32rpx;
  text-decoration: underline;
}

.placeholder {
  color: #d1d5db;
  font-size: 28rpx;
}
</style>
