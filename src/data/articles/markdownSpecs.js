/**
 * 篇章一：Markdown 核心规范与语法标准全集 (markdownSpecs.js)
 * 学习参考指南：CommonMark, GFM, 边缘规则, Callouts
 */

export const MARKDOWN_SPECS_ARTICLES = {
  "markdown-specs/spec-evolution": `# Markdown 发展史与主流方言演进规范

> 本文梳理自 2004 年 John Gruber 创造 Markdown 以来，社区在标准化与工程落地过程中的重要方言演进、设计哲学与语法兼容性矩阵。

---

## 1. Markdown 的诞生与原始规范缺陷

2004 年，John Gruber 在 Aaron Swartz 的协助下设计了 Markdown，其核心哲学是：

> **“可读性高于一切 (Readability is paramount).”**  
> 一份未经排版渲染的 Markdown 源码纯文本，应该像电子邮件纯文本一样自然、清晰，绝不充斥着繁杂的标签与属性。

### 1.1 原始 Markdown (2004) 的致命缺陷
Gruber 的初代实现 \`Markdown.pl\` 仅是一份不到 1,000 行的 Perl 正则替换脚本。由于缺乏严谨的上下文无关文法（CFG）与有限状态机定义，导致了严重的工程问题：
- **嵌套歧义**：多层列表与引用块互相嵌套时，不同解析器出现无限递归或非确定性输出；
- **空白符脆弱性**：行尾两个空格换行的设计极其脆弱，在很多代码格式化工具中会被自动去除；
- **缺乏扩展标准**：不支持表格（Table）、删除线（Strikethrough）、数学公式（LaTeX）与代码围栏（Fenced Code Blocks）。

---

## 2. 主流方言与标准化运动对比

为解决方言林立的碎片化困境，业界诞生了数个关键标准分支：

| 规范名称 | 发起机构/主导者 | 核心定位 | 核心特性 | 现代代表解析器 |
| :--- | :--- | :--- | :--- | :--- |
| **CommonMark** | Jeff Atwood, John MacFarlane 等 | 严格的形式化数学规范 | 消除所有二义性、600+ 规范用例套件、AST 明确映射 | \`cmark\` (C), \`markdown-it\` (JS) |
| **GFM (GitHub Flavored)** | GitHub 官方 | 基于 CommonMark 的开发者扩展集 | 扩展表格、任务列表、删除线、自动链接、Emoji | \`cmark-gfm\`, \`comrak\` (Rust) |
| **Markdown Extra** | Michel Fortin | PHP 社区经典扩展 | 脚注 (Footnotes)、定义列表、代码块自定义属性 | \`php-markdown\`, \`Python-Markdown\` |
| **Pandoc Markdown** | John MacFarlane | 学术界与出版界全能通用中间语言 | 超全数学公式、文献引用、多列排版、元数据 YAML | \`pandoc\` (Haskell) |

---

## 3. 解析器架构分层：从正则替换到 AST 抽象语法树

![现代 Markdown 解析器架构 · 双阶段编译与 AST 语法树流水线](./assets/diagrams/markdown-ast-pipeline.svg)

现代工业级 Markdown 引擎彻底摒弃了简单正则替换，采用经典的双阶段编译管线：

\`\`\`mermaid
flowchart LR
    Source["原始 Markdown 文本"] --> BlockParser["块级状态机解析 (Block Parser)<br/>解析标题、列表、代码块、引用"]
    BlockParser --> AST["抽象语法树 (Markdown AST)"]
    AST --> InlineParser["行内流式词法分词 (Inline Parser)<br/>解析强调、链接、行内代码、公式"]
    InlineParser --> CleanAST["终态 AST 节点树"]
    CleanAST --> HTMLRenderer["HTML / XML 语义渲染器"]
\`\`\`

1. **块结构解析 (Block-level Parsing)**：优先逐行扫描确定文档大纲容器（叶子块如段落、代码块；容器块如列表项、区块引用）；
2. **行内结构分词 (Inline Parsing)**：对叶子块内的字符流进行括号配对、强调符号（\`*\` 与 \`_\`）的双向定界符栈（Delimiter Run）消除；
3. **AST 变换与插件管线**：提供 Hook 机制，允许在此阶段注入数学公式解析（KaTeX）、Mermaid 流程图解析或敏感词过滤。

---

## 4. 跨平台选型避坑准则

在数字出版、博客系统或自媒体工具选型中，推荐遵循以下准则：
- **绝不使用无规范支撑的玩具解析器**；
- 优先选择通过 **CommonMark 0.31+ 兼容性认证**的引擎；
- 涉及微信公众平台、知乎专栏等富文本剪贴板生态时，必须在 AST 输出阶段集成 **CSS 行内化 (Inliner)** 与 **HTML 安全沙箱清洗 (Sanitizer)**。
`,

  "markdown-specs/commonmark-core": `# CommonMark 核心规范与语法深度解析

> 本文以 CommonMark 0.31.2 官方规范为基准，详细阐述 Markdown 基础语法的严格语义边界、定界符栈机制与边缘解析场景。

---

## 1. 标题语法 (Headings) 与 Setext 规范

### 1.1 ATX 标题（推荐标准）
使用 \`#\` 作为前缀，支持 1 至 6 级标题。

\`\`\`markdown
# 一级主标题 (Title 1)
## 二级章节标题 (Title 2)
### 三级小节标题 (Title 3)
#### 四级标题 (Title 4)
##### 五级标题 (Title 5)
###### 六级标题 (Title 6)
\`\`\`

> [!IMPORTANT]
> **规范红线**：根据 CommonMark 规范，\`#\` 与后续正文之间**必须包含至少一个空格**（例如 \`# 标题\` 合法，而 \`#标题\` 在标准解析器中将被作为普通段落文本对待）。末尾可选对称的 \`#\` 关闭符号。

### 1.2 Setext 标题（底线下划线风格）
在文本下一行使用 \`=\` 或 \`-\` 标记，仅支持一、二级标题：
\`\`\`markdown
这是一级标题
=============

这是二级标题
-------------
\`\`\`

---

## 2. 强调与加粗的定界符算法 (Emphasis and Strong Emphasis)

Markdown 支持使用星号 \`*\` 或下划线 \`_\` 表达语义强调。在 CommonMark 中，强调不是简单的匹配，而是严格基于 **定界符游程 (Delimiter Run)** 算法：

| 语法书写 | 渲染效果 | HTML 语义标签 | 规范规则 |
| :--- | :--- | :--- | :--- |
| \`*斜体强调*\` 或 \`_斜体强调_\` | *斜体强调* | \`<em>斜体强调</em>\` | 单定界符左右匹配 |
| \`**粗体强调**\` 或 \`__粗体强调__\` | **粗体强调** | \`<strong>粗体强调</strong>\` | 双定界符左右匹配 |
| \`***粗斜体结合***\` | ***粗斜体结合*** | \`<strong><em>粗斜体</em></strong>\` | 三定界符嵌套 |

> [!TIP]
> **中英文混排避坑指南**：在中文排版中，推荐统一使用星号 \`*文字*\` 与 \`**文字**\`。下划线 \`_\` 在 CommonMark 中包含“词内强调限制（Intraword Emphasis Restriction）”，下划线与中文字符相邻时可能判定为单词内部连接符导致加粗失效。

---

## 3. 列表体系：松散列表 (Loose) 与紧凑列表 (Tight)

### 3.1 无序列表与有序列表
\`\`\`markdown
- 无序列表项 A
- 无序列表项 B
  - 二级缩进列表（缩进 2 个或 4 个空格）
  - 二级缩进列表项

1. 有序项第一点（数字无需连续，解析器将自动重新编号）
2. 有序项第二点
3. 有序项第三点
\`\`\`

### 3.2 列表的核心区别：松散 (Loose) vs 紧凑 (Tight)
这是 Markdown 最常令人困惑的特性：
- **紧凑列表 (Tight List)**：列表项之间没有空行。HTML 输出为纯 \`<li>文本</li>\`，无段落标签，上下行距紧凑；
- **松散列表 (Loose List)**：只要列表中**任何两个项之间存在空行**，整个列表自动升格为松散列表，每个列表项包裹 \`<p>\` 标签：
  \`\`\`html
  <li><p>列表项内容</p></li>
  \`\`\`
  在自媒体或网页排版中会导致列表项间隙剧增。

---

## 4. 区块引用 (Blockquotes) 嵌套与惰性延续 (Lazy Continuation)

区块引用通过行首 \`>\` 声明，支持任意深度嵌套与多块混合：

\`\`\`markdown
> 这是第一层区块引用。
>
> > 这是嵌套在内部的二级引用，包含专业术语解释。
>
> 引用内可以直接编写列表与代码：
> - 引用中的列表项 1
> - 引用中的列表项 2
\`\`\`

---

## 5. 代码展示：行内代码与围栏代码块 (Fenced Code Blocks)

### 5.1 行内代码 (Inline Code)
使用单反引号 \`\` \`code\` \`\` 包裹。若代码内部本身包含反引号，可以使用双反引号包裹：
\`\`\`markdown
在文本中提到 \`const status = true;\` 变量。
如果要显示反引号自身：\`\` \`code\` \`\`
\`\`\`

### 5.2 围栏代码块 (Fenced Code Blocks)
使用 3 个以上的反引号 \`\`\` 或波浪号 \`\`\`\`\`\` 包裹，首行提供语言信息字符串（Info String）：
\`\`\`typescript
interface UserProfile {
  id: string;
  name: string;
  role: 'admin' | 'creator';
}
\`\`\`
`,

  "markdown-specs/gfm-extensions": `# GitHub Flavored Markdown (GFM) 扩展规范手册

> GFM 是开源社区与开发者工具中广泛采用的扩展规范。本文系统梳理 GFM 在 [CommonMark 核心规范](#/syntax) 基础之上引入的核心扩展。

---

## 1. 结构化表格语法 (Tables)

GFM 表格通过管道符 \`|\` 与连字符 \`-\` 组织，第二行必须是表头分隔线，并支持通过冒号 \`:\` 声明对齐属性：

\`\`\`markdown
| 参数名称 (Name) | 类型 (Type) | 默认值 (Default) | 字段语义描述 |
| :--- | :---: | ---: | :--- |
| **apiKey** | \`string\` | \`null\` | 调用开放平台的鉴权令牌 |
| **timeout** | \`number\` | \`5000\` | 客户端 HTTP 超时等待阈值 (ms) |
| **autoRetry**| \`boolean\`| \`true\` | 网络抖动时是否自动触发指数退避 |
\`\`\`

### 对齐规则解析：
- \`:---\`：文本左对齐（默认文本规范）；
- \`:---:\`：居中对齐（常用于状态、枚举、布尔值）；
- \`---:\`：右对齐（常用于数值、价格、耗时等统计指标）。

---

## 2. 任务列表 (Task Lists / Checklist)

任务列表在无序列表的基础之上引入复选框语义：

\`\`\`markdown
- [x] 完成 CommonMark 语法解析器内核基线重构
- [x] 部署 Cloudflare Pages 独立二级域名 docs.darktu.com
- [ ] 编写微信公众号排版引擎富文本沙箱白名单白皮书
- [ ] 实施全库 LaTeX 数学公式 KaTeX 高清渲染回归测试
\`\`\`

### 语义化 HTML 输出：
GFM 规范要求将任务列表渲染为不可点击或只读的勾选框元素，并附带专属属性：
\`\`\`html
<ul>
  <li><input type="checkbox" checked disabled> 完成 CommonMark 语法解析器内核基线重构</li>
  <li><input type="checkbox" disabled> 编写微信公众号排版引擎富文本沙箱白名单白皮书</li>
</ul>
\`\`\`

---

## 3. 删除线语法 (Strikethrough)

使用双波浪号 \`~~\` 包裹需要废弃或删除的文本，在 HTML 中对应 \`<del>\` 语义标签：

\`\`\`markdown
~~旧版本 API \`fetchDataLegacy()\` 已正式废弃~~，请迁移至全新异步流式接口 \`useDataStream()\`.
\`\`\`
渲染呈现：~~旧版本 API fetchDataLegacy() 已正式废弃~~，请迁移至全新异步流式接口 useDataStream().

---

## 4. 自动超链接拓展 (Autolinks Extension)

在标准 CommonMark 中，超链接必须写为 \`<https://example.com>\` 或 \`[文本](https://example.com)\`。而在 GFM 扩展中，以下合规协议的裸文本 URL 会自动转为可点击的超链接：
- \`https://darktu.com\` -> 自动识别为 \`<a href="https://darktu.com">https://darktu.com</a>\`
- \`mailto:support@darktu.com\` -> 自动识别为邮件点击
- \`www.github.com\` -> 带有 \`www.\` 前缀的域名自动补全 \`http://\` 协议并链接。
`,

  "markdown-specs/advanced-markdown": `# Markdown 高级排版特性与 HTML5 嵌入规范

> 当标准语法无法满足学术专著、复杂书籍或精细化排版需求时，Markdown 社区逐渐形成了脚注、元数据定义与 HTML5 混合渲染的通用约定。

---

## 1. 学术脚注语法 (Footnotes)

脚注在学术论文、深度研究特稿中是不可或缺的参考文献与注释工具：

\`\`\`markdown
现代编译器前端架构[^1]通过多遍 AST 遍历实现代码优化，根据最新的 W3C 标准建议[^w3c]，排版时应保持字符边界清晰。

[^1]: Aho, Alfred V., et al. "Compilers: Principles, Techniques, and Tools." Addison-Wesley, 2006.
[^w3c]: W3C 中文排版需求标准 (CLReq), 2024 年修订版.
\`\`\`

### 渲染行为与跳转机制：
1. 正文中引用位置自动生成上标锚点超链接 \`<sup><a href="#fn-1">[1]</a></sup>\`；
2. 文章最底部自动汇编所有脚注列表，并生成带反向回溯链接（Backlink \`↩\`) 的脚注容器。

---

## 2. 嵌入原生 HTML5：安全子集与消毒机制 (Sanitization)

Markdown 原生设计允许混入 HTML 标签。然而在多用户或自媒体系统中，任意 HTML 会带来严重的 XSS 跨站脚本攻击或破坏页面 DOM 树。

### 2.1 推荐安全白名单标签集
| 允许保留的 HTML 标签 | 典型应用场景 | 属性限制规则 |
| :--- | :--- | :--- |
| \`<u>\`, \`<mark>\` | 下划线强调、高亮背景文字 | 仅允许样式类或安全 inline-style |
| \`<sub>\`, \`<sup>\` | 化学分子式（H~2~O）、代数平方（X^2^） | 禁止包含脚本属性 |
| \`<kbd>\` | 键盘按键提示，如 \`<kbd>Ctrl</kbd> + <kbd>C</kbd>\` | 纯行内元素 |
| \`<details>\`, \`<summary>\` | 原生折叠内容面板，常用于答案、补充代码 | \`open\` 属性可选 |

### 2.2 必须机械剥离的高危标签黑名单
必须通过 HTML Sanitizer 自动剔除以下标签与属性：
- [高危禁止] \`<script>\`, \`<iframe>\`, \`<object>\`, \`<embed>\`：杜绝外部脚本注入；
- [高危禁止] \`onclick\`, \`onerror\`, \`onload\` 等一切 \`on*\` 事件监听器；
- [高危禁止] 带有 \`javascript:\` 伪协议的 \`<a href="...">\` 链接。
`,

  "markdown-specs/callouts-spec": `# 现代 Callout / Admonition 提示块标准化指南

> Callout（提示块/告警框）已成为现代技术文档（GitHub Docs, VitePress, Obsidian, Docusaurus）的核心标配。本文定义标准化五色提示块语法规范。

---

## 1. GitHub 风格提示块语法体系

通过在引用块第一行采用大写方括号标识符 \`[!TYPE]\` 声明：

\`\`\`markdown
> [!NOTE]
> 记录普通背景信息、技术历史上下文或对阅读体验有益的辅助说明。

> [!TIP]
> 最佳实践与效能提升技巧，引导用户采取更高效的操作范式。

> [!IMPORTANT]
> 核心前提条件、关键步骤或读者必须优先掌握的核心信息。

> [!WARNING]
> 兼容性风险、废弃接口或可能导致系统行为不符合预期的注意事项。

> [!CAUTION]
> 高危破坏性操作预警！可能导致数据永久丢失、服务中断或安全隐患。
\`\`\`

---

## 2. 五大标准类型视觉规范与设计语义

| 类型标识符 | 语义等级 | 推荐色系 | 推荐无障碍对比度要求 | 典型应用场景 |
| :--- | :--- | :--- | :--- | :--- |
| **NOTE** | 提示 / 辅助 | 蓝色 (\`#3b82f6\`) | WCAG AA 4.5:1 | 版本演进、设计背景说明 |
| **TIP** | 技巧 / 推荐 | 绿色 (\`#10b981\`) | WCAG AA 4.5:1 | 快捷键、性能优化小招 |
| **IMPORTANT** | 重要 / 必读 | 紫色 (\`#8b5cf6\`) | WCAG AA 4.5:1 | 环境前置要求、必填参数 |
| **WARNING** | 警告 / 风险 | 琥珀橙 (\`#f59e0b\`) | WCAG AA 4.5:1 | 跨版本升级 Breaking Change |
| **CAUTION** | 危险 / 破坏 | 绯红 (\`#ef4444\`) | WCAG AA 4.5:1 | 强制清库、Git Force Push |

---

## 3. DOM 解析实现与 CSS 样式规范

现代渲染器解析 AST 时，将检测引用块首行匹配 \`^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\`：
- 自动将第一行转为带有对应 SVG 图标与类型标题的 Header；
- 将外层 blockquote 转换为包含 \`.callout-block.callout-note\` 等独立语义类名的 DIV 容器；
- 配置 \`border-left: 4px solid var(--border-color)\` 与具有柔和通透感的主题浅底色。
`,

  "markdown-specs/frontmatter-and-metadata": `# YAML Frontmatter 与元数据规范指南

> 本文系统阐述现代静态站点生成器 (SSG) 与内容管理系统中广泛采用的 Frontmatter 规范，剖析 YAML/TOML/JSON 头部元数据结构、AST 灰度分词解析与类型安全校验实践。

---

## 1. Frontmatter 的起源与设计哲学

在现代文档工程（如 Hugo、Jekyll、Astro、Next.js Content Collections、VitePress 与 Obsidian）中，纯正文排版往往不足以满足工程化检索需求。文档通常伴随复杂的**元数据 (Metadata)**，例如作者信息、发布时间、分类标签、SEO 标题与渲染开关。

为了保持 Markdown 源码“纯文本自解释”的纯粹性，社区演进出将元数据放置在文件头部定界符中的做法，统称为 **Frontmatter（前置元数据）**。

\`\`\`mermaid
flowchart TD
    RawFile["Markdown 源码文件 (.md)"] --> Scanner["头部定界符扫描器 (Frontmatter Extractor)"]
    Scanner --> |提取前置元数据| MetaString["元数据块 (YAML / TOML / JSON)"]
    Scanner --> |剥离正文流| BodyString["正文 Markdown 字符流"]
    MetaString --> YAMLParser["YAML / JSON 状态机解析器"]
    YAMLParser --> SchemaValidator["Zod / TypeScript 类型契约校验"]
    SchemaValidator --> CleanMeta["结构化元数据对象 (data)"]
    BodyString --> MarkdownAST["CommonMark / GFM AST 解析器"]
    CleanMeta & MarkdownAST --> FinalDoc["最终渲染视图与上下文索引"]
\`\`\`

---

## 2. 三大主流定界符与数据格式对比

根据不同构建工具与生态习惯，Frontmatter 形成了以下主流格式规范：

| 格式标准 | 首尾定界符 | 适用工具生态 | 优缺点分析 |
| :--- | :--- | :--- | :--- |
| **YAML** (推荐) | \`---\` 与 \`---\` | Jekyll, Hugo, Astro, Obsidian, Gatsby | 可读性极强，支持层级缩进与多行文本；缩进空格敏感 |
| **TOML** | \`+++\` 与 \`+++\` | Hugo (原生推荐), Rust 工具链 | 键值结构严谨、强类型明确；层级深时书写较为冗长 |
| **JSON** | \`;;;\` 或 \`{\` \`}\` | 部分 Node.js 静态管线与自动化脚本 | 跨语言原生互通；纯文本书写时引号与逗号繁琐 |

### 2.1 标准 YAML Frontmatter 书写范例

\`\`\`yaml
---
title: "CommonMark 核心规范与语法深度解析"
slug: "commonmark-core"
description: "系统拆解 CommonMark 0.31.2 标题、列表栈与代码围栏边界。"
date: 2026-09-11T08:00:00+08:00
updated: 2026-09-11T10:30:00+08:00
author:
  name: "Darktu 文档团队"
  avatar: "/assets/avatar.webp"
categories:
  - "语法与规范"
tags:
  - "CommonMark"
  - "Markdown"
  - "AST"
draft: false
pinned: true
features:
  math: true
  mermaid: true
  toc: true
---
\`\`\`

---

## 3. 工业级通用元数据字段字典

在大型知识库或多作者写作协作中，推荐统一建立严格约定的字段字典：

- **\`title\` (string, 必需)**：词条主标题，映射为 HTML 页面的 \`<title>\` 与主大纲；
- **\`slug\` (string, 必需)**：永久路由标识，禁止包含中文或特殊字符，仅使用小写字母、数字与连字符 \`-\`；
- **\`description\` (string, 推荐)**：摘要描述，用于 Open Graph 社交卡片与全库检索副标题；
- **\`date\` (ISO 8601 string, 推荐)**：创建时间戳，格式严格遵循 \`YYYY-MM-DDTHH:mm:ssZ\`；
- **\`updated\` (ISO 8601 string, 可选)**：最后修订时间，供读者判断时效性；
- **\`draft\` (boolean, 默认 false)**：草稿状态，构建生产版本时自动过滤；
- **\`aliases\` (array of string, 可选)**：旧路由重定向映射，防止修改 slug 造成外部死链。

---

## 4. 灰度解析剥离算法与实现原理

在客户端或服务端解析引擎中，Frontmatter 的提取必须早于任何 Markdown 词法分析。以社区主流的 \`gray-matter\` 为例，其核心剥离算法遵循严格的状态机：

1. 检查文件第 1 行是否严格以 \`---\` 起始（允许前后少量不可见 BOM 字符）；
2. 逐行向下扫描，寻找第 2 个独立成行的 \`---\` 定界符；
3. 将两个定界符之间的内容提取为字符串，送入 YAML 词法分析器；
4. 将定界符之后的内容截取作为 Markdown 正文进行下一步渲染；
5. 若文件首行不包含 \`---\`，则跳过提取，全篇作为纯 Markdown 处理。

> [!TIP]
> **时区与布尔值陷阱**：在 YAML 1.1 规范中，\`yes\`、\`no\`、\`on\`、\`off\` 会被自动隐式转为布尔值。书写包含这些单词的标语或文件名时，务必用双引号包裹（如 \`country: "NO"\`），避免被错误解析为 \`false\`。
`,

  "markdown-specs/edge-cases-and-gotchas": `# Markdown 语法陷阱与歧义解析

> 本文系统梳理 Markdown 在日常写作与工程落地中最易踩坑的 6 大语法模糊边界、不同引擎解析差异与权威避坑范式。

---

## 1. 列表与缩进：“4 空格 vs 2 空格”陷阱

列表是所有 Markdown 方言中歧义最多的语法结构。最常见的争议在于列表项中嵌套段落或子列表时的缩进要求。

### 1.1 核心分歧：松散列表 (Loose List) 与紧凑列表 (Tight List)
根据 CommonMark 规范，列表分为两种状态：
- **紧凑列表 (Tight List)**：列表项之间**没有空行**，解析为紧凑的 \`<li>item</li>\`，不包裹 \`<p>\` 标签；
- **松散列表 (Loose List)**：列表项之间**存在空行**，解析器会自动为每一个列表项包裹 \`<p>item</p>\`，造成纵向行间距骤增。

\`\`\`markdown
<!-- 紧凑列表：行间距紧凑自然 -->
- 第一条特性说明
- 第二条特性说明
- 第三条特性说明

<!-- 松散列表：由于第 2 项后多了一个空行，整组列表全部降级为松散段落 -->
- 第一条特性说明

- 第二条特性说明
- 第三条特性说明
\`\`\`

### 1.2 嵌套代码块必须使用 4 空格还是 2 空格？
在原始 CommonMark 规范中，列表内部嵌套内容需以**列表项标记后的第一个非空字符位置**对齐（通常缩进 2 或 4 个空格）。若缩进不足，解析器会将代码块误判为上一级的同级段落。

---

## 2. 连续有序列表的编号错乱与断裂

在撰写长教程时，常需要在两个有序列表项之间插入一段说明或代码块：

\`\`\`markdown
1. 安装依赖包：
   \`\`\`bash
   npm install
   \`\`\`
2. 配置环境变量并启动开发服务。
\`\`\`

> [!IMPORTANT]
> **关键避坑**：中间插入的代码块必须**保持 3 个空格的层级缩进**（与上一行列表文本对齐）。若顶格书写，解析器将认定第 1 项已终结，并将后续的 \`2.\` 重新重置为新的独立列表从 1 重新起步！

---

## 3. 围栏代码块内的反引号逃逸技巧

当撰写介绍 Markdown 语法的文档时，经常需要在代码块内部展示另一个三反引号代码块（\`\`\`）。如果直接书写，外部代码块会在遇到内层反引号时提前闭合。

### 3.1 扩展围栏数量原则 (Fence Extension)
CommonMark 规定：**外部围栏反引号的数量只要多于内部反引号，即可安全包裹**！

\`\`\`markdown
\`\`\`\`markdown
这里是外部代码块，使用 4 个反引号定界

\`\`\`javascript
// 内部嵌套的代码块，包含 3 个反引号
console.log("Hello Darktu Docs");
\`\`\`
\`\`\`\`
\`\`\`

---

## 4. 表格单元格内的竖线与多行排版

根据 GFM 规范，表格以竖线 \`|\` 作为列分隔符。当单元格内容本身包含竖线字符（如位运算 \`a | b\` 或逻辑或 \`||\`）时，会导致表格列数计算失真。

### 4.1 转义竖线与行内代码技巧
- **方案 A（转义反斜杠）**：在竖线前添加反斜杠 \`\\|\`；
- **方案 B（行内代码反引号保护）**：在代码标记中使用转义或 HTML 实体 \`&#124;\`。

| 场景需求 | 错误书写范式 | 正确推荐范式 |
| :--- | :--- | :--- |
| **管道操作符** | \`ls \\| grep txt\` 破坏列对齐 | 使用转义 \`ls \\| grep txt\` 或 \`&#124;\` |
| **单元格内换行** | 直接按 Enter 回车换行造成表格中断 | 单元格内插入 HTML \`<br/>\` 换行标签 |
| **单元格内多段落** | 语法不支持 | 拆分为多个独立表格或使用提示块 Callout |

---

## 5. HTML 标签误解析与转义

当正文中出现类似数学比较符 \`< 5\` 或泛型 \`Array<T>\` 时，某些解析器会将 \`<T>\` 识别为未知 HTML 标签而静默吞掉内容。

- **泛型与尖括号**：必须始终包裹在行内代码中（如 \`Array<T>\`）或转义为实体 \`&lt;T&gt;\`；
- **裸露网址**：建议始终使用成对的尖括号包裹（如 \`<https://docs.darktu.com>\`）或使用标准超链接 \`[链接文字](url)\`，避免依赖不稳定的非标准自动链接嗅探。
`
};

