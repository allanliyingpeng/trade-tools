import { supabase } from './client'

export const databaseService = {
  // User profile operations
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    return { data, error }
  },

  async updateProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()
    return { data, error }
  },

  // Trading operations
  async getTrades(userId: string) {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async createTrade(trade: any) {
    const { data, error } = await supabase
      .from('trades')
      .insert(trade)
      .select()
      .single()
    return { data, error }
  },

  async updateTrade(tradeId: string, updates: any) {
    const { data, error } = await supabase
      .from('trades')
      .update(updates)
      .eq('id', tradeId)
      .select()
      .single()
    return { data, error }
  },

  async deleteTrade(tradeId: string) {
    const { error } = await supabase
      .from('trades')
      .delete()
      .eq('id', tradeId)
    return { error }
  },
}