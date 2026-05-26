/**
 * 用户状态管理（纯 TS + reactive，无 Pinia 依赖）
 */
import { reactive } from 'vue'
import { login as apiLogin, register as apiRegister } from '../api/auth'

interface UserInfo {
  id: string
  nickname: string
  phone: string
}

interface UserState {
  token: string
  user: UserInfo | null
}

// ===== 响应式状态 =====
const state = reactive<UserState>({
  token: uni.getStorageSync('token') || '',
  user: uni.getStorageSync('user') || null
})

// ===== 计算属性等价函数 =====
export const isLoggedIn = (): boolean => !!state.token

export const getUser = (): UserInfo | null => state.user

export const getToken = (): string => state.token

// ===== 方法 =====
export const restoreToken = (): void => {
  state.token = uni.getStorageSync('token') || ''
  state.user = uni.getStorageSync('user') || null
}

export const doLogin = async (phone: string): Promise<{ success: boolean; needRegister?: boolean; message?: string }> => {
  try {
    const res = await apiLogin({ phone })
    state.token = res.token
    state.user = res.user
    uni.setStorageSync('token', res.token)
    uni.setStorageSync('user', res.user)
    return { success: true }
  } catch (e: any) {
    if (e.message === '手机号未注册') return { success: false, needRegister: true }
    return { success: false, message: e.message }
  }
}

export const doRegister = async (phone: string, nickname: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const res = await apiRegister({ phone, nickname })
    state.token = res.token
    state.user = res.user
    uni.setStorageSync('token', res.token)
    uni.setStorageSync('user', res.user)
    return { success: true }
  } catch (e: any) {
    return { success: false, message: e.message }
  }
}

export const logout = (): void => {
  state.token = ''
  state.user = null
  uni.removeStorageSync('token')
  uni.removeStorageSync('user')
  uni.reLaunch({ url: '/pages/login/login' })
}

export { state as userState }
