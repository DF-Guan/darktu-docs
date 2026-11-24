# 🟣 [Tier-2 · 核心图谱] darktu-docs 全系统功能图谱 (Feature Map)

> 🛡️ **重要程度：Tier-2（核心功能图谱 · 架构与测试基线）**  
> **设计思想**：源自 Lauren Tan 编译器级 Agent 工程学规范。建立 **User POV ➔ Agent Drive ➔ Observable State** 三维刚性契约。

---

## 🗺️ 核心功能三维锚定矩阵 (Core Feature Matrix)

### 1. 核心知识库百科渲染与大纲引擎 (`src/index.js`, `src/services/markdownRenderer.js`)
* **User POV (用户入口)**:
  - 访问 `https://docs.darktu.com`，点击左侧 9 大分类导航或通过 URL Hash (`#/overview`, `#/syntax`, `#/hvv-hyperlink-vector-voting`, `#/global-search-indexing-and-indexnow` 等) 切换 48 篇词条；
  - 页面即时呈现元数据信息头（预计阅读时间、字数、修订年月）、右侧 TOC 目录与底栏上一篇/下一篇卡片。
* **Agent Drive (机器驱动 API)**:
  - `DarktuDocsApp.handleRoute()`, `renderMarkdown(markdown)`, `getDocBySlugOrId(slug)`.
* **Observable State (物理可观测证明状态)**:
  - `npm test` 中 `test/docs_integrity.test.js` 断言 48 篇词条 100% 存在、无占位符、无空内链且字数 > 200。

### 2. 维基百科式条目内链悬浮即时预览 (`src/services/wikilinkPreview.js`)
* **User POV (用户入口)**:
  - 鼠标悬停正文中任意 `a.wikilink` 词条内链；
  - 无需离开当前段落，即时弹窗展示目标词条的分类徽标、标题、预计阅读时间与核心摘要；当内链位于屏幕下边缘或右边缘时，浮窗自适应翻转朝向（Flip），防止溢出视口。
* **Agent Drive (机器驱动 API)**:
  - `setupWikilinkPreview()`, `calculatePopoverPosition()`, `extractLeadExcerpt()`.
* **Observable State (物理可观测证明状态)**:
  - `#wikilinkPreviewPopover` 动态挂载到 DOM，检测鼠标移动时动态添加 `.visible` 与 `[data-placement="top"|"bottom"]` 属性；
  - `test/wikilink_popover.test.js` 机械验证左、右、下边缘碰撞修正与无负坐标翻转。

### 3. 全键盘极速无障碍导航系统 (`src/services/keyboardShortcuts.js`)
* **User POV (用户入口)**:
  - 按 `[` 或 `P` 极速切换上一篇，按 `]` 或 `N` 切换下一篇；
  - 按 `T` 平滑返回顶部，按 `/` 或 `Ctrl+K` 打开搜索，按 `A` 切换字号，按 `?` 打开快捷键面板，按 `Esc` 退出。
* **Agent Drive (机器驱动 API)**:
  - `setupKeyboardShortcuts()`, `toggleShortcutsModal(show)`.
* **Observable State (物理可观测证明状态)**:
  - 页面监听全局 `keydown`，自动过滤输入框焦点，操作触发 URL Hash 变更或滚动；
  - `#shortcutsModalOverlay` 具备 `role="dialog"`, `aria-modal="true"`, `aria-labelledby="shortcutsModalTitle"`；打开时焦点捕获在内部（Focus Trap，Tab 键循环封闭），关闭时原位恢复调用前 activeElement；
  - `T` 键回到顶部与全局 CSS 均严格响应 `prefers-reduced-motion: reduce`，在动效减弱偏好下自适应为无动画 `'auto'` 跳转。

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
  - 标题、英文缩写与摘要中的关键词高亮呈现，支持键盘上下方向键选择结果，按 Enter 回车跳转；按 Escape 快速关闭并原位恢复焦点。
* **Agent Drive (机器驱动 API)**:
  - `searchKnowledgeBase(query)`, `highlightKeywords(text, query)`, `setupSearchUI()`, `stripMarkdown(md)`, `extractAcronymsAndKeywords(text)`.
* **Observable State (物理可观测证明状态)**:
  - 关键词被 `<mark class="search-highlight">` 包裹，选中项具备 `.keyboard-active`；
  - `test/search_relevance.test.js` 机械验证标题与缩写高权直达（如 HVV）、多词联合加权与 Markdown 格式符号净化。

### 7. 全球搜索引擎收录矩阵与 IndexNow 实时推送 (`scripts/submit-indexnow.mjs`, `public/robots.txt`, `public/sitemap.xml`)
* **User POV (用户入口)**:
  - 全球搜索引擎（Google、Bing、Yandex、Naver、Seznam、百度）与各大生成式 AI 爬虫（GPTBot、ClaudeBot、PerplexityBot 等）快速索引 48 篇知识库词条，AI 问答无缝进行可信源权威归因。
* **Agent Drive (机器驱动 API)**:
  - `submitToIndexNow({ urls, dryRun })`, `extractUrlsFromSitemap()`, `generate-sitemap.mjs`.
* **Observable State (物理可观测证明状态)**:
  - `test/indexnow.test.mjs` 硬断言 IndexNow 密钥验证文件、RFC 标准负载构建与 dry-run 机制；
  - `test/seo_and_ui_inspection.test.js` 断言 `robots.txt` 友善放行全球主权与 AI 爬虫，`sitemap.xml` 完整索引 48 篇词条。

### 8. 文章实用度即时反馈与共建系统 (`src/services/feedbackService.js`, `src/styles/content.css`)
* **User POV (用户入口)**:
  - 读者阅读至任意文章底部，均可看到实用度互动卡片「这篇文档对您有帮助吗？ [👍 有帮助] [👎 仍有疑问]」；
  - 点击「👍 有帮助」：获得优雅祝贺与感谢，状态本地记忆防重复干扰；
  - 点击「👎 仍有疑问」：展示温馨提示，并提供直达 GitHub Issue 模板的预填勘误通道；支持随时撤销重新评价。
* **Agent Drive (机器驱动 API)**:
  - `setupArticleFeedback(containerEl, doc)`, `renderFeedbackWidgetHtml(doc, current)`, `saveArticleFeedback(docId, type)`, `getArticleFeedback(docId)`, `clearArticleFeedback(docId)`, `getFeedbackIssueUrl(doc)`.
* **Observable State (物理可观测证明状态)**:
  - `test/article_feedback.test.js` 机械验证 6 大核心用例：未打分状态渲染、👍 反馈状态渲染、👎 反馈及 GitHub Issue 预填参数编码、localStorage 持久化与清除、DOM 事件触发与更新。

### 9. LLM-Ready 一键复制整篇 Markdown 原文与元数据导出 (`src/services/uiHelpers.js`, `src/styles/content.css`)
* **User POV (用户入口)**:
  - 读者在元数据条右侧点击「📄 复制 Markdown」按钮；
  - 瞬时复制携带标准 YAML Frontmatter（标题、URL、分类、开源许可）的纯净 Markdown 全文，便于读者一键粘贴至 ChatGPT / Claude / Gemini 进行深度针对性提问；按钮自适应变为绿色「✓ 已复制 Markdown」状态并在 2 秒后复原。
* **Agent Drive (机器驱动 API)**:
  - `formatMarkdownForLlm(doc, rawMd)`, `setupCopyMarkdown(btnEl, doc, rawMd)`.
* **Observable State (物理可观测证明状态)**:
  - `test/copy_markdown.test.js` 机械验证 YAML 头部拼接契约、空异常兜底及剪贴板写入与状态切换。

### 10. 交互式 2D 知识图谱全景视网膜网络 (`src/services/graphService.js`, `src/styles/graph.css`)
* **User POV (用户入口)**:
  - 读者点击顶部导航栏【🕸️ 图谱】按钮，即刻展开对标 Obsidian / Quartz 的 2D 力导向全景知识拓扑图谱；
  - 48 篇词条与内部维基超链接以星空网络呈现，节点大小自适应连通度，9 大分类映射专属调色板；
  - 鼠标滚轮无级缩放（0.3x ~ 3.0x）、拖拽节点与画布视口平移；鼠标悬浮于任一节点时，直连邻接词条动态高亮聚焦，其余无关词条优雅淡出（0.15 沉浸透明度）；
  - 点击节点即刻实现 SPA 路由直达跳转，支持 `Esc` 键、背景点击与复位视野交互。
* **Agent Drive (机器驱动 API)**:
  - `buildGraphData(docsNavigation, getArticleMarkdown)`
  - `stepSimulation(graph, width, height, alpha)`
  - `renderGraph(ctx, graph, state)`
  - `setupKnowledgeGraph(getCurrentDoc)`
* **Observable State (物理可观测证明状态)**:
  - `test/unit_knowledge_graph.test.js` 机械验证 48 篇词条节点构建、维基内链拓扑抽取、力导向物理位移更新与高分辨率 Canvas 视网膜渲染。

---

## 🛠️ 机械校验指令 (Verification Command)
```bash
node test/verify_feature_map.js
node test/verify_dune_architecture.js
node test/verify_reversibility_gate.js
node test/docs_integrity.test.js
```
