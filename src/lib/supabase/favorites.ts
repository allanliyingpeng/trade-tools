import { supabase } from './client'

export interface UserFavoriteTerm {
  id: string
  user_id: string
  term_id: string
  created_at: string
}

export const favoritesService = {
  // 获取用户收藏的术语列表
  async getUserFavorites(userId: string): Promise<{ data: UserFavoriteTerm[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('user_favorite_terms')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      return { data, error }
    } catch (err) {
      return { data: null, error: { message: '获取收藏列表失败' } }
    }
  },

  // 添加收藏
  async addFavorite(userId: string, termId: string): Promise<{ data: UserFavoriteTerm | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('user_favorite_terms')
        .insert({
          user_id: userId,
          term_id: termId,
        })
        .select()
        .single()

      return { data, error }
    } catch (err) {
      return { data: null, error: { message: '添加收藏失败' } }
    }
  },

  // 取消收藏
  async removeFavorite(userId: string, termId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('user_favorite_terms')
        .delete()
        .eq('user_id', userId)
        .eq('term_id', termId)

      return { error }
    } catch (err) {
      return { error: { message: '取消收藏失败' } }
    }
  },

  // 检查是否已收藏
  async isFavorited(userId: string, termId: string): Promise<{ data: boolean; error: any }> {
    try {
      const { data, error } = await supabase
        .from('user_favorite_terms')
        .select('id')
        .eq('user_id', userId)
        .eq('term_id', termId)
        .single()

      return { data: !!data, error: error?.code === 'PGRST116' ? null : error }
    } catch (err) {
      return { data: false, error: { message: '检查收藏状态失败' } }
    }
  },

  // 批量获取收藏状态
  async getFavoriteStatus(userId: string, termIds: string[]): Promise<{ data: Record<string, boolean>; error: any }> {
    try {
      const { data, error } = await supabase
        .from('user_favorite_terms')
        .select('term_id')
        .eq('user_id', userId)
        .in('term_id', termIds)

      if (error) {
        return { data: {}, error }
      }

      const favoriteMap: Record<string, boolean> = {}
      termIds.forEach(termId => {
        favoriteMap[termId] = data.some(item => item.term_id === termId)
      })

      return { data: favoriteMap, error: null }
    } catch (err) {
      return { data: {}, error: { message: '获取收藏状态失败' } }
    }
  },

  // 获取收藏统计
  async getFavoriteCount(userId: string): Promise<{ data: number; error: any }> {
    try {
      const { count, error } = await supabase
        .from('user_favorite_terms')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      return { data: count || 0, error }
    } catch (err) {
      return { data: 0, error: { message: '获取收藏统计失败' } }
    }
  }
}