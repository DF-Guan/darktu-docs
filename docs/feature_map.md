# 🟣 [Tier-2 · 核心图谱] darktu-docs 全系统功能图谱 (Feature Map)

> 🛡️ **重要程度：Tier-2（核心功能图谱 · 架构与测试基线）**  
> **设计思想**：源自 Lauren Tan 编译器级 Agent 工程学规范。建立 **User POV ➔ Agent Drive ➔ Observable State** 三维刚性契约。

---

## 🗺️ 核心功能三维锚定矩阵 (Core Feature Matrix)

### 1. 核心知识库百科渲染与大纲引擎 (`src/index.js`, `src/services/markdownRenderer.js`)
* **User POV (用户入口)**:
  - 访问 `https://docs.darktu.com`，点击左侧 9 大分类导航或通过 URL Hash (`#/overview`, `#/syntax`, `#/hvv-hyperlink-vector-voting`, `#/generative-engine-optimization` 等) 切换 40 篇词条；
  - 页面即时呈现元数据信息头（预计阅读时间、字数、修订年月）、右侧 TOC 目录与底栏上一篇/下一篇卡片。
* **Agent Drive (机器驱动 API)**:
  - `DarktuDocsApp.handleRoute()`, `renderMarkdown(markdown)`, `getDocBySlugOrId(slug)`.
* **Observable State (物理可观测证明状态)**:
  - `npm test` 中 `test/docs_integrity.test.js` 断言 40 篇词条 100% 存在、无占位符、无空内链且字数 > 200。

### 2. 维基百科式条目内链悬浮即时预览 (`src/services/wikilinkPreview.js`)
* **User POV (用户入口)**:
  - 鼠标悬停正文中任意 `a.wikilink` 词条内链；
  - 无需离开当前段落，即时弹窗展示目标词条的分类徽标、标题、预计阅读时间与核心摘要。
* **Agent Drive (机器驱动 API)**:
  - `setupWikilinkPreview()`.
* **Observable State (物理可观测证明状态)**:
  - `#wikilinkPreviewPopover` 动态挂载到 DOM，检测鼠标移动时动态添加 `.visible` 类名与绝对定位计算。

### 3. 全键盘极速无障碍导航系统 (`src/services/keyboardShortcuts.js`)
* **User POV (用户入口)**:
  - 按 `[` 或 `P` 极速切换上一篇，按 `]` 或 `N` 切换下一篇；
  - 按 `T` 平滑返回顶部，按 `/` 或 `Ctrl+K` 打开搜索，按 `A` 切换字号，按 `?` 打开快捷键面板，按 `Esc` 退出。
* **Agent Drive (机器驱动 API)**:
  - `setupKeyboardShortcuts()`, `toggleShortcutsModal(show)`.
* **Observable State (物理可观测证明状态)**:
  - 页面监听全局 `keydown`，自动过滤输入框焦点，操作触发 URL Hash 变更或滚动。

### 4. 阅读舒适度与字号调节器 (`src/services/readingSettings.js`)
* **User POV (用户入口)**:
  - 点击 Header 右上角「字号: 标准」按钮或按 `A` 键；
  - 在「紧凑 (15px)」、「标准 (16px)」、「舒适 (18px)」、「大字 (20px)」之间循环切换，并显示 Toast 提示。
* **Agent Drive (机器驱动 API)**:
  - `setupReadingSettings()`, `cycleNextReadingSize()`, `applyReadingSize(sizeKey)`.
* **Observable State (物理可观测证明状态)**:
  - `document.documentElement` 动态赋予 `data-reading-size` 属性，并持久化于 `localStorage["darktu_reading_size"]`。

### 5. 标题锚点直达复制与呼吸光晕 (`src/services/uiHelpers.js`)
* **User POV (用户入口)**:
  - 点击任何小节标题旁边的 `#` 锚点链接；
  - 自动复制精确直达 URL（如 `https://docs.darktu.com/#/syntax#atx`）到剪贴板，标题平滑居中并呈现呼吸强调光晕，右下角弹出 Toast 反馈。
* **Agent Drive (机器驱动 API)**:
  - `setupHeadingAnchorLinks()`, `showToast(msg)`.
* **Observable State (物理可观测证明状态)**:
  - `#docsToast.visible` 类名触发，`heading.heading-highlight-pulse` 激活。

### 6. 全局检索高亮与方向键直达 (`src/services/searchService.js`, `src/services/searchUI.js`)
* **User POV (用户入口)**:
  - 按 `Ctrl+K` 或 `/` 呼出弹窗，输入文字实时检索；
  - 标题与摘要中的关键词高亮呈现，支持键盘上下方向键选择结果，按 Enter 回车跳转。
* **Agent Drive (机器驱动 API)**:
  - `searchKnowledgeBase(query)`, `highlightKeywords(text, query)`, `setupSearchUI()`.
* **Observable State (物理可观测证明状态)**:
  - 关键词被 `<mark class="search-highlight">` 包裹，选中项具备 `.keyboard-active`。

---

## 🛠️ 机械校验指令 (Verification Command)
```bash
node test/verify_feature_map.js
node test/verify_dune_architecture.js
node test/verify_reversibility_gate.js
node test/docs_integrity.test.js
```
