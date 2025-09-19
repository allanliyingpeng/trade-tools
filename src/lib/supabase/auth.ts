import { supabase } from './client'
import type { SignInCredentials, SignUpCredentials } from '@/types/auth'

export const authService = {
  async signIn({ email, password }: SignInCredentials) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // 提供更友好的错误信息
        if (error.message.includes('Invalid login credentials')) {
          return { data, error: { ...error, message: '邮箱或密码错误' } }
        }
        if (error.message.includes('Email not confirmed')) {
          return { data, error: { ...error, message: '请先验证您的邮箱地址' } }
        }
        return { data, error: { ...error, message: error.message } }
      }

      return { data, error }
    } catch (err) {
      return { data: null, error: { message: '登录失败，请重试' } }
    }
  },

  async signUp({ email, password, displayName }: SignUpCredentials) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName || email.split('@')[0],
          },
        },
      })

      if (error) {
        // 提供更友好的错误信息
        if (error.message.includes('already registered')) {
          return { data, error: { ...error, message: '该邮箱已被注册' } }
        }
        if (error.message.includes('Password should be')) {
          return { data, error: { ...error, message: '密码强度不够，至少需要6个字符' } }
        }
        return { data, error: { ...error, message: error.message } }
      }

      return { data, error }
    } catch (err) {
      return { data: null, error: { message: '注册失败，请重试' } }
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (err) {
      return { error: { message: '退出登录失败' } }
    }
  },

  async resetPassword(email: string) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        return { data, error: { ...error, message: '发送重置邮件失败，请检查邮箱地址' } }
      }

      return { data, error }
    } catch (err) {
      return { data: null, error: { message: '重置密码失败，请重试' } }
    }
  },

  async updatePassword(newPassword: string) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        return { data, error: { ...error, message: '更新密码失败' } }
      }

      return { data, error }
    } catch (err) {
      return { data: null, error: { message: '更新密码失败，请重试' } }
    }
  },

  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      return { session, error }
    } catch (err) {
      return { session: null, error: { message: '获取会话失败' } }
    }
  },

  async getUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      return { user, error }
    } catch (err) {
      return { user: null, error: { message: '获取用户信息失败' } }
    }
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  },
}