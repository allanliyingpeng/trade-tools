# 交易助手 - 项目结构

## 项目概述
基于 Next.js 14 的现代化交易管理平台，采用 App Router、TypeScript、Tailwind CSS 构建。

## 技术栈
- **框架**: Next.js 14 with App Router
- **语言**: TypeScript
- **样式**: Tailwind CSS 4.0
- **UI组件**: shadcn/ui (New York style)
- **数据库**: Supabase
- **图标**: Lucide React
- **包管理**: pnpm
- **部署**: Docker

## 目录结构

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 认证路由组
│   │   ├── login/                # 登录页面
│   │   ├── register/             # 注册页面
│   │   └── forgot-password/      # 忘记密码页面
│   ├── (dashboard)/              # 仪表板路由组
│   │   ├── dashboard/            # 主仪表板
│   │   ├── profile/              # 个人资料
│   │   ├── settings/             # 设置页面
│   │   └── layout.tsx           # 仪表板布局
│   ├── globals.css              # 全局样式
│   ├── layout.tsx              # 根布局
│   └── page.tsx                # 首页 (重定向到仪表板)
├── components/                  # 组件目录
│   ├── features/               # 功能组件
│   │   ├── auth/               # 认证相关组件
│   │   │   └── login-form.tsx
│   │   ├── dashboard/          # 仪表板组件
│   │   │   └── stats-grid.tsx
│   │   ├── navigation/         # 导航组件
│   │   │   └── navigation.tsx  # 响应式导航栏
│   │   └── trading/            # 交易相关组件
│   │       └── trading-panel.tsx
│   ├── ui/                     # shadcn/ui 组件
│   │   ├── button.tsx
│   │   └── sheet.tsx
│   └── common/                 # 通用组件
├── hooks/                      # 自定义 React Hooks
│   ├── use-auth.ts            # 认证状态管理
│   ├── use-mobile.ts          # 移动端检测
│   ├── use-sidebar.ts         # 侧边栏状态
│   ├── use-trading.ts         # 交易数据管理
│   └── index.ts               # 导出文件
├── lib/                       # 工具库
│   ├── supabase/              # Supabase 配置
│   │   ├── client.ts          # 客户端配置
│   │   ├── auth.ts            # 认证服务
│   │   ├── database.ts        # 数据库操作
│   │   └── index.ts           # 导出文件
│   └── utils.ts               # 通用工具函数
└── types/                     # TypeScript 类型定义
    ├── auth.ts                # 认证相关类型
    ├── database.ts            # 数据库类型
    ├── trading.ts             # 交易相关类型
    ├── ui.ts                  # UI 组件类型
    └── index.ts               # 导出文件
```

## 核心功能

### 1. 路由组织
- **(auth)**: 认证相关页面，独立布局
- **(dashboard)**: 主要功能页面，共享导航布局

### 2. 响应式导航
- **桌面端**: 固定侧边栏导航
- **移动端**: 汉堡菜单 + Sheet 组件

### 3. 状态管理
- `useAuth`: 用户认证状态
- `useMobile`: 响应式断点检测
- `useSidebar`: 侧边栏状态控制
- `useTrading`: 交易数据管理

### 4. 数据库集成
- Supabase 客户端配置
- 认证服务 (登录/注册/重置密码)
- 数据库操作 (用户资料/交易记录)

### 5. UI 组件
- shadcn/ui New York 风格
- CSS 变量主题系统
- 深色/浅色模式支持

## 环境配置

```bash
# 安装依赖
pnpm install

# 开发服务器
pnpm dev

# 构建项目
pnpm build

# 启动生产服务
pnpm start
```

## 环境变量

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Docker 部署

```bash
# 构建镜像
docker build -t tradehelper .

# 运行容器
docker-compose up -d
```

## 特性亮点

1. **现代化架构**: Next.js 14 App Router + TypeScript
2. **响应式设计**: 移动端优先，桌面端增强
3. **类型安全**: 完整的 TypeScript 类型定义
4. **模块化组织**: 功能导向的目录结构
5. **开发体验**: 热重载、ESLint、Prettier
6. **生产就绪**: Docker 部署、性能优化

## 下一步开发

1. 实现用户认证流程
2. 连接真实的交易 API
3. 添加图表和数据可视化
4. 实现实时数据更新
5. 添加单元测试和集成测试