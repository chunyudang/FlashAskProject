import { reactive } from 'vue'
import { login as apiLogin, register as apiRegister, verify as apiVerify } from '../api/auth'

interface UserInfo {
  id: string
  nickname: string
  phone: string
}

interface UserState {
  token: string
  dbToken: string
  user: UserInfo | null
}

const state = reactive<UserState>({
  token: uni.getStorageSync('token') || '',
  dbToken: uni.getStorageSync('dbToken') || '',
  user: uni.getStorageSync('user') || null
})

export const isLoggedIn = (): boolean => !!state.token
export const getUser = (): UserInfo | null => state.user
export const getToken = (): string => state.token
export const getDbToken = (): string => state.dbToken

export const restoreToken = (): void => {
  state.token = uni.getStorageSync('token') || ''
  state.dbToken = uni.getStorageSync('dbToken') || ''
  state.user = uni.getStorageSync('user') || null
}

export const doLogin = async (phone: string, password: string): Promise<{ success: boolean; needRegister?: boolean; message?: string }> => {
  try {
    const res = await apiLogin({ phone, password })
    state.token = res.token
    state.dbToken = res.dbToken || ''
    state.user = res.user
    uni.setStorageSync('token', res.token)
    uni.setStorageSync('dbToken', res.dbToken || '')
    uni.setStorageSync('user', res.user)
    return { success: true }
  } catch (e: any) {
    if (e.message === '该手机号未注册') return { success: false, needRegister: true }
    return { success: false, message: e.message || '登录失败' }
  }
}

export const doRegister = async (phone: string, password: string, nickname: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const res = await apiRegister({ phone, password, nickname })
    state.token = res.token
    state.dbToken = res.dbToken || ''
    state.user = res.user
    uni.setStorageSync('token', res.token)
    uni.setStorageSync('dbToken', res.dbToken || '')
    uni.setStorageSync('user', res.user)
    return { success: true }
  } catch (e: any) {
    return { success: false, message: e.message || '注册失败' }
  }
}

export const doVerify = async (): Promise<boolean> => {
  const storedDbToken = uni.getStorageSync('dbToken') as string
  if (!storedDbToken) return false

  try {
    const res = await apiVerify({ dbToken: storedDbToken })
    state.token = res.token
    state.dbToken = storedDbToken
    state.user = res.user
    uni.setStorageSync('token', res.token)
    uni.setStorageSync('user', res.user)
    return true
  } catch {
    // Token invalid — clear everything
    state.token = ''
    state.dbToken = ''
    state.user = null
    uni.removeStorageSync('token')
    uni.removeStorageSync('dbToken')
    uni.removeStorageSync('user')
    return false
  }
}

export const logout = (): void => {
  state.token = ''
  state.dbToken = ''
  state.user = null
  uni.removeStorageSync('token')
  uni.removeStorageSync('dbToken')
  uni.removeStorageSync('user')
  uni.reLaunch({ url: '/pages/index/index' })
}

export { state as userState }
