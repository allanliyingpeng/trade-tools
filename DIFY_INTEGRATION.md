# Dify API 集成和使用限制功能

本项目已集成Dify API和用户使用限制功能，支持工作流执行、使用次数管理和详细的执行日志记录。

## 功能特性

### 1. Dify API集成
- 完整的Dify API客户端封装
- 支持阻塞式和流式工作流执行
- 自动重试机制和错误处理
- TypeScript类型安全

### 2. 使用限制系统
- 每日和每月使用次数限制
- 支持全局和工作流级别的限制
- 自动重置机制
- 实时使用统计

### 3. 前端组件
- `WorkflowCard`: 增强的工作流卡片组件
- `UsageCounter`: 使用次数显示组件
- 响应式设计，支持移动端

## 快速开始

### 1. 环境配置

复制环境变量示例文件：
```bash
cp .env.example .env.local
```

配置以下环境变量：
```env
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Dify API配置
DIFY_API_URL=your_dify_server_url
DIFY_API_KEY=your_dify_api_key
```

### 2. 数据库设置

在Supabase中执行以下SQL创建必要的表：

```bash
# 在Supabase SQL编辑器中执行
cat supabase-migrations.sql
```

### 3. 安装依赖

安装新增的依赖包：
```bash
npm install @radix-ui/react-progress
```

## 使用方法

### 1. 在组件中使用WorkflowCard

```tsx
import { WorkflowCard } from '@/components/WorkflowCard'
import { FileText, MessageSquare } from 'lucide-react'

const workflows = [
  {
    id: 'text-summary',
    title: '文档摘要',
    description: '自动生成文档摘要和关键点提取',
    icon: FileText,
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600',
    defaultInputs: {
      language: 'zh-CN',
      max_length: 200
    }
  }
]

function MyPage() {
  const handleResult = (result) => {
    console.log('工作流执行结果:', result)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workflows.map((workflow) => (
        <WorkflowCard
          key={workflow.id}
          workflow={workflow}
          onResult={handleResult}
          inputs={{ text: '用户输入的文本' }}
        />
      ))}
    </div>
  )
}
```

### 2. 使用自定义Hooks

```tsx
import { useDifyWorkflow, useUsageLimits } from '@/hooks'

function WorkflowComponent() {
  const { executeWorkflow, status, result, error } = useDifyWorkflow()
  const { usageStats, canExecute, limitMessage } = useUsageLimits('workflow-id')

  const handleExecute = async () => {
    if (!canExecute) {
      alert(limitMessage)
      return
    }

    const result = await executeWorkflow('workflow-id', {
      input_text: 'Hello World'
    })

    if (result?.status === 'success') {
      console.log('执行成功:', result.data)
    }
  }

  return (
    <div>
      <button onClick={handleExecute} disabled={!canExecute}>
        {status === 'running' ? '执行中...' : '执行工作流'}
      </button>

      {usageStats && (
        <p>今日剩余: {usageStats.remainingToday}/{usageStats.dailyLimit}</p>
      )}
    </div>
  )
}
```

### 3. 使用次数显示组件

```tsx
import { UsageCounter, UsageBadge, UsageProgress } from '@/components/UsageCounter'

function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* 详细的使用统计卡片 */}
      <UsageCounter variant="detailed" showDetails />

      {/* 紧凑型显示 */}
      <UsageCounter variant="compact" />

      {/* 只显示徽章 */}
      <UsageBadge />

      {/* 进度条显示 */}
      <UsageProgress />
    </div>
  )
}
```

## API路由

### POST /api/dify/[workflowId]
执行指定的工作流

**请求体:**
```json
{
  "inputs": {
    "key": "value"
  },
  "response_mode": "blocking",
  "user": "user_id"
}
```

**响应:**
```json
{
  "success": true,
  "id": "workflow_run_id",
  "status": "success",
  "data": { ... },
  "usage": {
    "tokens": 150,
    "time": 2000,
    "remainingToday": 9,
    "remainingMonth": 99
  }
}
```

### GET /api/dify/[workflowId]?runId=xxx
查询工作流执行状态

### PUT /api/dify/[workflowId]
获取用户使用统计

## 数据库表结构

### user_usage_limits
用户使用限制表
- `user_id`: 用户ID
- `workflow_id`: 工作流ID（可选，为NULL表示全局限制）
- `limit_type`: 限制类型（daily/monthly/total）
- `limit_count`: 限制次数
- `used_count`: 已使用次数
- `reset_at`: 重置时间

### workflow_usage_logs
工作流使用日志表
- `user_id`: 用户ID
- `workflow_id`: 工作流ID
- `workflow_run_id`: 执行ID
- `tokens_used`: 使用的Token数
- `execution_time`: 执行时间
- `status`: 执行状态
- `request_data`: 请求数据
- `response_data`: 响应数据

## 高级功能

### 1. 自定义使用限制

```typescript
import { createUsageLimiter } from '@/lib/usage-limiter'

const limiter = createUsageLimiter(userId)

// 设置自定义限制
await limiter.updateUserLimits('daily', 50, 'specific-workflow')

// 重置使用计数
await limiter.resetUsageCount('daily', 'specific-workflow')
```

### 2. 流式执行

```typescript
import { DifyClient } from '@/lib/dify-client'

const client = new DifyClient({
  apiUrl: process.env.DIFY_API_URL!,
  apiKey: process.env.DIFY_API_KEY!
})

await client.executeWorkflowStreaming(
  'workflow-id',
  request,
  (streamData) => {
    console.log('流式数据:', streamData)
  }
)
```

### 3. 错误处理

所有API都包含完整的错误处理：
- 网络错误
- 认证错误
- 使用限制错误
- Dify API错误

## 安全考虑

1. **API密钥安全**: Dify API密钥仅在服务端使用，从不暴露给客户端
2. **用户认证**: 所有API调用都需要有效的用户认证
3. **RLS策略**: 数据库使用行级安全策略保护用户数据
4. **使用限制**: 防止API滥用的多层限制机制

## 故障排除

### 常见问题

1. **环境变量未配置**
   ```
   Error: Dify API configuration missing
   ```
   检查.env.local文件中的DIFY_API_URL和DIFY_API_KEY配置

2. **数据库表不存在**
   ```
   Error: relation "user_usage_limits" does not exist
   ```
   确保已在Supabase中执行supabase-migrations.sql

3. **权限错误**
   ```
   Error: 未授权访问
   ```
   检查用户登录状态和JWT token有效性

### 调试模式

在开发环境中启用详细日志：
```typescript
// 在组件中添加
useEffect(() => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Usage stats:', usageStats)
    console.log('Workflow result:', result)
  }
}, [usageStats, result])
```

## 更新日志

- v1.0.0: 初始版本，支持基础工作流执行和使用限制
- 计划中: 支持工作流模板、批量执行、高级统计分析