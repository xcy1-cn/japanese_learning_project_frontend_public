# Japanese Learning Platform｜Public Frontend

`frontend-public` 是 Japanese Learning Platform 的前台用户学习端，基于 Vue3、TypeScript、Element Plus、Pinia、Vue Router、Axios 和 Three.js 开发。

该系统面向学习用户，提供日语文章阅读、句子学习、题目练习、答题反馈、学习记录保存和 Three.js 学习进度星图展示。用户可以浏览文章、阅读句子、完成题目练习，并通过学习星图查看自己的学习轨迹。

## 技术栈

* Vue3
* TypeScript
* Vite
* Vue Router
* Pinia
* Axios
* Element Plus
* Three.js
* localStorage

## 项目功能

### 首页

* Public 首页展示
* 学习入口导航
* 文章学习入口
* 题目练习入口
* 学习星图入口
* 学习记录入口

### 文章学习

* 文章列表
* 关键词搜索
* 等级筛选
* 分类筛选
* 分页加载
* 文章详情
* 文章正文展示
* 文章句子列表
* 句子中文释义展示
* 句子罗马音展示
* 阅读记录保存

### 句子学习

* 句子详情展示
* 日语原文展示
* 中文释义展示
* 罗马音展示
* 关联词汇展示
* 关联语法点展示

### 题目练习

* 题目列表
* 题目类型筛选
* 关键词搜索
* 题目详情
* 选项展示
* 答案提交
* 正确 / 错误反馈
* 正确答案展示
* 答案解析展示
* 答题记录保存
* 错题记录保存

### 学习记录

Public 端使用 Pinia + localStorage 保存用户学习记录。

记录内容包括：

* 已阅读文章
* 已完成题目
* 答题结果
* 错题记录
* 学习时间
* 学习进度

即使刷新页面，学习记录也可以保留。

### Three.js 学习星图

Public 端使用 Three.js 实现学习进度星图，将用户学习行为映射为可视化节点。

星图功能包括：

* 学习文章节点
* 答题记录节点
* 不同学习内容的节点分布
* 节点之间的连线
* 学习进度可视化
* 星图专注模式

学习星图用于增强 Public 端展示效果，使项目不仅是传统列表页面，也具有可视化交互亮点。

## 项目目录结构

```text
frontend-public
├── public
├── src
│   ├── api
│   │   ├── public.ts
│   │   ├── request.ts
│   │   └── ...
│   ├── router
│   │   └── index.ts
│   ├── stores
│   │   ├── studyRecord.ts
│   │   └── ...
│   ├── views
│   │   ├── home
│   │   ├── article
│   │   ├── sentence
│   │   ├── quiz
│   │   ├── study-record
│   │   └── galaxy
│   ├── components
│   ├── App.vue
│   └── main.ts
├── package.json
└── README.md
```

## 推荐路由结构

```text
/
首页

/articles
文章列表

/articles/:id
文章详情

/sentences/:id
句子详情

/quiz
题目列表

/quiz/:id
题目详情

/study-record
学习记录

/galaxy
学习星图
```

## 环境变量

在项目根目录创建 `.env` 文件：

```env
VITE_API_BASE_URL=http://localhost:5251/api
```

如果后端运行在局域网其他电脑上，可以改为：

```env
VITE_API_BASE_URL=http://后端电脑IP:5251/api
```

例如：

```env
VITE_API_BASE_URL=http://192.168.1.107:5251/api
```

## 安装依赖

```bash
pnpm install
```

或：

```bash
npm install
```

## 启动项目

```bash
pnpm dev
```

或：

```bash
npm run dev
```

默认访问地址：

```text
http://localhost:5173
```

如果 Admin 和 Public 同时运行，需要修改其中一个项目的端口。

例如：

```bash
pnpm dev -- --port 5174
```

Public 端可以使用：

```text
http://localhost:5174
```

## 后端接口依赖

Public 前台依赖 ASP.NET Core Web API 后端的公开接口。

默认后端地址：

```text
http://localhost:5251/api
```

主要接口：

```http
GET /api/Public/articles
GET /api/Public/articles/{id}
GET /api/Public/articles/{id}/sentences
GET /api/Public/questions
GET /api/Public/questions/{id}
POST /api/Public/questions/{id}/submit
```

## Public API 说明

### 获取文章列表

```http
GET /api/Public/articles
```

支持查询参数：

```text
keyword
level
category
page
pageSize
```

### 获取文章详情

```http
GET /api/Public/articles/{id}
```

### 获取文章句子

```http
GET /api/Public/articles/{id}/sentences
```

### 获取题目列表

```http
GET /api/Public/questions
```

支持查询参数：

```text
type
keyword
page
pageSize
```

### 获取题目详情

```http
GET /api/Public/questions/{id}
```

### 提交答案

```http
POST /api/Public/questions/{id}/submit
```

请求体：

```json
{
  "answer": "B"
}
```

返回示例：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "isCorrect": true,
    "correctAnswer": "B",
    "explanation": "学生 = がくせい"
  }
}
```

## 学习记录设计

Public 端学习记录主要保存在 Pinia store 中，并通过 localStorage 持久化。

记录类型：

```text
readingRecords
answerRecords
wrongQuestionRecords
```

### 阅读记录

当用户进入文章详情页时，记录当前文章：

```text
articleId
title
level
readAt
```

### 答题记录

当用户提交答案后，记录答题结果：

```text
questionId
selectedAnswer
correctAnswer
isCorrect
answeredAt
```

### 错题记录

当用户答错时，将题目保存到错题记录中，方便后续复习。

## Three.js 学习星图设计

学习星图将学习记录映射为节点：

```text
已阅读文章 → Article Node
已完成题目 → Question Node
错题记录 → Wrong Question Node
```

节点之间可以根据学习顺序、文章等级、题目类型或学习时间建立连线。

星图设计目的：

* 将学习进度可视化
* 增强用户端展示效果
* 体现学习路径
* 形成项目差异化亮点

## 核心实现点

### 1. Axios 统一封装

Public 端通过 Axios 封装统一请求后端 Public API。

后端返回格式为：

```ts
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
```

前端统一读取：

```ts
res.data
```

### 2. Pinia + localStorage 持久化

学习记录不依赖登录系统，第一版使用本地存储保存用户学习进度。

优点：

* 实现简单
* 不依赖用户系统
* 刷新页面后数据仍然保留
* 适合 Public MVP 阶段

### 3. 答题反馈

用户提交答案后，前端根据后端返回的：

```text
isCorrect
correctAnswer
explanation
```

展示答题结果。

如果答对，显示正确提示；如果答错，显示错误提示、正确答案和答案解析。

### 4. Three.js 可视化

Three.js 用于渲染学习星图。文章、题目、错题等学习行为会转换为节点，并通过连线形成学习网络。

该功能是 Public 端的视觉亮点，用于区别普通 CRUD 项目。

## 项目亮点

* 前台用户学习端完整闭环
* 文章阅读与题目练习结合
* Public API 与 Admin 内容管理解耦
* Pinia + localStorage 保存学习记录
* 答题后即时显示正确答案与解析
* 错题记录本地保存
* Three.js 学习进度星图
* 星图专注模式
* 与后端 Public GET 缓存接口配合
* 适合作为前后端分离项目展示端

## 与 Admin 端的关系

Admin 端负责内容维护：

```text
文章
句子
词汇
语法点
题目
Excel 导入
```

Public 端负责内容消费：

```text
文章阅读
句子学习
题目练习
学习记录
星图展示
```

整体业务流程：

```text
Admin 后台维护内容
  ↓
后端 API 写入 MySQL
  ↓
Public API 提供公开数据
  ↓
Public 用户端展示学习内容
  ↓
用户阅读 / 答题 / 保存学习记录
  ↓
Three.js 星图展示学习进度
```

## 后续优化计划

* 增加用户登录系统
* 将学习记录从 localStorage 升级为后端数据库保存
* 增加错题重练功能
* 增加文章收藏功能
* 增加学习天数统计
* 增加正确率统计
* 增加移动端适配
* 优化 Three.js 节点交互
* 增加星图节点点击详情
* 增加不同等级文章的颜色区分
* 增加学习路径推荐
