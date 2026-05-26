<template>
  <view class="login">
    <view class="login-box">
      <text class="title">欢迎来到闪问</text>
      <text class="subtitle">通识知识问答游戏</text>

      <input
        class="phone-input" type="text" maxlength="11"
        :value="phone" @input="onPhoneInput"
        placeholder="请输入手机号" placeholder-class="placeholder"
      />

      <input
        v-if="needRegister"
        class="nickname-input" type="text" maxlength="12"
        :value="nickname" @input="onNicknameInput"
        placeholder="请输入昵称" placeholder-class="placeholder"
      />

      <button class="submit-btn" :loading="loading" :disabled="loading" @tap="handleSubmit">
        {{ needRegister ? '注册并登录' : '登录' }}
      </button>

      <text class="error" v-if="errorMsg">{{ errorMsg }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { doLogin, doRegister } from '../../store/user'

const phone = ref('')
const nickname = ref('')
const needRegister = ref(false)
const loading = ref(false)
const errorMsg = ref('')

const onPhoneInput = (e: any): void => {
  phone.value = e.detail.value
  errorMsg.value = ''
}

const onNicknameInput = (e: any): void => {
  nickname.value = e.detail.value
  errorMsg.value = ''
}

const handleSubmit = async (): Promise<void> => {
  if (!/^1\d{10}$/.test(phone.value)) {
    errorMsg.value = '请输入正确的手机号'
    return
  }
  if (needRegister.value && !nickname.value.trim()) {
    errorMsg.value = '请输入昵称'
    return
  }

  loading.value = true
  errorMsg.value = ''

  if (needRegister.value) {
    const res = await doRegister(phone.value, nickname.value.trim())
    if (res.success) uni.navigateBack()
    else errorMsg.value = res.message || ''
  } else {
    const res = await doLogin(phone.value)
    if (res.success) {
      uni.navigateBack()
    } else if (res.needRegister) {
      needRegister.value = true
    } else {
      errorMsg.value = res.message || ''
    }
  }

  loading.value = false
}
</script>

<style scoped>
.login { display: flex; justify-content: center; align-items: center; min-height: 70vh; padding: 0 48rpx; }
.login-box { width: 100%; text-align: center; }
.title { font-size: 44rpx; font-weight: 700; color: #1f2937; display: block; }
.subtitle { font-size: 28rpx; color: #9ca3af; display: block; margin-top: 12rpx; margin-bottom: 64rpx; }
.phone-input, .nickname-input {
  width: 100%; height: 88rpx; background: #f9fafb; border-radius: 12rpx;
  padding: 0 24rpx; font-size: 30rpx; margin-bottom: 24rpx; box-sizing: border-box;
}
.placeholder { color: #d1d5db; }
.submit-btn {
  width: 100%; height: 88rpx; line-height: 88rpx; background: #2563eb;
  color: #fff; font-size: 32rpx; border-radius: 12rpx; border: none; margin-top: 16rpx;
}
.submit-btn[disabled] { opacity: 0.6; }
.error { display: block; margin-top: 24rpx; font-size: 24rpx; color: #ef4444; }
</style>
