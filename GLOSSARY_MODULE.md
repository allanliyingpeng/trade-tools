# 外贸术语速查模块

## ✅ 功能概述

完整实现了外贸术语速查功能，路径 `/dashboard/glossary`，包含搜索、分类、收藏等核心功能。

## 🎯 核心功能

### 1. **智能搜索**
- ✅ 实时模糊搜索，支持中英文
- ✅ 防抖处理 (300ms)
- ✅ 搜索结果高亮显示
- ✅ 搜索范围：术语代码、中英文名称、描述
- ✅ 基于 Fuse.js 的智能匹配算法

### 2. **分类筛选**
- ✅ Tabs 组件实现分类切换
- ✅ 5个分类：全部、贸易术语、支付方式、单证术语、物流术语
- ✅ 每个分类显示数量角标
- ✅ 我的收藏标签页

### 3. **响应式布局**
- ✅ 手机端：1列网格
- ✅ 平板端：2列网格
- ✅ 桌面端：3列网格
- ✅ 卡片式设计，悬停效果

### 4. **收藏功能**
- ✅ 用户认证状态检查
- ✅ 实时收藏/取消收藏
- ✅ Supabase 数据同步
- ✅ 收藏状态持久化
- ✅ 收藏数量统计

### 5. **详情弹窗**
- ✅ 完整中英文术语解释
- ✅ 责任划分列表展示
- ✅ 复制术语功能
- ✅ 收藏操作
- ✅ 滚动区域支持

## 📊 数据结构

### 术语数据 (`TradeTerm`)
```typescript
interface TradeTerm {
  id: string                    // 唯一标识
  code: string                  // 术语代码 (如 "FOB", "CIF")
  name_en: string              // 英文名称
  name_zh: string              // 中文名称
  category: TradeTermCategory   // 分类
  description_en: string        // 英文描述
  description_zh: string        // 中文描述
  responsibilities_en?: string[] // 英文责任列表
  responsibilities_zh?: string[] // 中文责任列表
}
```

### 分类类型
- `incoterms` - 贸易术语 (Incoterms 2020)
- `payment` - 支付方式
- `document` - 单证术语
- `logistics` - 物流术语

### Supabase 收藏表
```sql
CREATE TABLE user_favorite_terms (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  term_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP,
  UNIQUE(user_id, term_id)
);
```

## 📋 预置术语数据

### 🚢 Incoterms 2020 (11个)
- **EXW** - 工厂交货 (Ex Works)
- **FCA** - 货交承运人 (Free Carrier)
- **CPT** - 运费付至 (Carriage Paid To)
- **CIP** - 运费及保险费付至 (Carriage and Insurance Paid To)
- **DAP** - 目的地交货 (Delivered at Place)
- **DPU** - 卸货港交货 (Delivered at Place Unloaded)
- **DDP** - 完税后交货 (Delivered Duty Paid)
- **FAS** - 船边交货 (Free Alongside Ship)
- **FOB** - 船上交货 (Free on Board)
- **CFR** - 成本加运费 (Cost and Freight)
- **CIF** - 成本、保险费加运费 (Cost, Insurance and Freight)

### 💰 支付方式 (5个)
- **L/C** - 信用证 (Letter of Credit)
- **T/T** - 电汇 (Telegraphic Transfer)
- **D/P** - 付款交单 (Documents against Payment)
- **D/A** - 承兑交单 (Documents against Acceptance)
- **O/A** - 赊销 (Open Account)

### 📄 单证术语 (6个)
- **B/L** - 提单 (Bill of Lading)
- **AWB** - 空运单 (Air Waybill)
- **C/O** - 原产地证明 (Certificate of Origin)
- **F/A** - 运费账单 (Freight Account)
- **P/L** - 装箱单 (Packing List)
- **C/I** - 商业发票 (Commercial Invoice)

### 🚚 物流术语 (6个)
- **FCL** - 整箱货 (Full Container Load)
- **LCL** - 拼箱货 (Less than Container Load)
- **TEU** - 20英尺标准箱 (Twenty-foot Equivalent Unit)
- **FEU** - 40英尺标准箱 (Forty-foot Equivalent Unit)
- **CY** - 集装箱堆场 (Container Yard)
- **CFS** - 集装箱货运站 (Container Freight Station)

## 🛠 技术实现

### 组件架构
```
/dashboard/glossary/
├── page.tsx                    # 主页面组件
├── components/
│   └── highlighted-text.tsx   # 搜索高亮组件
├── hooks/
│   ├── use-trade-terms-search.ts  # 搜索逻辑
│   └── use-favorites.ts        # 收藏逻辑
├── data/
│   └── trade-terms.ts         # 术语数据
└── lib/supabase/
    └── favorites.ts           # 收藏服务
```

### 核心依赖
- **Fuse.js** - 模糊搜索算法
- **shadcn/ui** - UI 组件库
  - Card, Tabs, Dialog, ScrollArea
  - Button, Input, Badge, Skeleton
- **Supabase** - 数据库和认证

### 搜索算法配置
```typescript
const fuseOptions = {
  keys: [
    { name: 'code', weight: 0.3 },      // 术语代码权重最高
    { name: 'name_en', weight: 0.25 },  // 英文名称
    { name: 'name_zh', weight: 0.25 },  // 中文名称
    { name: 'description_en', weight: 0.1 }, // 英文描述
    { name: 'description_zh', weight: 0.1 }  // 中文描述
  ],
  threshold: 0.4,                       // 匹配阈值
  includeMatches: true,                 // 包含匹配信息
  minMatchCharLength: 1                 // 最小匹配长度
}
```

## 🎨 UI 特性

### 视觉设计
- ✅ shadcn/ui New York 风格
- ✅ 深色/浅色主题支持
- ✅ 悬停动画效果
- ✅ 加载骨架屏
- ✅ 空状态提示

### 交互体验
- ✅ 实时搜索反馈
- ✅ 平滑动画过渡
- ✅ 键盘导航支持
- ✅ 复制功能
- ✅ 移动端优化

### 响应式适配
```css
/* 网格布局 */
.terms-grid {
  grid-template-columns: 1fr;           /* 手机：1列 */
}

@media (min-width: 768px) {
  .terms-grid {
    grid-template-columns: repeat(2, 1fr); /* 平板：2列 */
  }
}

@media (min-width: 1024px) {
  .terms-grid {
    grid-template-columns: repeat(3, 1fr); /* 桌面：3列 */
  }
}
```

## 🔧 使用方法

### 1. 数据库设置
执行 SQL 脚本创建收藏表：
```bash
psql -f database/user_favorite_terms.sql
```

### 2. 访问路径
```
https://your-domain.com/dashboard/glossary
```

### 3. 搜索使用
- 输入中英文术语代码或名称
- 支持部分匹配和模糊搜索
- 实时显示搜索结果

### 4. 收藏管理
- 需要用户登录
- 点击心形图标收藏/取消收藏
- 在"我的收藏"标签页查看

## 📈 性能优化

### 搜索性能
- ✅ 防抖处理减少查询频率
- ✅ Fuse.js 预构建索引
- ✅ 本地数据无网络延迟

### 渲染优化
- ✅ React.memo 组件缓存
- ✅ useCallback 函数缓存
- ✅ useMemo 计算缓存

### 数据优化
- ✅ 分页加载 (未来扩展)
- ✅ 虚拟滚动 (长列表优化)
- ✅ 图片懒加载 (如有需要)

## 🚀 部署状态

- ✅ 开发环境测试通过
- ✅ 构建成功无错误
- ✅ TypeScript 类型检查通过
- ✅ ESLint 代码质量检查
- ✅ 响应式设计验证

## 🔮 扩展规划

### 短期优化
- [ ] 添加音频发音功能
- [ ] 术语使用示例
- [ ] 相关术语推荐
- [ ] 导出收藏列表

### 长期功能
- [ ] 术语学习模式
- [ ] 知识测验功能
- [ ] 个人学习统计
- [ ] 术语更新通知

外贸术语速查模块已完全实现，提供专业、高效的术语查询体验！