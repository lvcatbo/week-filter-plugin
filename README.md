<div align="center">

  # Week Filter Plugin

  **飞书多维表格 - 智能时间筛选插件**

  [![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Lark Base SDK](https://img.shields.io/badge/Lark%20Base%20SDK-1.0.0-00D6B1?logo=lark&logoColor=white)](https://open.feishu.cn/)

</div>

---

## 简介

Week Filter Plugin 是一款为飞书多维表格打造的强大时间筛选插件。通过简单直观的界面，帮助用户快速按周、月、年、季度等时间维度对数据进行筛选，大幅提升数据查询效率。

### 核心功能

| 功能 | 说明 |
|:---|:---|
| **按周筛选** | 快速筛选上周、本周、下周的数据 |
| **按月筛选** | 支持上月、本月、下月的范围筛选 |
| **按年筛选** | 一键查看去年、今年、明年的记录 |
| **按季筛选** | 按季度进行数据划分和查询 |
| **自定义天数** | 灵活选择过去/未来 N 天的数据 |
| **视图管理** | 支持在当前视图筛选或创建新视图 |
| **一键清空** | 快速清除所有日期相关的筛选条件 |

---

## 技术栈

- **框架**: [Vue 3](https://vuejs.org/) - 使用 Composition API 和 `<script setup>`
- **语言**: [TypeScript](https://www.typescriptlang.org/) - 类型安全的 JavaScript 超集
- **构建工具**: [Vite](https://vitejs.dev/) - 新一代前端构建工具
- **UI 组件**: [Ant Design Vue](https://antdv.com/) 4.x - 企业级 UI 组件库
- **样式**: [Tailwind CSS](https://tailwindcss.com/) - 原子化 CSS 框架
- **国际化**: [Vue I18n](https://vue-i18n.intlify.dev/) - 多语言支持
- **日期处理**: [Day.js](https://day.js.org/) - 轻量级日期库
- **SDK**: [@lark-base-open/js-sdk](https://github.com/lark-base-open/js-sdk) - 飞书多维表格开发 SDK

---

## 开发指南

### 环境要求

- Node.js >= 18
- pnpm >= 8

### 安装依赖

```bash
pnpm install
```

### 本地开发

```bash
pnpm dev
```

访问 http://localhost:5173 查看效果

### 构建生产版本

```bash
pnpm build
```

### 预览生产构建

```bash
pnpm preview
```

---

## 项目结构

```
week-filter-plugin/
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # Vue 组件
│   │   ├── HelpInfo.vue    # 帮助信息组件
│   │   ├── SelectForm.vue  # 筛选表单组件
│   │   └── ToolBox.vue     # 工具箱组件
│   ├── locale/          # 国际化语言文件
│   │   ├── en-US.ts
│   │   ├── zh-CN.ts
│   │   └── index.ts
│   ├── plugins/         # Vue 插件
│   ├── tools/           # 工具函数
│   │   └── delete_date_filters.ts
│   ├── App.vue          # 根组件
│   └── main.ts          # 入口文件
├── public/              # 公共静态资源
├── index.html           # HTML 模板
├── vite.config.ts       # Vite 配置
├── tailwind.config.js   # Tailwind CSS 配置
└── package.json
```

---

## 使用说明

1. **选择目标字段**: 从下拉列表中选择需要筛选的日期字段
2. **选择时间范围**: 点击周/月/年/季度按钮选择时间维度
3. **选择视图**:
   - **当前视图**: 在当前视图应用筛选
   - **新视图**: 创建一个新视图保存筛选结果
4. **开始筛选**: 点击"开始筛选"按钮应用筛选条件
5. **清空筛选**: 点击"清空筛选"移除所有日期相关的筛选条件

---

## 联系方式

如有问题或建议，欢迎提交 Issue

<div align="center">
  Made with ❤️ for Feishu Base
</div>
