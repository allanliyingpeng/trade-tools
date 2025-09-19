-- 创建用户收藏外贸术语表
CREATE TABLE IF NOT EXISTS public.user_favorite_terms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  term_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- 确保每个用户对每个术语只能收藏一次
  UNIQUE(user_id, term_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_favorite_terms_user_id ON public.user_favorite_terms(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorite_terms_term_id ON public.user_favorite_terms(term_id);
CREATE INDEX IF NOT EXISTS idx_user_favorite_terms_created_at ON public.user_favorite_terms(created_at);

-- 启用行级安全
ALTER TABLE public.user_favorite_terms ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略：用户只能访问自己的收藏
CREATE POLICY "Users can view own favorite terms" ON public.user_favorite_terms
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorite terms" ON public.user_favorite_terms
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorite terms" ON public.user_favorite_terms
  FOR DELETE USING (auth.uid() = user_id);

-- 添加注释
COMMENT ON TABLE public.user_favorite_terms IS '用户收藏的外贸术语表';
COMMENT ON COLUMN public.user_favorite_terms.user_id IS '用户ID，关联users表';
COMMENT ON COLUMN public.user_favorite_terms.term_id IS '术语ID，对应trade-terms.ts中的术语';
COMMENT ON COLUMN public.user_favorite_terms.created_at IS '收藏时间';