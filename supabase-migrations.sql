-- 创建用户使用限制表
CREATE TABLE IF NOT EXISTS user_usage_limits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    workflow_id TEXT, -- 如果为NULL表示通用限制，否则为特定工作流限制
    limit_type TEXT NOT NULL CHECK (limit_type IN ('daily', 'monthly', 'total')),
    limit_count INTEGER NOT NULL DEFAULT 0,
    used_count INTEGER NOT NULL DEFAULT 0,
    reset_at TIMESTAMPTZ, -- 下次重置时间
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- 确保每个用户每个工作流每种限制类型只有一条记录
    UNIQUE(user_id, workflow_id, limit_type)
);

-- 创建工作流使用日志表
CREATE TABLE IF NOT EXISTS workflow_usage_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    workflow_id TEXT NOT NULL,
    workflow_run_id TEXT NOT NULL,
    tokens_used INTEGER DEFAULT 0,
    execution_time INTEGER DEFAULT 0, -- 执行时间（毫秒）
    status TEXT NOT NULL CHECK (status IN ('success', 'failed')),
    error_message TEXT,
    request_data JSONB, -- 请求数据
    response_data JSONB, -- 响应数据
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_user_usage_limits_user_id ON user_usage_limits(user_id);
CREATE INDEX IF NOT EXISTS idx_user_usage_limits_workflow_id ON user_usage_limits(workflow_id);
CREATE INDEX IF NOT EXISTS idx_user_usage_limits_reset_at ON user_usage_limits(reset_at);

CREATE INDEX IF NOT EXISTS idx_workflow_usage_logs_user_id ON workflow_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_workflow_usage_logs_workflow_id ON workflow_usage_logs(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_usage_logs_created_at ON workflow_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_workflow_usage_logs_user_workflow ON workflow_usage_logs(user_id, workflow_id);

-- 更新 updated_at 触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为 user_usage_limits 表添加 updated_at 触发器
DROP TRIGGER IF EXISTS update_user_usage_limits_updated_at ON user_usage_limits;
CREATE TRIGGER update_user_usage_limits_updated_at
    BEFORE UPDATE ON user_usage_limits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 启用行级安全策略 (RLS)
ALTER TABLE user_usage_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_usage_logs ENABLE ROW LEVEL SECURITY;

-- 用户使用限制表的RLS策略
CREATE POLICY "Users can view their own usage limits" ON user_usage_limits
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage limits" ON user_usage_limits
    FOR UPDATE USING (auth.uid() = user_id);

-- 只允许系统级操作插入和删除使用限制
CREATE POLICY "System can manage usage limits" ON user_usage_limits
    FOR ALL USING (auth.role() = 'service_role');

-- 工作流使用日志表的RLS策略
CREATE POLICY "Users can view their own usage logs" ON workflow_usage_logs
    FOR SELECT USING (auth.uid() = user_id);

-- 只允许系统级操作插入使用日志
CREATE POLICY "System can insert usage logs" ON workflow_usage_logs
    FOR INSERT WITH CHECK (auth.role() = 'service_role' OR auth.uid() = user_id);

-- 创建函数：为新用户初始化默认使用限制
CREATE OR REPLACE FUNCTION initialize_user_limits(user_id UUID)
RETURNS VOID AS $$
BEGIN
    -- 插入默认的每日限制（免费用户每天10次）
    INSERT INTO user_usage_limits (user_id, limit_type, limit_count, reset_at)
    VALUES (
        user_id,
        'daily',
        10,
        (CURRENT_DATE + INTERVAL '1 day')::timestamptz
    )
    ON CONFLICT (user_id, workflow_id, limit_type) DO NOTHING;

    -- 插入默认的月度限制（免费用户每月100次）
    INSERT INTO user_usage_limits (user_id, limit_type, limit_count, reset_at)
    VALUES (
        user_id,
        'monthly',
        100,
        (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month')::timestamptz
    )
    ON CONFLICT (user_id, workflow_id, limit_type) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建函数：检查用户使用限制
CREATE OR REPLACE FUNCTION check_usage_limit(
    p_user_id UUID,
    p_workflow_id TEXT DEFAULT NULL
)
RETURNS TABLE(
    can_use BOOLEAN,
    daily_remaining INTEGER,
    monthly_remaining INTEGER,
    limit_type TEXT,
    limit_reached BOOLEAN
) AS $$
DECLARE
    daily_limit INTEGER;
    daily_used INTEGER;
    monthly_limit INTEGER;
    monthly_used INTEGER;
BEGIN
    -- 获取每日限制和使用情况
    SELECT
        COALESCE(limit_count, 0),
        COALESCE(used_count, 0)
    INTO daily_limit, daily_used
    FROM user_usage_limits
    WHERE user_id = p_user_id
        AND (workflow_id = p_workflow_id OR (workflow_id IS NULL AND p_workflow_id IS NULL))
        AND limit_type = 'daily'
        AND (reset_at IS NULL OR reset_at > NOW());

    -- 获取月度限制和使用情况
    SELECT
        COALESCE(limit_count, 0),
        COALESCE(used_count, 0)
    INTO monthly_limit, monthly_used
    FROM user_usage_limits
    WHERE user_id = p_user_id
        AND (workflow_id = p_workflow_id OR (workflow_id IS NULL AND p_workflow_id IS NULL))
        AND limit_type = 'monthly'
        AND (reset_at IS NULL OR reset_at > NOW());

    -- 如果没有找到限制记录，使用默认值
    daily_limit := COALESCE(daily_limit, 10);
    daily_used := COALESCE(daily_used, 0);
    monthly_limit := COALESCE(monthly_limit, 100);
    monthly_used := COALESCE(monthly_used, 0);

    RETURN QUERY SELECT
        (daily_used < daily_limit AND monthly_used < monthly_limit) as can_use,
        (daily_limit - daily_used) as daily_remaining,
        (monthly_limit - monthly_used) as monthly_remaining,
        CASE
            WHEN daily_used >= daily_limit THEN 'daily'
            WHEN monthly_used >= monthly_limit THEN 'monthly'
            ELSE 'none'
        END as limit_type,
        (daily_used >= daily_limit OR monthly_used >= monthly_limit) as limit_reached;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建函数：增加使用计数
CREATE OR REPLACE FUNCTION increment_usage_count(
    p_user_id UUID,
    p_workflow_id TEXT DEFAULT NULL,
    p_tokens_used INTEGER DEFAULT 0
)
RETURNS BOOLEAN AS $$
DECLARE
    current_date_start TIMESTAMPTZ;
    current_month_start TIMESTAMPTZ;
BEGIN
    current_date_start := CURRENT_DATE::timestamptz;
    current_month_start := DATE_TRUNC('month', CURRENT_DATE)::timestamptz;

    -- 更新每日使用计数
    INSERT INTO user_usage_limits (user_id, workflow_id, limit_type, limit_count, used_count, reset_at)
    VALUES (
        p_user_id,
        p_workflow_id,
        'daily',
        10, -- 默认每日限制
        1,
        current_date_start + INTERVAL '1 day'
    )
    ON CONFLICT (user_id, workflow_id, limit_type)
    DO UPDATE SET
        used_count = CASE
            WHEN user_usage_limits.reset_at <= NOW() THEN 1  -- 重置计数
            ELSE user_usage_limits.used_count + 1
        END,
        reset_at = CASE
            WHEN user_usage_limits.reset_at <= NOW() THEN current_date_start + INTERVAL '1 day'
            ELSE user_usage_limits.reset_at
        END,
        updated_at = NOW();

    -- 更新月度使用计数
    INSERT INTO user_usage_limits (user_id, workflow_id, limit_type, limit_count, used_count, reset_at)
    VALUES (
        p_user_id,
        p_workflow_id,
        'monthly',
        100, -- 默认月度限制
        1,
        current_month_start + INTERVAL '1 month'
    )
    ON CONFLICT (user_id, workflow_id, limit_type)
    DO UPDATE SET
        used_count = CASE
            WHEN user_usage_limits.reset_at <= NOW() THEN 1  -- 重置计数
            ELSE user_usage_limits.used_count + 1
        END,
        reset_at = CASE
            WHEN user_usage_limits.reset_at <= NOW() THEN current_month_start + INTERVAL '1 month'
            ELSE user_usage_limits.reset_at
        END,
        updated_at = NOW();

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器：新用户注册时自动初始化使用限制
-- 注意：这个触发器需要在 auth.users 表上创建，可能需要管理员权限