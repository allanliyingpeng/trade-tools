export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserProfile
        Insert: Omit<UserProfile, 'created_at'>
        Update: Partial<Omit<UserProfile, 'id' | 'created_at'>>
      }
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'user_id' | 'created_at' | 'updated_at'>>
      }
      trades: {
        Row: Trade
        Insert: Omit<Trade, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Trade, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
      }
      user_usage_limits: {
        Row: UserUsageLimit
        Insert: Omit<UserUsageLimit, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserUsageLimit, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
      }
      workflow_usage_logs: {
        Row: WorkflowUsageLog
        Insert: Omit<WorkflowUsageLog, 'id' | 'created_at'>
        Update: Partial<Omit<WorkflowUsageLog, 'id' | 'created_at'>>
      }
    }
  }
}

export interface UserProfile {
  id: string
  email: string
  created_at: string
  subscription_tier: 'free' | 'premium' | 'pro'
  subscription_expires_at?: string
}

export interface Profile {
  user_id: string
  display_name?: string
  avatar_url?: string
  bio?: string
  website?: string
  location?: string
  created_at: string
  updated_at: string
}

export interface Trade {
  id: string
  user_id: string
  symbol: string
  type: 'buy' | 'sell'
  quantity: number
  price: number
  total_amount: number
  status: 'pending' | 'completed' | 'cancelled'
  notes?: string
  executed_at?: string
  created_at: string
  updated_at: string
}

export interface Portfolio {
  id: string
  user_id: string
  name: string
  description?: string
  total_value: number
  total_cost: number
  profit_loss: number
  profit_loss_percentage: number
  created_at: string
  updated_at: string
}

export interface Position {
  id: string
  user_id: string
  portfolio_id?: string
  symbol: string
  quantity: number
  average_price: number
  current_price: number
  market_value: number
  profit_loss: number
  profit_loss_percentage: number
  created_at: string
  updated_at: string
}

export interface UserUsageLimit {
  id: string
  user_id: string
  workflow_id?: string
  limit_type: 'daily' | 'monthly' | 'total'
  limit_count: number
  used_count: number
  reset_at?: string
  created_at: string
  updated_at: string
}

export interface WorkflowUsageLog {
  id: string
  user_id: string
  workflow_id: string
  workflow_run_id: string
  tokens_used: number
  execution_time: number
  status: 'success' | 'failed'
  error_message?: string
  request_data?: any
  response_data?: any
  created_at: string
}

export type User = Profile