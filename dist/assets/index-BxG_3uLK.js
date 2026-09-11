(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[{id:`markdown-specs`,title:`1. 语法与规范`,badge:`5 篇`,items:[{id:`markdown-specs/spec-evolution`,slug:`overview`,aliasSlugs:[`spec-evolution`],title:`Markdown 发展史与方言差异`,description:`CommonMark、GFM、Markdown Extra 与 Pandoc 的设计哲学、文法演进与 AST 解析管线对比。`},{id:`markdown-specs/commonmark-core`,slug:`syntax`,aliasSlugs:[`basic-syntax`,`commonmark-core`],title:`CommonMark 核心规范解析`,description:`ATX 与 Setext 标题、定界符栈算法、松散与紧凑列表、区块引用及围栏代码块。`},{id:`markdown-specs/gfm-extensions`,slug:`gfm-extensions`,title:`GFM 扩展规范手册`,description:`结构化表格对齐、任务列表、删除线、自动超链接与 Emoji 简码扩展用法。`},{id:`markdown-specs/advanced-markdown`,slug:`advanced-markdown`,title:`高级排版特性与 HTML 嵌入`,description:`学术脚注 Footnotes 语法、定义列表与 HTML5 标签安全子集及清洗机制。`},{id:`markdown-specs/callouts-spec`,slug:`callouts`,title:`现代 Callout 提示块指南`,description:`[!NOTE]、[!TIP]、[!IMPORTANT]、[!WARNING]、[!CAUTION] 五大提示块语法体系。`}]},{id:`typography`,title:`2. 中文排版学`,badge:`4 篇`,items:[{id:`typography/w3c-clreq`,slug:`w3c-clreq`,title:`W3C 中文排版需求 (CLReq) 要点`,description:`汉字网格概念、字身框与字面比、最佳行长限制与行距呼吸律动标准。`},{id:`typography/pangu-spacing`,slug:`pangu-spacing`,title:`盘古之白：中西文混排规范`,description:`中西文及数字间隙四分之一汉字宽规则、特定标点豁免场景与处理机制。`},{id:`typography/punctuation-system`,slug:`punctuation-system`,title:`中文标点规范与避头尾法则`,description:`GB/T 15834 标点标准、避头尾折行禁则 (Line Breaking) 与标点挤压计算模型。`},{id:`typography/visual-hierarchy`,slug:`visual-hierarchy`,title:`版面视觉节奏与字阶体系`,description:`调和音阶模块化字号阶梯、行高系数计算、段落间距与标题亲密性法则。`}]},{id:`math`,title:`3. 数学公式与符号`,badge:`4 篇`,items:[{id:`math/latex-fundamentals`,slug:`latex-fundamentals`,title:`LaTeX 数学公式基础语法`,description:`行内与块级公式定界符、上下标、分式、根号、求和积分与自适应括号。`},{id:`math/katex-vs-mathjax`,slug:`katex-vs-mathjax`,title:`KaTeX 与 MathJax 引擎对比`,description:`DOM 渲染速度基准测试、资源体积对比与富文本复制中的公式转换方案。`},{id:`math/matrices-and-cases`,slug:`matrices-and-cases`,title:`复杂数学矩阵与分段函数排版`,description:`matrix/pmatrix/bmatrix 矩阵环境、cases 分段函数与 aligned 连等式对齐实战。`},{id:`math/scientific-symbols`,slug:`scientific-symbols`,title:`数学、物理与希腊字母速查表`,description:`24 个希腊字母大小写对照、集合算子、微积分算子与逻辑命题速查表。`}]},{id:`diagrams`,title:`4. 代码高亮与图表`,badge:`5 篇`,items:[{id:`diagrams/syntax-highlighting`,slug:`syntax-highlighting`,title:`代码高亮机制与写作规范`,description:`Prism.js 正则分词 vs Shiki TextMate 机制、行号高亮与 Diff 补丁书写规范。`},{id:`diagrams/mermaid-flowchart`,slug:`mermaid-flowcharts`,title:`Mermaid 流程图建模指南`,description:`拓扑流动方向、8 种几何节点形状、条件分支连接线与 Subgraph 架构分层。`},{id:`diagrams/mermaid-sequence`,slug:`mermaid-sequence`,title:`Mermaid 时序图交互建模`,description:`Actor 与 Participant 声明、同步/异步消息序列与生命周期激活柱控制。`},{id:`diagrams/mermaid-class-er`,slug:`mermaid-class-er`,title:`Mermaid 类图、状态机与 ER 模型`,description:`数据库关系实体属性定义、有限状态机流转建模与甘特图里程碑规划。`},{id:`diagrams/mermaid-git-mindmap`,slug:`mermaid-git-mindmap`,title:`Mermaid Git 拓扑图与思维导图`,description:`Git Graph 提交/分支/合并拓扑图与 Mindmap 树形发散节点绘制指南。`}]},{id:`clipboard`,title:`5. 富文本与剪贴板`,badge:`4 篇`,items:[{id:`clipboard/clipboard-mime-inliner`,slug:`clipboard-mime-inliner`,title:`剪贴板机制：MIME 与 CSS 行内化`,description:`多重数据包机制、宿主环境外部样式剥离风险与 Inliner 特异性权重合并原理。`},{id:`clipboard/wechat-engine-sandbox`,slug:`wechat-sandbox`,title:`微信公众平台富文本排版沙箱`,description:`外链转文末脚注处理、网络字体限制与微信后台安全样式白名单全景。`},{id:`clipboard/multiplatform-publishing`,slug:`multiplatform-publishing`,title:`多平台富文本排版适配要点`,description:`知乎公式映射、掘金技术专栏渲染特性与多平台一键分发调度器架构设计。`},{id:`clipboard/svg-canvas-rendering`,slug:`svg-canvas-rendering`,title:`SVG 矢量渲染与 Canvas 长图绘制`,description:`foreignObject 虚拟化、Retina 高分抗锯齿缩放与 CORS 跨域污染防御策略。`}]},{id:`assets`,title:`6. 媒体资源与存储`,badge:`3 篇`,items:[{id:`assets/image-hosting-arch`,slug:`image-hosting-arch`,title:`图床架构：S3 / R2 / OSS 签名体系`,description:`传统服务端中转弊端、客户端预签名直传机制与三大存储服务特性对比。`},{id:`assets/nextgen-image-formats`,slug:`nextgen-image-formats`,title:`下一代图片格式：WebP 与 AVIF`,description:`JPEG/PNG 与 WebP/AVIF 压缩比评测与 <picture> 标签渐进式加载方案。`},{id:`assets/cdn-and-security`,slug:`cdn-and-security`,title:`防盗链机制、CDN 缓存与隐私擦除`,description:`HTTP Referer 鉴权白名单、图片 EXIF GPS 经纬度本地强制擦除算法。`}]},{id:`writing`,title:`7. 写作实践与合规`,badge:`4 篇`,items:[{id:`writing/technical-writing-guide`,slug:`technical-writing-guide`,title:`技术写作风格指南与信息架构`,description:`金字塔原理、开发者写作准则、人机协同辅助规范与无歧义术语表。`},{id:`writing/dfa-compliance-filter`,slug:`dfa-compliance-filter`,title:`内容合规：DFA 有限状态机算法`,description:`广告法违禁词检测、Trie 前缀树构建、O(N) 极速扫描与跳字干扰过滤。`},{id:`writing/open-licenses-copyright`,slug:`open-licenses-copyright`,title:`数字出版版权：知识共享 (CC) 协议`,description:`CC BY-NC-SA 4.0 组合定义、MIT/Apache/GPL 软件协议选择与合理引用准则。`},{id:`writing/local-first-architecture`,slug:`local-first-architecture`,title:`本地优先 (Local-First) 离线存储架构`,description:`零延迟输入准则、数据所有权、IndexedDB 事务库与快照版本比对回滚。`}]},{id:`appendix`,title:`8. 术语索引与维护`,badge:`2 篇`,items:[{id:`appendix/glossary`,slug:`glossary`,title:`常见术语索引表 (Glossary)`,description:`按字母顺序收录 AST、CommonMark、KaTeX、Pangu 等核心术语概念与速查定义。`},{id:`appendix/maintenance-guide`,slug:`maintenance-guide`,title:`知识库编写与持续维护指引`,description:`维基百科式开放条目组织规则、如何新增词条、自动化校验测试与 GitHub 贡献流程。`}]}],t=e.flatMap(e=>e.items.map(t=>({...t,categoryId:e.id,categoryTitle:e.title})));function n(e){let n=(e||``).replace(/^#\/?/,``).trim();n||=`overview`;let r=t.findIndex(e=>e.slug===n||e.id===n||e.aliasSlugs&&e.aliasSlugs.includes(n)),i=r===-1?t[0]:t[r],a=r===-1?0:r;return{doc:i,prev:a>0?t[a-1]:null,next:a<t.length-1?t[a+1]:null}}var r={"markdown-specs/spec-evolution":`# Markdown 发展史与主流方言演进规范

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
| **CommonMark** | Jeff Atwood, John MacFarlane 等 | 业界唯一严格的形式化数学规范 | 消除所有二义性、600+ 规范用例套件、AST 明确映射 | \`cmark\` (C), \`markdown-it\` (JS) |
| **GFM (GitHub Flavored)** | GitHub 官方 | 基于 CommonMark 的开发者扩展集 | 扩展表格、任务列表、删除线、自动链接、Emoji | \`cmark-gfm\`, \`comrak\` (Rust) |
| **Markdown Extra** | Michel Fortin | PHP 社区经典扩展 | 脚注 (Footnotes)、定义列表、代码块自定义属性 | \`php-markdown\`, \`Python-Markdown\` |
| **Pandoc Markdown** | John MacFarlane | 学术界与出版界全能通用中间语言 | 超全数学公式、文献引用、多列排版、元数据 YAML | \`pandoc\` (Haskell) |

---

## 3. 解析器架构分层：从正则替换到 AST 抽象语法树

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
`,"markdown-specs/commonmark-core":"# CommonMark 核心规范与语法深度解析\n\n> 本文以 CommonMark 0.31.2 官方规范为基准，详细阐述 Markdown 基础语法的严格语义边界、定界符栈机制与边缘解析场景。\n\n---\n\n## 1. 标题语法 (Headings) 与 Setext 规范\n\n### 1.1 ATX 标题（推荐标准）\n使用 `#` 作为前缀，支持 1 至 6 级标题。\n\n```markdown\n# 一级主标题 (Title 1)\n## 二级章节标题 (Title 2)\n### 三级小节标题 (Title 3)\n#### 四级标题 (Title 4)\n##### 五级标题 (Title 5)\n###### 六级标题 (Title 6)\n```\n\n> [!IMPORTANT]\n> **规范红线**：根据 CommonMark 规范，`#` 与后续正文之间**必须包含至少一个空格**（例如 `# 标题` 合法，而 `#标题` 在标准解析器中将被作为普通段落文本对待）。末尾可选对称的 `#` 关闭符号。\n\n### 1.2 Setext 标题（底线下划线风格）\n在文本下一行使用 `=` 或 `-` 标记，仅支持一、二级标题：\n```markdown\n这是一级标题\n=============\n\n这是二级标题\n-------------\n```\n\n---\n\n## 2. 强调与加粗的定界符算法 (Emphasis and Strong Emphasis)\n\nMarkdown 支持使用星号 `*` 或下划线 `_` 表达语义强调。在 CommonMark 中，强调不是简单的匹配，而是严格基于 **定界符游程 (Delimiter Run)** 算法：\n\n| 语法书写 | 渲染效果 | HTML 语义标签 | 规范规则 |\n| :--- | :--- | :--- | :--- |\n| `*斜体强调*` 或 `_斜体强调_` | *斜体强调* | `<em>斜体强调</em>` | 单定界符左右匹配 |\n| `**粗体强调**` 或 `__粗体强调__` | **粗体强调** | `<strong>粗体强调</strong>` | 双定界符左右匹配 |\n| `***粗斜体结合***` | ***粗斜体结合*** | `<strong><em>粗斜体</em></strong>` | 三定界符嵌套 |\n\n> [!TIP]\n> **中英文混排避坑指南**：在中文排版中，推荐统一使用星号 `*文字*` 与 `**文字**`。下划线 `_` 在 CommonMark 中包含“词内强调限制（Intraword Emphasis Restriction）”，下划线与中文字符相邻时可能判定为单词内部连接符导致加粗失效。\n\n---\n\n## 3. 列表体系：松散列表 (Loose) 与紧凑列表 (Tight)\n\n### 3.1 无序列表与有序列表\n```markdown\n- 无序列表项 A\n- 无序列表项 B\n  - 二级缩进列表（缩进 2 个或 4 个空格）\n  - 二级缩进列表项\n\n1. 有序项第一点（数字无需连续，解析器将自动重新编号）\n2. 有序项第二点\n3. 有序项第三点\n```\n\n### 3.2 列表的核心区别：松散 (Loose) vs 紧凑 (Tight)\n这是 Markdown 最常令人困惑的特性：\n- **紧凑列表 (Tight List)**：列表项之间没有空行。HTML 输出为纯 `<li>文本</li>`，无段落标签，上下行距紧凑；\n- **松散列表 (Loose List)**：只要列表中**任何两个项之间存在空行**，整个列表自动升格为松散列表，每个列表项包裹 `<p>` 标签：\n  ```html\n  <li><p>列表项内容</p></li>\n  ```\n  在自媒体或网页排版中会导致列表项间隙剧增。\n\n---\n\n## 4. 区块引用 (Blockquotes) 嵌套与惰性延续 (Lazy Continuation)\n\n区块引用通过行首 `>` 声明，支持任意深度嵌套与多块混合：\n\n```markdown\n> 这是第一层区块引用。\n>\n> > 这是嵌套在内部的二级引用，包含专业术语解释。\n>\n> 引用内可以直接编写列表与代码：\n> - 引用中的列表项 1\n> - 引用中的列表项 2\n```\n\n---\n\n## 5. 代码展示：行内代码与围栏代码块 (Fenced Code Blocks)\n\n### 5.1 行内代码 (Inline Code)\n使用单反引号 `` `code` `` 包裹。若代码内部本身包含反引号，可以使用双反引号包裹：\n```markdown\n在文本中提到 `const status = true;` 变量。\n如果要显示反引号自身：`` `code` ``\n```\n\n### 5.2 围栏代码块 (Fenced Code Blocks)\n使用 3 个以上的反引号 ``` 或波浪号 `````` 包裹，首行提供语言信息字符串（Info String）：\n```typescript\ninterface UserProfile {\n  id: string;\n  name: string;\n  role: 'admin' | 'creator';\n}\n```\n","markdown-specs/gfm-extensions":'# GitHub Flavored Markdown (GFM) 扩展规范手册\n\n> GFM 是当今开源界与商业开发者软件事实上的第一标准。本文系统梳理 GFM 在 CommonMark 基础之上引入的核心扩展。\n\n---\n\n## 1. 结构化表格语法 (Tables)\n\nGFM 表格通过管道符 `|` 与连字符 `-` 组织，第二行必须是表头分隔线，并支持通过冒号 `:` 声明对齐属性：\n\n```markdown\n| 参数名称 (Name) | 类型 (Type) | 默认值 (Default) | 字段语义描述 |\n| :--- | :---: | ---: | :--- |\n| **apiKey** | `string` | `null` | 调用开放平台的鉴权令牌 |\n| **timeout** | `number` | `5000` | 客户端 HTTP 超时等待阈值 (ms) |\n| **autoRetry**| `boolean`| `true` | 网络抖动时是否自动触发指数退避 |\n```\n\n### 对齐规则解析：\n- `:---`：文本左对齐（默认文本规范）；\n- `:---:`：居中对齐（常用于状态、枚举、布尔值）；\n- `---:`：右对齐（常用于数值、价格、耗时等统计指标）。\n\n---\n\n## 2. 任务列表 (Task Lists / Checklist)\n\n任务列表在无序列表的基础之上引入复选框语义：\n\n```markdown\n- [x] 完成 CommonMark 语法解析器内核基线重构\n- [x] 部署 Cloudflare Pages 独立二级域名 docs.darktu.com\n- [ ] 编写微信公众号排版引擎富文本沙箱白名单白皮书\n- [ ] 实施全库 LaTeX 数学公式 KaTeX 高清渲染回归测试\n```\n\n### 语义化 HTML 输出：\nGFM 规范要求将任务列表渲染为不可点击或只读的勾选框元素，并附带专属属性：\n```html\n<ul>\n  <li><input type="checkbox" checked disabled> 完成 CommonMark 语法解析器内核基线重构</li>\n  <li><input type="checkbox" disabled> 编写微信公众号排版引擎富文本沙箱白名单白皮书</li>\n</ul>\n```\n\n---\n\n## 3. 删除线语法 (Strikethrough)\n\n使用双波浪号 `~~` 包裹需要废弃或删除的文本，在 HTML 中对应 `<del>` 语义标签：\n\n```markdown\n~~旧版本 API `fetchDataLegacy()` 已正式废弃~~，请迁移至全新异步流式接口 `useDataStream()`.\n```\n渲染呈现：~~旧版本 API fetchDataLegacy() 已正式废弃~~，请迁移至全新异步流式接口 useDataStream().\n\n---\n\n## 4. 自动超链接拓展 (Autolinks Extension)\n\n在标准 CommonMark 中，超链接必须写为 `<https://example.com>` 或 `[文本](https://example.com)`。而在 GFM 扩展中，以下合规协议的裸文本 URL 会自动转为可点击的超链接：\n- `https://darktu.com` -> 自动识别为 `<a href="https://darktu.com">https://darktu.com</a>`\n- `mailto:support@darktu.com` -> 自动识别为邮件点击\n- `www.github.com` -> 带有 `www.` 前缀的域名自动补全 `http://` 协议并链接。\n',"markdown-specs/advanced-markdown":'# Markdown 高级排版特性与 HTML5 嵌入规范\n\n> 当标准语法无法满足学术专著、复杂书籍或精细化排版需求时，Markdown 社区制定了脚注、元数据定义与 HTML5 混合渲染的行业准则。\n\n---\n\n## 1. 学术脚注语法 (Footnotes)\n\n脚注在学术论文、深度研究特稿中是不可或缺的参考文献与注释工具：\n\n```markdown\n现代编译器前端架构[^1]通过多遍 AST 遍历实现代码优化，根据最新的 W3C 标准建议[^w3c]，排版时应保持字符边界清晰。\n\n[^1]: Aho, Alfred V., et al. "Compilers: Principles, Techniques, and Tools." Addison-Wesley, 2006.\n[^w3c]: W3C 中文排版需求标准 (CLReq), 2024 年修订版.\n```\n\n### 渲染行为与跳转机制：\n1. 正文中引用位置自动生成上标锚点超链接 `<sup><a href="#fn-1">[1]</a></sup>`；\n2. 文章最底部自动汇编所有脚注列表，并生成带反向回溯链接（Backlink `↩`) 的脚注容器。\n\n---\n\n## 2. 嵌入原生 HTML5：安全子集与消毒机制 (Sanitization)\n\nMarkdown 原生设计允许混入 HTML 标签。然而在多用户或自媒体系统中，任意 HTML 会带来严重的 XSS 跨站脚本攻击或破坏页面 DOM 树。\n\n### 2.1 业界通用白名单标签集\n| 允许保留的 HTML 标签 | 典型应用场景 | 属性限制规则 |\n| :--- | :--- | :--- |\n| `<u>`, `<mark>` | 下划线强调、高亮背景文字 | 仅允许样式类或安全 inline-style |\n| `<sub>`, `<sup>` | 化学分子式（H~2~O）、代数平方（X^2^） | 禁止包含脚本属性 |\n| `<kbd>` | 键盘按键提示，如 `<kbd>Ctrl</kbd> + <kbd>C</kbd>` | 纯行内元素 |\n| `<details>`, `<summary>` | 原生折叠内容面板，常用于答案、补充代码 | `open` 属性可选 |\n\n### 2.2 必须机械剥离的高危标签黑名单\n必须通过 HTML Sanitizer 自动剔除以下标签与属性：\n- ❌ `<script>`, `<iframe>`, `<object>`, `<embed>`：杜绝外部脚本注入；\n- ❌ `onclick`, `onerror`, `onload` 等一切 `on*` 事件监听器；\n- ❌ 带有 `javascript:` 伪协议的 `<a href="...">` 链接。\n',"markdown-specs/callouts-spec":`# 现代 Callout / Admonition 提示块标准化指南

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

现代渲染器解析 AST 时，将检测引用块首行匹配 \`^>s*[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)]\`：
- 自动将第一行转为带有对应 SVG 图标与类型标题的 Header；
- 将外层 blockquote 转换为包含 \`.callout-block.callout-note\` 等独立语义类名的 DIV 容器；
- 配置 \`border-left: 4px solid var(--border-color)\` 与具有柔和通透感的主题浅底色。
`},i={"typography/w3c-clreq":`# W3C 中文排版需求 (CLReq) 核心原则与现代 Web 落地指南

> W3C 国际化工作组发布的《Requirements for Chinese Text Layout》（中文排版需求）是东亚表意文字排版学在数字时代的奠基性行业标准。

---

## 1. 汉字网格哲学：字符字身框与字面比

中文排版与西文排版有着本质不同：
- **西文（Alphabetic）**：基于基线（Baseline）、x-height、上伸部（Ascender）与下延部（Descender）的不定宽变宽字体结构；
- **汉字（Hanzi / CJK）**：根植于**正方形活字网格（Em-square）**，每一个汉字均在一个固定的全形正方形字身框（Character Frame）中构图。

### 1.2 字面比 (Face-to-Body Ratio) 对阅读密度的影响
字身框是虚拟外框，而实际笔画墨迹占据的区域称为“字面（Letter Face）”：
- **传统宋体/明体**：字面率约为 85%~90%，字间保留天然白虚线呼吸感，适合纸质书刊长文阅读；
- **现代屏显黑体（如苹方、思源黑体）**：字面率扩大至 92%~95%，在高分屏上视觉冲击力强，但若行距不足极易造成拥挤与视觉疲劳。

---

## 2. 横排与竖排的字行行距基准

根据 W3C CLReq 标准：
- **行长 (Line Length)**：中文正文单行最佳字数应当控制在 **35 至 45 个汉字** 之间。单行超过 50 个汉字将导致换行寻行视线折返丢失（Tracking Loss）；
- **行距 (Line Gap / Leading)**：汉字行距绝对不能沿用英文排版的 1.2 倍默认值。标准要求行空必须在 **0.5em 至 0.8em** 之间，即 CSS \`line-height\` 必须设定为 **1.6 至 1.85**。

\`\`\`css
/* W3C 推荐的现代 Web 中文正文标准排版类 */
.article-reading-body {
  max-width: 68ch; /* 单行限制约 34-40 个全角字符 */
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
  font-size: 16px;
  line-height: 1.75;
  letter-spacing: 0.02em; /* 屏显微量字间微调 */
  text-align: justify;   /* 两端对齐保证方块网格边缘整齐 */
}
\`\`\`
`,"typography/pangu-spacing":`# 盘古之白：中西文与数字混排空白规范

> “有研究显示，打字的时候不喜欢在中文和英文之间加空格的人，感情路都走得很辛苦。” —— 盘古之白项目宣言。
> 盘古之白规范旨在修复汉字与西文字母挤压在一起的视觉黏连问题，恢复字距呼吸律动。

---

## 1. 核心空格准则（什么场景必须加空格）

在印刷时代，西文铅字与中文铅字之间天然存在字距调节空间。但在数字排版中，中英文必须显式留出 **四分之一汉字宽（Quarter-em Space, U+2005）** 或由空格符隔开：

### 1.1 中文与西文单词之间必须留出空格
- ✅ **正确**：推荐使用 \`Node.js\` 编写高性能中间件服务。
- ❌ **错误**：推荐使用Node.js编写高性能中间件服务。

### 1.2 中文与半角阿拉伯数字之间必须留出空格
- ✅ **正确**：该集群节点将在 15 分钟内处理完成 500 万行日志数据。
- ❌ **错误**：该集群节点将在15分钟内处理完成500万行日志数据。

### 1.3 中文与带有行内代码包裹的词组之间必须留出空格
- ✅ **正确**：使用 \`git push --force\` 时必须谨慎对待。
- ❌ **错误**：使用\`git push --force\`时必须谨慎对待。

---

## 2. 豁免准则（什么场景绝对禁止加空格）

盲目添加空格同样会破坏中文整体感。以下场景严禁追加空格：

1. **中文与全角标点符号之间禁止空格**：
   - ✅ 正确：你好，世界！
   - ❌ 错误：你好 ， 世界 ！
2. **数字与度量衡单位符号（如 %、℃、°）之间禁止空格**：
   - ✅ 正确：CPU 占用率已超过 95.8%，系统温度上升 3℃。
   - ❌ 错误：CPU 占用率已超过 95.8 %，系统温度上升 3 ℃。
3. **英文专有名词内部连字符禁止空格**：
   - ✅ 正确：这是一个 Local-First 理念的离线编辑器。
   - ❌ 错误：这是一个 Local - First 理念的离线编辑器。

---

## 3. 自动化排版算法：状态机与正则自动化实现

在工程实践中，依靠人工敲击空格极其低效。成熟系统采用盘古算法进行 AST 遍历与正向后向文本过滤：

\`\`\`javascript
/**
 * 盘古之白核心正则替换实现
 */
export function panguSpacing(text) {
  // 1. 中文与英文/数字之间补足空格
  return text
    .replace(/([\\u4e00-\\u9fa5])([a-zA-Z0-9])/g, '$1 $2')
    .replace(/([a-zA-Z0-9])([\\u4e00-\\u9fa5])/g, '$1 $2')
    // 2. 清除全角标点与中英文之间多余的空格
    .replace(/([\\u4e00-\\u9fa5])\\s+([，。！？；：、])/g, '$1$2')
    .replace(/([，。！？；：、])\\s+([\\u4e00-\\u9fa5])/g, '$1$2');
}
\`\`\`
`,"typography/punctuation-system":"# 中文标点符号使用标准与标点挤压排版学\n\n> 根据中华人民共和国国家标准 GB/T 15834-2011《标点符号用法》，系统梳理现代排版中的避头尾法则与标点挤压计算模型。\n\n---\n\n## 1. 中文标点符号分类与全角/半角准则\n\n中文排版中，标点符号必须占据**全角字符宽度（1em）**，绝对禁止在中文段落中滥用半角英文字符：\n\n| 标点类别 | 规范符号 | 禁用半角劣质符号 | 排版空间占比 |\n| :--- | :--- | :--- | :--- |\n| **句末点号** | 句号 `。`、问号 `？`、叹号 `！` | `.` `?` `!` | 1 个全角字宽 |\n| **句内点号** | 逗号 `，`、顿号 `、`、分号 `；`、冒号 `：` | `,` `;` `:` | 1 个全角字宽 |\n| **标号** | 引号 `“ ” ‘ ’`、书名号 `《 》`、破折号 `——`、省略号 `……` | `\" ` `' ` `--` `...` | 前后半角或双字宽 |\n\n---\n\n## 2. 避头尾法则 (Kinsoku Shori / Line Breaking Rules)\n\n排版引擎在自动折行时，必须遵守严格的物理禁则：\n\n### 2.1 禁则一：禁止出现在行首的标点 (避头标点)\n下列标点**绝不允许孤立出现在一行的第一个位置**：\n- 句末与句内点号：`， 。 、 ； ： ？ ！`\n- 闭括号与后引号：`） 】 》 ” ’ 〉 〕`\n\n> **排版引擎处理算法**：若自然折行后发现行首是避头标点，必须将前一行的最后一个汉字强行“拉下”至下一行，与该标点绑定为不可分割的连字元组。\n\n### 2.2 禁则二：禁止出现在行尾的标点 (避尾标点)\n下列标点**绝不允许出现在一行的最后一个位置**：\n- 开括号与前引号：`（ 【 《 “ ‘ 〈 〔`\n\n---\n\n## 3. 标点挤压排版学 (Punctuation Squeeze)\n\n由于中文全角点号在字身框中大多靠左或靠右，导致点号四周存在大量空白：\n1. **连续点号挤压**：当出现“闭引号”紧接“逗号”（如 `“……”，`）时，两个全角标点若均占 1em，会产生令人难堪的巨大空白。排版学要求将两标点间距挤压为各占 0.5em，合占 1em；\n2. **行首行尾对齐挤压**：当行首是开引号时，应当向左微调 0.5em 形成悬挂缩进（Hanging Punctuation），使得汉字主体网格严格垂直对齐。\n","typography/visual-hierarchy":`# 版面视觉节奏与字号行高黄金比例体系

> 优秀的排版不是简单地堆砌大号字体，而是通过数学级字号阶梯、段落间距留白与行宽约束，创造出如音乐般的阅读节奏感。

---

## 1. 经典模块化字阶体系 (Modular Scale)

在数字技术出版中，字号严禁随意手写像素值，推荐基于调和音阶比率（如 Major Second 1.125、Minor Third 1.2、Major Third 1.25）建立字阶：

| 语义层级 | 比例计算公式 (基准 16px) | 渲染像素大小 | 行高系数 (Line Height) | 字重 (Font Weight) |
| :--- | :--- | :--- | :--- | :--- |
| **正文正文 (Body)** | \`16px 	imes 1.000\` | 16px | 1.75 (28px) | 400 (Regular) |
| **小节三级标题 (H3)** | \`16px 	imes 1.250\` | 20px | 1.40 (28px) | 600 (Semi-bold) |
| **章节二级标题 (H2)** | \`16px 	imes 1.500\` | 24px | 1.30 (31px) | 700 (Bold) |
| **主标题一级 (H1)** | \`16px 	imes 2.000\` | 32px | 1.20 (38px) | 800 (Extra-bold) |
| **辅助注释/代码小注** | \`16px 	imes 0.875\` | 14px | 1.50 (21px) | 400 (Regular) |

---

## 2. 段落间距与呼吸感控制法则

1. **段前段后边距 (Margin Collapse)**：段落与段落之间应当使用显式垂直间距（推荐 \`margin: 1.2em 0\`），杜绝传统首行空两格（\`&emsp;&emsp;\`）的陈旧做法。在现代屏显阅读中，垂直空白分离比水平首行缩进具有更强的信息分块辨识度；
2. **标题与内容的亲密性原则 (Law of Proximity)**：
   - 标题上方间距（段前距）必须**显著大于**标题下方间距（段后距）；
   - 标准比例：**段前距 : 段后距 = 2.5 : 1**。确保标题在视觉上明确与其下属内容紧密关联，而不是漂浮在两个段落正中间。
`},a={"math/latex-fundamentals":"# LaTeX 数学公式核心语法全景指南\n\n> LaTeX（基于 TeX 排版引擎）是全球科学计算、学术论文与工程建模事实上的通用语言。本文系统解析行内公式与块级公式的语法核心。\n\n---\n\n## 1. 公式定界符与环境模式\n\n在 Markdown 中，公式通过美元符号 `$` 进行定界：\n\n### 1.1 行内公式 (Inline Math)\n使用单个美元符号包裹：`$E = mc^2$`。公式嵌入在文字行内，与周围文本共享垂直基线：\n- 源码：`根据质能方程 $E = mc^2$，质量与能量成正比。`\n- 效果：根据质能方程 $E = mc^2$，质量与能量成正比。\n\n### 1.2 独立块级居中公式 (Display Math)\n使用双美元符号包裹，单独成段居中呈现，字体比行内模式更舒展完整：\n```latex\n$$\nf(x) = \\int_{-\\infty}^{+\\infty} \\hat{f}(\\xi) \\, e^{2\\pi i \\xi x} \\, d\\xi\n$$\n```\n\n---\n\n## 2. 常用基础数学结构全览\n\n| 数学结构 | LaTeX 语法代码 | 渲染结果 | 注意事项 |\n| :--- | :--- | :---: | :--- |\n| **上下标** | `x_i^2 + y_{n+1}^{k-1}` | $x_i^2 + y_{n+1}^{k-1}$ | 多字符下标必须用大括号 `{}` 包裹 |\n| **分数 (Fraction)** | `\\frac{a + b}{c - d}` | $\\frac{a + b}{c - d}$ | 嵌套过多建议使用斜杠 `/` 或 `\\dfrac` |\n| **根号 (Square Root)**| `\\sqrt[n]{x^2 + 1}` | $\\sqrt[n]{x^2 + 1}$ | `[n]` 为可选开方次数参数 |\n| **求和与连乘** | `\\sum_{i=1}^n i = \\frac{n(n+1)}{2}` | $\\sum_{i=1}^n i = \\frac{n(n+1)}{2}$ | 块级模式上下标置于符号正上正下 |\n| **定积分** | `\\int_0^{\\frac{\\pi}{2}} \\sin(x) \\, dx = 1` | $\\int_0^{\\frac{\\pi}{2}} \\sin(x) \\, dx = 1$ | `\\,` 生成微元薄间隔空白 |\n| **极限** | `\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1` | $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$ | 箭头使用 `\\to` 或 `\\rightarrow` |\n\n---\n\n## 3. 自适应括号与分隔符大小\n\n若直接书写普通括号 `( \\frac{a}{b} )`，括号高度无法随分数拉长。必须使用 `\\left` 与 `\\right` 动态包裹：\n\n```latex\n$$\n\\left( \\frac{x^2 + 1}{y^2 - 1} \\right) \\times \\left[ \\sum_{k=1}^m \\frac{1}{k} \\right]\n$$\n```\n","math/katex-vs-mathjax":`# KaTeX 与 MathJax 科学排版引擎性能与兼容性对比

> 在 Web 端和自媒体富文本生态中，KaTeX 与 MathJax 是两大绝对主流渲染方案。了解两者的底层实现与技术选型至关重要。

---

## 1. 底层架构与性能基准对比

| 对比维度 | KaTeX (Khan Academy 出品) | MathJax (AMS/SIAM 联合主导) |
| :--- | :--- | :--- |
| **渲染机制** | 纯同步静态 HTML/CSS 输出（无回流） | 异步排版，支持 WebGL/SVG/CommonHTML |
| **首屏渲染速度** | **快 10~100 倍**，毫秒级立等可取 | 较重，长公式文档存在明显闪烁或延迟 |
| **包体积** | 约 300KB (精简高效) | 2MB~5MB (功能极全但也较臃肿) |
| **LaTeX 语法覆盖率** | 覆盖 95%+ 常用学术命令与 AMS 宏 | 覆盖 99.9% LaTeX 原生命令，支持复杂宏包 |
| **自媒体与离线导出** | 极佳（纯 CSS+HTML 或快速转 SVG 剪贴板） | 偏重，在微信公众号沙箱内易丢失内联样式 |

---

## 2. 跨平台自媒体富文本复制的致命痛点与解法

微信公众号和主流富媒体平台**完全不支持原生 MathML**，也禁止加载外部 KaTeX 字体文件。
成熟方案必须采用**双轨导出管线**：
1. **浏览器本地预览**：使用 KaTeX 快速渲染出高保真公式 DOM 节点；
2. **复制到公众号时**：将每个数学公式通过 Canvas 离线栅格化为**无缝内联 PNG 图片**，或编译为内嵌透明底色的 **Inline SVG 矢量图形**。
`,"math/matrices-and-cases":`# 复杂数学矩阵、方程式组与分段函数排版实战

> 在高级线性代数、机器学习损失函数定义与离散数学中，多行对齐与分块矩阵是高频需求。

---

## 1. 矩阵环境全家桶 (Matrix Environments)

LaTeX 提供了多种矩阵定界符语法：

| 矩阵类型 | 环境声明名称 | 定界符形式 | LaTeX 示例代码 |
| :--- | :--- | :---: | :--- |
| **无边框矩阵** | \`matrix\` | 无边框 | \`\\begin{matrix} a & b \\\\ c & d \\end{matrix}\` |
| **圆括号矩阵** | \`pmatrix\` | $( \\dots )$ | \`\\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}\` |
| **方括号矩阵** | \`bmatrix\` | $[ \\dots ]$ | \`\\begin{bmatrix} x_1 & x_2 \\\\ y_1 & y_2 \\end{bmatrix}\` |
| **行列式** | \`vmatrix\` | $| \\dots |$ | \`\\begin{vmatrix} a & b \\\\ c & d \\end{matrix}\` |

### 复杂分块旋转矩阵实战：
\`\`\`latex
$$
R(\\theta) = \\begin{bmatrix}
\\cos\\theta & -\\sin\\theta & 0 \\\\
\\sin\\theta &  \\cos\\theta & 0 \\\\
0           &  0           & 1
\\end{bmatrix}
$$
\`\`\`

---

## 2. 分段函数与条件声明 (cases)

分段函数使用 \`\\begin{cases} ... \\end{cases}\` 环境，以 \`&\` 对齐条件与公式：

\`\`\`latex
$$
f(x) = \\begin{cases}
\\frac{\\sin x}{x}, & \\text{若 } x \\neq 0 \\\\
1,                  & \\text{若 } x = 0
\\end{cases}
$$
\`\`\`

---

## 3. 多行连等式对齐 (aligned)

多行推导必须使用 \`aligned\` 环境，并在等号前加上 \`&\` 实现垂直对齐：

\`\`\`latex
$$
\\begin{aligned}
(x + y)^3 &= (x + y)(x + y)^2 \\\\
          &= (x + y)(x^2 + 2xy + y^2) \\\\
          &= x^3 + 3x^2y + 3xy^2 + y^3
\\end{aligned}
$$
\`\`\`
`,"math/scientific-symbols":"# 学术数学、物理、微积分与希腊字母完全速查字典\n\n> 科学排版必备符号参考，涵盖希腊字母、逻辑关系符、集合算子与微积分符号。\n\n---\n\n## 1. 24 个希腊字母完全对照表 (Greek Alphabet)\n\n| 小写语法 | 渲染 | 大写语法 | 渲染 | 常用物理/数学语义 |\n| :--- | :---: | :--- | :---: | :--- |\n| `\\alpha` | $\\alpha$ | `A` | $A$ | 角度、统计显著性水平、热膨胀系数 |\n| `\\beta` | $\\beta$ | `B` | $B$ | 贝塔分布、回归系数、高能电子 |\n| `\\gamma` | $\\gamma$ | `\\Gamma` | $\\Gamma$ | 伽马射线、伽马函数、绝热指数 |\n| `\\delta` | $\\delta$ | `\\Delta` | $\\Delta$ | 变分量、狄拉克函数、克罗内克符号、拉普拉斯算子 |\n| `\\epsilon` / `\\varepsilon` | $\\epsilon, \\varepsilon$ | `E` | $E$ | 极小正数、介电常数、机器精度 |\n| `\\theta` / `\\vartheta` | $\\theta, \\vartheta$ | `\\Theta` | $\\Theta$ | 极角、时间常数、算法渐进复杂度 |\n| `\\lambda` | $\\lambda$ | `\\Lambda` | $\\Lambda$ | 特征值、波长、指数分布率 |\n| `\\mu` | $\\mu$ | `M` | $M$ | 期望均值、微米单位、摩擦系数 |\n| `\\pi` | $\\pi$ | `\\Pi` | $\\Pi$ | 圆周率、连乘算子、渗透压 |\n| `\\sigma` | $\\sigma$ | `\\Sigma` | $\\Sigma$ | 标准差、正应力、求和算子 |\n| `\\omega` | $\\omega$ | `\\Omega` | $\\Omega$ | 角速度、复数三次根、电阻欧姆 |\n\n---\n\n## 2. 常用集合与逻辑运算符\n\n- 集合包含：`\\in` ($in$), `\\notin` ($\notin$), `\\subset` ($subset$), `\\subseteq` ($subseteq$)\n- 集合运算：`\\cap` ($cap$), `\\cup` ($cup$), `\\emptyset` ($emptyset$)\n- 逻辑命题：`\\forall` ($\forall$), `\\exists` ($exists$), `\\neg` ($\neg$), `\\implies` ($implies$), `\\iff` ($iff$)\n- 关系比较：`\\le` ($le$), `\\ge` ($ge$), `\\neq` ($\neq$), `\\approx` ($approx$), `\\sim` ($sim$)\n"},o={"diagrams/syntax-highlighting":`# 现代代码高亮体系与开发者写作规范

> 代码块是技术写作的核心交付载体。本文剖析 Prism.js、Highlight.js 与现代 AST 语法高亮器 Shiki 的实现机制与自媒体排版适配。

---

## 1. 词法分词机制对比：正则 Tokenizer vs TextMate 语法树

现代 Web 端主流语法高亮方案分为两大流派：

| 高亮引擎 | 代表项目 | 解析机制 | 性能与包体积 | 优缺点与应用场景 |
| :--- | :--- | :--- | :--- | :--- |
| **词法分词流派** | Prism.js / Highlight.js | 依靠预编译正则表达式切分 Token | 极小（10~50KB）、毫秒级极速渲染 | 适合轻量 Web、自媒体实时编辑器；但复杂边缘语法易染色错误 |
| **TextMate 规范流派** | Shiki / VS Code | 与 VS Code 共享语法文件 (TextMate/Oniguruma WASM) | 较大（带 WASM 与语义主题 JSON） | **100% 还原 VS Code 高保真着色**，适合静态站点生成（SSG） |

---

## 2. 开发者技术文档代码块书写规范

1. **显式标注语言标识 (Info String)**：禁止使用裸 \`\`\` 包裹代码。缺少语言标识会导致语法分析器回退至纯文本；
2. **行号与高亮行语法标准**：
   \`\`\`typescript {3-5} showLineNumbers
   // 行业标准：在大括号内指定需要高亮的行号区间
   function calculateTotal(items: CartItem[]): number {
     // 重点高亮业务核心逻辑
     return items.reduce((sum, item) => {
       return sum + item.price * item.quantity;
     }, 0);
   }
   \`\`\`
3. **Diff 补丁比对代码块**：在展示架构改造或代码重构时，使用 \`diff\` 语法标识增删改：
   \`\`\`diff
   - const result = legacySynchronousCompute();
   + const result = await modernReactivePipeline.process();
   \`\`\`
`,"diagrams/mermaid-flowchart":`# Mermaid 流程图 (Flowchart) 完整工业建模指南

> Mermaid 是一种基于纯文本的类 Markdown 图表定义语言，已被 GitHub、GitLab、Notion 等全面原生集成。

---

## 1. 流程图基础方向与节点几何形状

声明使用 \`graph\` 或 \`flowchart\`，随后指定拓扑流动方向：
- \`TB\` / \`TD\`：从上到下 (Top to Bottom)
- \`LR\`：从左到右 (Left to Right)
- \`BT\`：从下到上 (Bottom to Top)
- \`RL\`：从右到左 (Right to Left)

### 节点形状完全语法表：
\`\`\`mermaid
flowchart LR
    A["矩形方框: [Text]"] --> B("圆角矩形: (Text)")
    B --> C(["体育场椭圆: ([Text])"])
    C --> D[["子程序双边: [[Text]]"]]
    D --> E[("圆柱数据库: [(Text)]")]
    E --> F(("圆形节点: ((Text))"))
    F --> G{"菱形判断: {Text}"}
    G --> H{{"六边形节点: {{Text}}"}}
\`\`\`

---

## 2. 连接线类型与条件分支文本

| 语法书写 | 连线语义 | 示例 |
| :--- | :--- | :--- |
| \`A --> B\` | 带箭头的实线 | 正常控制流 |
| \`A --- B\` | 无箭头的普通实线 | 关联关系 |
| \`A -- "条件分支" --> B\` | 带文字说明的箭头连线 | 条件判断 |
| \`A -.-> B\` | 带箭头的虚线 | 依赖注入 / 异步触发 |
| \`A ==> B\` | 加粗加宽的双线箭头 | 核心主干流水线 |

---

## 3. 子图容器 (Subgraphs) 与架构分层实战

在绘制分布式或分层架构时，使用 \`subgraph\` 对节点进行逻辑隔离：

\`\`\`mermaid
flowchart TD
    subgraph ClientLayer["客户端接入层 (Client)"]
        Web["Web 网页端"]
        Mobile["iOS / Android"]
    end

    subgraph GatewayLayer["API 网关路由层 (Gateway)"]
        APIGateway["Kong / Traefik 网关"]
        AuthFilter["OAuth2 鉴权过滤器"]
    end

    subgraph ServiceMesh["微服务业务层 (Services)"]
        DocService["文档协同服务"]
        RenderService["排版编译服务"]
    end

    ClientLayer --> GatewayLayer
    APIGateway --> AuthFilter
    AuthFilter --> ServiceMesh
\`\`\`
`,"diagrams/mermaid-sequence":`# Mermaid 时序图 (Sequence Diagram) 消息传递与通信建模

> 时序图用于精确刻画系统在时间轴上的对象交互序列，是分布式协议、鉴权握手与 RPC 调用的核心表达手段。

---

## 1. 角色参与者 (Participants) 与别名机制

通过 \`participant\` 与 \`actor\` 显式声明对象：

\`\`\`mermaid
sequenceDiagram
    autonumber
    actor User as 创作者 (User)
    participant Editor as 编辑器前端 (Web)
    participant Inliner as CSS 行内化引擎
    participant WXServer as 微信公众平台后台

    User->>Editor: 点击「一键复制到公众号」
    activate Editor
    Editor->>Inliner: 提交包含全局样式的 DOM 树
    activate Inliner
    Inliner-->>Editor: 返回携带 Inline CSS 的清洗富文本
    deactivate Inliner
    Editor->>User: 写入系统剪贴板 (text/html)
    deactivate Editor
    User->>WXServer: 在后台编辑器按 Ctrl+V 粘贴
    WXServer-->>User: 完美呈现所有卡片与排版样式
\`\`\`

---

## 2. 消息连线类型规范

- \`->>\`：带箭头的实线（同步请求消息）；
- \`-->>\`：带箭头的虚线（异步回调或返回响应）；
- \`-x\`：带叉号的连线（表示消息在网络中丢失）；
- \`activate\` / \`deactivate\`：生命周期激活柱展开与收起。
`,"diagrams/mermaid-class-er":`# Mermaid 类图、状态机与实体关系图 (ER) 规范

> 面向对象系统设计与关系型数据库设计中常用的 UML 模型在 Mermaid 中的标准定义。

---

## 1. 实体关系图 (ER Diagrams) 数据库建模

使用 \`erDiagram\` 描述关系数据库的数据表与基数约束：

\`\`\`mermaid
erDiagram
    ARTICLE ||--o{ REVISION : "产生多个历史快照"
    ARTICLE }|--|| USER : "属于某一创作者"
    ARTICLE ||--o{ TAG : "拥有标签"

    ARTICLE {
        string id PK "文章唯一主键"
        string title "文章主标题"
        text content "Markdown 原始源码"
        datetime created_at "创建时间戳"
    }

    REVISION {
        string rev_id PK "快照哈希"
        string article_id FK "关联文章主键"
        text diff_patch "差异比对补丁"
    }
\`\`\`

---

## 2. 有限状态机模型 (State Diagram)

使用 \`stateDiagram-v2\` 描述生命周期流转：

\`\`\`mermaid
stateDiagram-v2
    [*] --> Draft: 新建草稿
    Draft --> InReview: 提交审核
    InReview --> Rejected: 触发敏感词阻断
    Rejected --> Draft: 修复违禁词
    InReview --> Published: 审核通过一键分发
    Published --> Archived: 长期归档
    Archived --> [*]
\`\`\`
`,"diagrams/mermaid-git-mindmap":`# Mermaid Git 拓扑图与思维导图 (Mindmap) 绘制标准

> 现代研发分支管理规范与树形知识发散图的轻量化文本绘制。

---

## 1. Git Graph 分支拓扑图

展示主干发布与特性分支合并流：

\`\`\`mermaid
gitGraph
    commit id: "初始化 CommonMark 内核"
    commit id: "搭建飞书三栏知识库"
    branch release
    checkout release
    commit id: "发布 v1.0.0 稳定版" tag: "v1.0.0"
    checkout main
    branch feature/katex
    commit id: "支持 KaTeX 公式解析"
    commit id: "支持矩阵对齐"
    checkout main
    merge feature/katex id: "合并公式特性"
    checkout release
    merge main id: "同步 v1.1.0 生产发布" tag: "v1.1.0"
\`\`\`

---

## 2. 知识库思维导图 (Mindmap) 语法

\`\`\`mermaid
mindmap
  root((Markdown 排版工程))
    标准体系
      CommonMark 0.31
      GitHub Flavored Markdown
      W3C CLReq 中文排版
    底层引擎
      AST 抽象语法树
      CSS 行内化 Inliner
      DOM 安全沙箱清洗
    渲染技术
      KaTeX 数学公式
      Mermaid 可视化图表
      Prism 代码高亮
\`\`\`
`},s={"clipboard/clipboard-mime-inliner":`# 富文本剪贴板工程原理：MIME text/html 与 CSS 行内化编译

> 为什么网页排版在编辑器中很好看，一复制到微信公众号或第三方编辑器就彻底“散架”？本文从操作系统底层剪贴板协议与 CSS 编译原理深度复盘。

---

## 1. 现代操作系统剪贴板的 MIME 多重分流机制

当用户在浏览器中按下 \`Ctrl+C\` 或调用系统 \`navigator.clipboard.write()\` 时，操作系统底层剪贴板并非只存储单一字符串，而是以**多 MIME 类型数据包**的形式注册：

\`\`\`mermaid
flowchart TD
    App["排版工作台"] --> ClipPayload["剪贴板多重负载 (Clipboard Payload)"]
    ClipPayload --> M1["text/plain (纯文本降级: Markdown 源码或无样式文字)"]
    ClipPayload --> M2["text/html (核心富文本载体: 携带样式的 HTML DOM)"]
    ClipPayload --> M3["image/png (图片载体: 纯位图图像数据)"]
    M2 --> TargetEditor{"目标接收端粘贴 (Ctrl+V)"}
    TargetEditor -- "微信公众号后台" --> CleanWX["执行安全沙箱清洗并嵌入内部 DOM"]
    TargetEditor -- "终端命令行" --> PlainText["仅提取 text/plain 纯文本"]
\`\`\`

---

## 2. 为什么必须将 CSS 行内化 (CSS Inlining)？

主流 Web 应用通常采用外部样式表（\`<style>\` 标签或 \`<link rel="stylesheet">\`），依赖 CSS 类名选择器（如 \`.article-card\`）进行样式声明。

### 2.1 外部类选择器在粘贴时的灭顶之灾
当富文本 HTML 被粘贴进入微信公众号、知乎、邮件客户端或飞书时：
1. **隔离性剥离**：目标平台为了防止引入的 CSS 污染宿主全局界面，在粘贴拦截器中会**物理强制清空并移除所有 \`<style>\` 标签与外部样式**；
2. **样式失效**：失去了外部 CSS 的类选择器变为空头支票，所有卡片背景、精美圆角、字体颜色瞬间归零。

### 2.2 CSS Inliner 编译器的数学权重合并模型
解决方案是在写入剪贴板前，由专用 Inliner 编译器在内存中遍历 DOM 树，将外部样式表根据 CSS 特异性（Specificity：内联 > ID > Class > Tag）计算后，**直接固化为每一个 HTML 元素的 \`style="..."\` 行内属性**：

\`\`\`html
<!-- 编译前 (粘贴后必定丢失) -->
<div class="quote-card">金句内容</div>

<!-- 编译后 (100% 免疫宿主沙箱清洗) -->
<div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 8px; font-size: 15px; color: #1e293b;">金句内容</div>
\`\`\`
`,"clipboard/wechat-engine-sandbox":'# 微信公众号排版引擎沙箱与 CSS 白名单全景剖析\n\n> 微信公众号编辑器基于一套高度定制的富文本清洗沙箱。掌握其过滤黑白名单，是设计高可靠自媒体排版工具的前提。\n\n---\n\n## 1. 微信排版过滤沙箱的三大铁律\n\n1. **绝对禁止任何外部超链接**：\n   - 微信后台会对所有 `<a href="...">` 进行严格域名白名单拦截；\n   - **非微信公众平台官方域名（如 qq.com, weixin.qq.com）的外部链接会被强行剥离超链接**，降级为纯文本或直接吞掉；\n   - **行业规范解决方案**：将 Markdown 外部链接在编译时自动转换为学术级“文末文内脚注（Footnotes）”。\n2. **绝对禁止外部网络字体与 `@font-face`**：\n   - 必须使用系统原生安全字体栈（-apple-system, PingFang SC, Microsoft YaHei）；\n3. **彻底封杀伪元素与相对/绝对定位的特定属性**：\n   - `::before` 与 `::after` 伪元素无法通过行内 style 注入，在微信富文本中完全失效；\n   - 部分高危的 `position: fixed` 与多层负向 `z-index` 会被直接剔除。\n\n---\n\n## 2. 微信后台完全兼容的 CSS 安全属性清单\n\n| 样式维度 | 安全兼容的属性 (100% 保留) | 风险或被过滤属性 (严禁使用) |\n| :--- | :--- | :--- |\n| **盒模型** | `margin`, `padding`, `border`, `border-radius`, `box-sizing` | `outline-offset`, 负 margin 破位穿透 |\n| **色彩与背景** | `color`, `background-color`, `background-image: linear-gradient(...)` | 依赖外部 URL 的背景图（常被微信跨域防盗链拦截） |\n| **文字排版** | `font-size`, `font-weight`, `line-height`, `letter-spacing`, `text-align` | `text-shadow` (部分旧版安卓端可能丢失) |\n| **现代布局** | `display: flex`, `justify-content`, `align-items`, `flex-wrap` | `display: grid` (微信历史版本兼容性欠佳) |\n| **视觉层次** | `box-shadow`, `opacity` | `filter: blur()` (部分移动端产生性能黑边) |\n',"clipboard/multiplatform-publishing":`# 多平台富文本排版适配：知乎、掘金、微信与简书

> 同一份高品质 Markdown 稿件，如何一站式无缝分发至不同平台？本文梳理主流内容平台的技术特性与分发调度策略。

---

## 1. 主流内容平台解析特征矩阵

| 目标平台 | 富文本接收类型 | 数学公式支持情况 | 外链处理机制 | 代码块要求 |
| :--- | :--- | :--- | :--- | :--- |
| **微信公众号** | 仅纯富文本 HTML | 必须转为 SVG 或内联图片 | 仅支持公众号内链，外链必须转脚注 | 需行内化背景与行高 |
| **知乎专栏** | 富文本 HTML | 支持原生公式，识别特定 class 标记 | 外链加安全中转页 | 识别预设语言标签 |
| **掘金社区** | 原生 Markdown 源码 | 完美原生支持 KaTeX / MathJax | 允许合规技术外链 | 支持标准 GFM 代码围栏 |
| **简书 / 语雀** | Markdown / HTML 双模 | 支持 LaTeX 公式 | 支持标准外链 | 标准代码块 |

---

## 2. 一键分发调度器 (Copy Dispatcher) 架构实现

成熟的排版引擎应建立策略模式分发器：
- 当用户选择**微信模式**：调用 AST 转换插件，将所有超链接转为文末脚注，将 LaTeX 公式编译为内联 SVG，将 CSS 计算为 Inline Style；
- 当用户选择**知乎模式**：保留公式原始代码并注入知乎专用的 \`data-eeimg\` 属性，保留标准外链结构；
- 当用户选择**掘金/通用 Markdown 模式**：直接向系统剪贴板注入规范化清洗后的 GFM 纯文本。
`,"clipboard/svg-canvas-rendering":'# SVG 矢量渲染与跨域 Canvas 长图合成技术\n\n> 在小红书爆款卡片、微信朋友圈分享图或技术信息图制作中，客户端纯前端生成 2K/4K 高清长图是现代自媒体工具的必备能力。\n\n---\n\n## 1. 纯前端 HTML 转图片的三大实现路径\n\n1. **SVG `<foreignObject>` 虚拟化**：将待渲染的 HTML 片段序列化包裹进 SVG 的 foreignObject 节点中，绘制到 Canvas 后导出位图；\n2. **DOM-to-Canvas 深度遍历重绘**：通过递归解析 DOM 树的每个节点几何尺寸（`getBoundingClientRect`）、边框、字号，直接用 Canvas 2D 绘图 API（`fillText`, `strokeRect`）物理重绘；\n3. **高分屏 Retina 抗锯齿缩放**：根据设备像素比（`window.devicePixelRatio` 或固定 2x/3x 倍率）动态放大 Canvas 画布宽高，再缩小样式尺寸，彻底消除字体模糊与毛刺。\n\n---\n\n## 2. 避免 Canvas 污染 (Tainted Canvas) 的 CORS 跨域治理\n\n当渲染包含外部第三方图床（如阿里云 OSS、AWS S3）的图片时，若图片未配置 CORS 响应头，Canvas 在调用 `toDataURL()` 或 `toBlob()` 时会抛出致命的 **SecurityError (The operation is insecure)**：\n- **前置预加载**：所有参与长图绘制的图片必须设置 `img.crossOrigin = "anonymous"`；\n- **回退机制**：若外部图床响应头缺失 `Access-Control-Allow-Origin`，客户端应通过本地 IndexedDB 缓存 Blob 转换为 `blob:...` 伪协议安全加载。\n'},c={"assets/image-hosting-arch":`# 现代数字资产图床架构：S3 / R2 / OSS 签名与鉴权体系

> 图片是内容创作中最重、最具带宽成本的数字资产。本文详解基于对象存储的现代图床架构与零凭证泄露上传体系。

---

## 1. 传统服务端中转图床 vs 现代客户端直传架构

传统图床让用户先将图片上传到业务应用服务器，再由服务器转存到对象存储。该模式存在巨大弊端：
- **服务器带宽瞬间被撑爆**；
- **传输耗时翻倍**（用户 -> 服务器 -> S3）；
- **服务器内存溢出风险**。

### 现代工业标准：预签名直传 (Presigned URL Upload)
\`\`\`mermaid
sequenceDiagram
    autonumber
    actor Creator as 创作者客户端 (Client)
    participant AuthAPI as 业务网关 / Serverless
    participant S3Bucket as AWS S3 / Cloudflare R2 / 阿里云 OSS

    Creator->>AuthAPI: 请求预签名上传凭证 (携带文件 SHA256 与文件大小)
    AuthAPI-->>Creator: 计算并签发短期有效的 Presigned URL (如 15 分钟失效)
    Creator->>S3Bucket: 直接通过 PUT / POST 请求上传图片二进制流
    S3Bucket-->>Creator: 返回 HTTP 200 与永久访问 CDN 链接
\`\`\`

---

## 2. 核心对象存储厂商配置对比

| 对象存储服务 | 核心优势 | 出站流量费 (Egress Fee) | 推荐典型场景 |
| :--- | :--- | :---: | :--- |
| **Cloudflare R2** | 100% 兼容 S3 协议、全网边缘加速 | **0 元（免出站流量费）** | 自媒体自建图床首选 |
| **AWS S3** | 工业界事实标准、99.999999999% 耐久度 | 相对高昂 | 全球化企业级大规模归档 |
| **阿里云 OSS** | 国内访问低延迟、完备的媒体处理服务 | 按量计费 | 面向国内微信公众号的专属加速 |
`,"assets/nextgen-image-formats":`# 下一代图片格式实战：WebP、AVIF 压缩与自适应加载

> 传统 JPEG 与 PNG 诞生于 30 年前，难以满足现代高画质、低延迟的移动端阅读需求。

---

## 1. 现代三大主流图片编码技术参数对比

| 特性维度 | JPEG (1992) | PNG (1996) | WebP (Google, 2010) | AVIF (AOMedia, 2019) |
| :--- | :--- | :--- | :--- | :--- |
| **压缩算法** | 离散余弦变换 (DCT) | Deflate (无损) | VP8 帧内预测编码 | AV1 视频关键帧编码 |
| **相同画质文件体积** | 100% (基准) | 120%~200% (极大) | **较 JPEG 减小 30%~40%** | **较 JPEG 减小 50%~65%** |
| **Alpha 透明通道** | 不支持 | 支持 | 完美支持 | 完美支持 |
| **动画支持** | 不支持 | APNG (支持有限) | 支持动图动画 | 支持动图动画 |
| **现代浏览器兼容度** | 100% | 100% | 98.5% (全主流支持) | 93.8% (现代浏览器支持) |

---

## 2. 渐进式回退加载标准规范 (\`<picture>\` 标签)

在现代 Web 技术出版中，应当利用 HTML5 的 \`<picture>\` 容器实现智能内容协商：
\`\`\`html
<picture>
  <!-- 优先加载超高压缩比的 AVIF 格式 -->
  <source srcset="image.avif" type="image/avif">
  <!-- 兼容加载现代通用的 WebP 格式 -->
  <source srcset="image.webp" type="image/webp">
  <!-- 终极兜底方案：传统 JPEG 格式 -->
  <img src="image.jpg" alt="技术架构图" loading="lazy" decoding="async">
</picture>
\`\`\`
`,"assets/cdn-and-security":`# 防盗链机制、CDN 边缘缓存与 EXIF 隐私擦除规范

> 在数字内容分发中，资产被外部恶意盗刷流量或照片泄露创作者真实家庭地理位置，是两大严重的安全与成本威胁。

---

## 1. 彻底防范隐私泄露：EXIF 元数据强制擦除

现代智能手机或微单拍摄的照片，通常包含 EXIF（Exchangeable Image File Format）敏感元数据：
- **GPS 经纬度坐标**：可精准定位创作者拍摄时的物理地址、楼层甚至房间；
- **拍摄设备序列号、镜头型号与时间戳**。

### 客户端在上传前必须执行本地擦除：
成熟的客户端必须在读取用户本地文件时，先绘制到 OffscreenCanvas，或使用元数据清洗工具**物理过滤掉所有的 GPS 与设备信息**，杜绝隐私在互联网上裸奔。

---

## 2. 现代 CDN 边缘缓存与防盗链治理

1. **HTTP Referer 鉴权白名单**：在 CDN 边缘节点验证请求头 \`Referer\`，只允许受信任的域名（如自身域名、微信后台 \`servicewechat.com\`）拉取图片；
2. **边缘智能图片转码 (Image Resizing)**：通过 CDN 参数（如 \`?x-oss-process=image/resize,w_800/format,webp\`），动态按终端屏幕尺寸下发最合适的分辨率，大幅节约传输带宽。
`},l={"writing/technical-writing-guide":`# 现代技术写作风格指南与结构化信息架构设计

> 优秀的技术文档绝非代码的副产物，而是一项严谨的工程实践。本文系统借鉴 Google Developer Documentation Style Guide 与微软写作手册。

---

## 1. 结构化写作的金字塔原理 (The Minto Pyramid Principle)

技术写作必须采用**结论先行、自上而下**的倒金字塔结构：

\`\`\`mermaid
flowchart TD
    Core["核心结论 / 核心操作 (Top)"]
    Core --> Sub1["论据或分步骤 1"]
    Core --> Sub2["论据或分步骤 2"]
    Core --> Sub3["论据或分步骤 3"]
    Sub1 --> Detail1["技术原理与底层细节"]
    Sub2 --> Detail2["代码示例与输出结果"]
    Sub3 --> Detail3["边界场景与异常排障"]
\`\`\`

---

## 2. 无歧义表述与语气准则

1. **避免模糊主观副词**：禁止使用“简单”、“显然”、“只需几步即可”等具有认知偏见的词汇。技术事实无需情绪修饰；
2. **主动语态优先于被动语态**：
   - ✅ **推荐（主动）**：系统在接收到数据包后自动触发校验逻辑。
   - ❌ **避免（被动）**：数据包被系统接收后，校验逻辑被自动触发。
3. **保持术语全局绝对一致**：禁止在同一篇文档中对同一概念混用不同名词（如交替使用“Token”、“凭证”、“令牌”、“密钥”）。

---

## 3. AI 辅助写作与人机协同副驾驶 (AI Copilot) 规范

在生成式 AI 与大语言模型深度渗透技术写作的今天，必须恪守“人机协同副驾驶 (AI Copilot)”原则：
1. **真实性第一 (Fact-Checking)**：AI 生成的技术架构图、API 签名与参数列表必须经过真实编译器或测试用例硬验证，严禁直接照抄 LLM 幻觉；
2. **去除“AI 味”与废话膨胀**：剔除“在当今快节奏的数字化时代”、“总而言之”等模式化虚词，保持硬核技术密度；
3. **隐私与代码安全**：禁止向公共大模型上传带有真实生产环境密钥、私有数据库连接串的内容。
`,"writing/dfa-compliance-filter":`# 内容合规与违禁词检测：DFA 有限状态机敏感词过滤算法

> 在自媒体运营与数字出版中，违反《中华人民共和国广告法》（如滥用“最顶尖”、“绝对第一”、“全网唯一”）会导致公众号文章被强制下架甚至封号。

---

## 1. 为什么暴力正则扫描无法胜任工业级违禁词过滤？

若词库包含 20,000 个违禁词，对一篇 10,000 字的长文使用循环正则匹配，时间复杂度为 $mathcal{O}(M 	imes N)$，耗时高达数秒，且极易导致浏览器主线程卡死（Freeze）。

---

## 2. DFA (Deterministic Finite Automaton) 核心算法模型

确定性有限自动机算法将数万敏感词预编译为一棵**多叉前缀树（Trie 字典树）**：
- 检索时间复杂度降低至极致的 $mathcal{O}(N)$（只取决于文章长度，与敏感词库规模完全解耦！）；
- 支持贪婪匹配（最长匹配模式）与跳过空白/干扰字符（如 \`第-一\`、\`最*好\`）。

\`\`\`javascript
/**
 * 工业级 DFA 敏感词字典树构建与检索实战
 */
export class DFASensitiveFilter {
  constructor() {
    this.root = {};
  }

  // 1. 构建前缀树
  addWord(word) {
    let node = this.root;
    for (const char of word) {
      if (!node[char]) node[char] = {};
      node = node[char];
    }
    node.isEnd = true; // 标记词语终态
  }

  // 2. 毫秒级单次遍历扫描
  scanText(text) {
    const matches = [];
    for (let i = 0; i < text.length; i++) {
      let node = this.root;
      let matchedChars = "";
      for (let j = i; j < text.length; j++) {
        const char = text[j];
        if (!node[char]) break;
        matchedChars += char;
        if (node[char].isEnd) {
          matches.push({ word: matchedChars, start: i, end: j });
        }
        node = node[char];
      }
    }
    return matches;
  }
}
\`\`\`
`,"writing/open-licenses-copyright":`# 数字出版版权规范：知识共享 (CC BY-NC-SA) 与开源协议

> 数字时代的创作者必须清晰划定作品的授权边界，防范版权侵权与商业盗用纠纷。

---

## 1. 知识共享许可协议 (Creative Commons, CC) 全景拆解

CC 协议通过 4 种基础授权模块组合出 6 种标准许可：

| 模块符号 | 模块简称 | 法律约束力定义 |
| :---: | :--- | :--- |
| 👤 | **BY (署名)** | 使用者必须向原作者明确署名，并提供原文链接与许可说明 |
| 🚳 | **NC (非商业性使用)** | 仅允许非商业目的传播与分享，禁止任何营利性使用 |
| 🔂 | **SA (相同方式共享)** | 若对原作品进行修改、演绎或衍生，衍生作品必须使用相同协议分发 |
| 🚫 | **ND (禁止演绎)** | 仅允许原样复制分享，禁止修改、翻译、混剪或改编 |

### 技术写作最推荐的黄金组合：CC BY-NC-SA 4.0
允许全球技术读者免费阅读、学习、演绎与分享，同时从法律层面彻底阻断未经授权的黑产洗稿、商业打包售卖等侵权行为。

---

## 2. 软件代码许可协议 (Software Licenses) 选择简明指南

- **MIT License**：最宽松，商业公司与个人均可闭源集成，仅需保留原版权声明；
- **Apache 2.0**：宽松且友好，额外提供明确的专利保护条款；
- **GPL v3**：强传染性开源协议，任何引用或链接该代码的软件必须同步全量开源。
`,"writing/local-first-architecture":`# 本地优先 (Local-First) 离线文档与存储架构设计

> 传统云端 SaaS 文档软件存在数据锁定、网络中断无法输入、云端关停数据蒸发等巨大隐患。Local-First 代表了下一代专业创作工具的底层哲学。

---

## 1. Local-First 核心设计准则 (Martin Kleppmann 七大原则)

1. **零延迟输入 (No Spinners)**：所有读写操作必须秒级在本地内存与磁盘完成，永无网络阻塞转圈；
2. **多设备并发与无缝离线 (Multi-device & Offline)**：在飞机舱、地下室离线状态下具备 100% 完整的编辑排版能力；
3. **网络仅作为同步通道 (Network is Optional)**：云端不再是主数据库，而仅仅是端到端状态同步的中继层；
4. **数据主权永归创作者所有 (User Retains Data Ownership)**：数据以纯净标准文本（如 Markdown）物理存储在用户本地计算机。

---

## 2. 基于 IndexedDB 与快照版本链的存储实践

在现代浏览器中，通过 IndexedDB 构建事务化本地文档库：
- 采用双库隔离：元数据表（\`articles_meta\`）+ 块内容存储表（\`articles_content\`）；
- 每次用户保存时生成版本哈希快照（Snapshot Hash），基于差异比对算法（Diff Engine）记录变更轨迹，提供时光穿梭机式的回滚恢复能力。
`},u={"appendix/glossary":`# 常见术语索引表 (Glossary)

> 本表按英文字母与拼音顺序收录了本知识库中涉及的核心概念、规范缩写与技术术语，方便日常学习与速查检索。

---

## 字母索引 (A - Z)

### A
- **AST (Abstract Syntax Tree, 抽象语法树)**：源代码语法结构的树状表现形式。Markdown 编译器通过将纯文本解析为 AST，再遍历转换为 HTML 或其他目标格式。详见 [Markdown 发展史与规范差异](#/spec-evolution)。
- **AVIF (AV1 Image File Format)**：基于开放视频编码 AV1 的下一代图像格式，在相同视觉质量下比 JPEG 体积减少约 50%，支持透明通道与高动态范围 (HDR)。详见 [下一代图片格式实战](#/nextgen-image-formats)。

### C
- **CC 协议 (Creative Commons, 知识共享)**：一种标准化的版权许可授权体系，允许创作者在保留署名权的前提下授权他人传播或演绎作品。详见 [数字出版版权规范与许可协议](#/open-licenses-copyright)。
- **CLReq (Requirements for Chinese Text Layout, 中文排版需求)**：W3C 国际化工作组制定的中文数字文本排版需求标准，定义了汉字网格、行距与对齐规范。详见 [W3C 中文排版需求要点](#/w3c-clreq)。
- **CommonMark**：针对 Markdown 早期缺乏严谨文法而制定的严格、形式化的规范标准，包含 600+ 自动化测试用例。详见 [CommonMark 核心规范解析](#/syntax)。
- **CSS Inliner (CSS 行内化)**：将外部样式表或全局 CSS 选择器中的样式规则，逐一计算并注入到 HTML 元素的 \`style\` 属性中的编译过程，用以抵抗第三方平台的样式剥离。详见 [剪贴板工程原理与 CSS 行内化](#/clipboard-mime-inliner)。

### D
- **DFA (Deterministic Finite Automaton, 确定性有限状态机)**：一种状态转移系统。在敏感词与合规词过滤中，常将词库构建为 DFA 前缀字典树（Trie），实现 $mathcal{O}(N)$ 复杂度的毫秒级单次扫描。详见 [内容合规与 DFA 敏感词过滤](#/dfa-compliance-filter)。

### E
- **Em-square (全形正方形 / 字身框)**：传统铅字活字与现代中文字库的基本几何容器，通常为 $1 	imes 1$ 的正方形网格。

### G
- **GFM (GitHub Flavored Markdown)**：GitHub 官方基于 CommonMark 扩展的方言规范，增加了表格、任务列表、删除线等实用特性。详见 [GFM 扩展规范手册](#/gfm-extensions)。

### K
- **KaTeX**：Khan Academy 开发的高性能 Web 数学公式渲染库，纯同步静态排版，渲染速度极快，适合文章公式展示。详见 [KaTeX 与 MathJax 对比](#/katex-vs-mathjax)。

### L
- **LaTeX**：学术界与出版界广泛采用的专业排版系统与公式标记语言。详见 [LaTeX 数学公式语法指南](#/latex-fundamentals)。
- **Local-First (本地优先)**：一种现代软件架构理念，主张用户数据首选保存在本地设备（如 IndexedDB 或本地文件），网络仅作为可选备份与协作通道。详见 [本地优先离线存储架构](#/local-first-architecture)。

### M
- **Mermaid**：使用类似 Markdown 的简练文本语法绘制流程图、时序图、甘特图与状态图的图表引擎。详见 [Mermaid 流程图建模指南](#/mermaid-flowcharts)。
- **MIME 类型 (text/html 与 text/plain)**：操作系统剪贴板注册内容数据格式的标准标头。富文本复制依赖 \`text/html\`，降级回退依赖 \`text/plain\`。

### P
- **盘古之白 (Pangu Spacing)**：在中文与西文字母、半角阿拉伯数字之间预留四分之一全角字符宽度的排版空格规范。详见 [盘古之白中英文混排规范](#/pangu-spacing)。
- **Presigned URL (预签名直传链接)**：对象存储（S3/R2/OSS）签发的一种携带时间限制与签名参数的临时上传凭据，允许客户端在不暴露主密钥的前提下直传大文件。详见 [现代图床架构与预签名直传](#/image-hosting-arch)。

### W
- **WebP**：Google 推出的现代图像格式，兼具高效压缩比与透明通道支持，已获全部现代浏览器原生支持。
- **避头尾法则 (Kinsoku Shori)**：汉字排版中禁止特定标点（如句号、逗号）孤立出现在行首，或禁止特定标点（如开引号）出现在行尾的换行禁则。详见 [中文标点规范与避头尾法则](#/punctuation-system)。

---

## 参考文献与关联
- CommonMark 官方词汇表 (commonmark.org)
- W3C 国际化排版工作组术语库 (w3.org/TR/clreq)
- MDN Web Docs (developer.mozilla.org)
`,"appendix/maintenance-guide":`# 知识库编写与持续维护指引 (Maintenance Guide)

> 本知识库借鉴维基百科（Wikipedia）的开放知识沉淀理念，旨在为所有学习排版、数字写作与文档工程的学习者提供准确、清晰、无虚饰的技术参考。本文说明其目录架构、内容准则与持续更新维护流程。

---

## 1. 核心设计原则与风格准则

为保证知识库长期的阅读体验与学术严谨性，所有词条必须遵循以下准则：

1. **客观中立，拒绝推销宣传**：
   - 本知识库是学习与查阅工具，严禁写入任何产品营销套话、吹捧形容词或虚浮的公关话术；
   - 介绍工具或技术时，陈述其客观原理、优缺点与适用场景。
2. **拒绝无意义的图标堆砌**：
   - 目录与标题保持纯净整洁，避免在每行每句前滥用 AI 风格的各类 Emoji 图标；
   - 仅在必要的信息图表、流程图或关键状态提示时使用规范的图形符号。
3. **结构完整，步骤清晰**：
   - 理论与代码/公式相结合；
   - 重要概念提供简明示例与预期输出；
   - 文末尽量提供原始规范链接（如 W3C RFC、CommonMark 规范、GB 标准）。

---

## 2. 知识库目录组织与文件血缘链

知识库代码采用模块化解耦架构，存放在 \`projects/darktu-docs\` 目录下：

\`\`\`
projects/darktu-docs/
├── src/
│   ├── data/
│   │   ├── navigation.js           # 目录树、Slug 别名与章节注册
│   │   ├── articlesContent.js      # 全量词条聚合器
│   │   └── articles/               # 各专业领域的词条源码
│   │       ├── markdownSpecs.js       # 1. 语法与规范
│   │       ├── clreqTypography.js     # 2. 中文排版学
│   │       ├── latexFormulas.js       # 3. 数学公式
│   │       ├── codeAndMermaid.js      # 4. 代码高亮与图表
│   │       ├── clipboardEngineering.js# 5. 富文本与剪贴板
│   │       ├── assetsStorage.js       # 6. 媒体资源与图床
│   │       ├── technicalWriting.js    # 7. 写作实践与合规
│   │       └── appendixMaintenance.js # 8. 附录、索引与维护指南
│   ├── services/
│   │   ├── markdownRenderer.js     # Markdown 语法与大纲解析引擎
│   │   ├── searchService.js        # 全文索引与检索服务
│   │   ├── themeService.js         # 深浅模式偏好持久化
│   │   └── uiHelpers.js            # 代码复制与大纲追踪交互
│   └── styles/                     # 经典排版样式表
└── test/
    └── docs_integrity.test.js      # 词条内容完整性自动化回归测试
\`\`\`

---

## 3. 如何新增或修改一个词条？

如需新增一个词条或对既有内容进行勘误，只需四步即可完成：

### 第一步：编写词条 Markdown 内容
在 \`src/data/articles/\` 下对应的领域文件中，按规范添加一个以词条 ID 为键的 Markdown 字符串：
\`\`\`javascript
export const MY_DOMAIN_ARTICLES = {
  "domain/new-topic": \`# 新词条标题

> 这里是一句话的词条概述或背景说明。

---

## 1. 核心概念与工作原理
正文解析，配合代码或图表示例...
\`
};
\`\`\`

### 第二步：在 \`src/data/navigation.js\` 中登记目录
在对应的分类 \`items\` 数组中追加该词条的 Slug 与简介：
\`\`\`javascript
{
  id: "domain/new-topic",
  slug: "new-topic",
  title: "新词条显示名称",
  description: "简明扼要的一句话摘要，供搜索和卡片展示。",
}
\`\`\`

### 第三步：运行本地自动化校验测试
在项目目录下执行：
\`\`\`bash
npm test
\`\`\`
自动化测试套件（\`docs_integrity.test.js\`）会自动扫描全库所有词条，断言：
- 每一个词条的内容均真实有效且具有实质篇幅（> 200 字）；
- 不存在任何未完成的待办项或临时占位文本；
- 全文搜索索引与别名跳转正常。

### 第四步：编译并部署
通过 Vite 编译并推送发布：
\`\`\`bash
npm run build
npx wrangler pages deploy dist --project-name=darktu-docs --branch=main
\`\`\`

---

## 4. 社区协同与勘误渠道

知识库源代码托管于 GitHub。欢迎每位读者对发现的错别字、陈旧规范或不准确描述提出改进：
- **提交 Issue / 勘误建议**：[GitHub Issues 页面](https://github.com/DF-Guan/we-markdown/issues)
- **提交 Pull Request 参与编辑**：[GitHub 仓库主页](https://github.com/DF-Guan/we-markdown)
- **文档使用许可**：采用 **知识共享 署名-非商业性使用-相同方式共享 4.0 国际许可协议 (CC BY-NC-SA 4.0)**，支持自由学习与非商业传播。
`},d={...r,...i,...a,...o,...s,...c,...l,...u};function f(e){return d[e]?d[e]:r[`markdown-specs/spec-evolution`]}function p(e){return e?e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`):``}function m(e){return e.toLowerCase().replace(/<[^>]+>/g,``).replace(/[^\w\u4e00-\u9fa5\s-]/g,``).trim().replace(/\s+/g,`-`)}function h(e){if(!e)return``;let t=e.replace(/`([^`]+)`/g,(e,t)=>`<code>${p(t)}</code>`);return t=t.replace(/\*\*([^*]+)\*\*/g,`<strong>$1</strong>`),t=t.replace(/\*([^*]+)\*/g,`<em>$1</em>`),t=t.replace(/~~([^~]+)~~/g,`<del>$1</del>`),t=t.replace(/\+\+([^+]+)\+\+/g,`<u>$1</u>`),t=t.replace(/==([^=]+)==/g,`<mark>$1</mark>`),t=t.replace(/~([^~]+)~/g,`<sub>$1</sub>`),t=t.replace(/\^([^^]+)\^/g,`<sup>$1</sup>`),t=t.replace(/\[([^\]]+)\]\(([^)]+)\)/g,(e,t,n)=>`<a href="${n}" ${n.startsWith(`http`)?`target="_blank" rel="noopener noreferrer"`:``}>${t}</a>`),t}function g(e){if(!e)return{html:``,toc:[]};let t=e.split(`
`),n=[],r=[],i=!1,a=``,o=[],s=!1,c=[];for(let e=0;e<t.length;e++){let l=t[e];if(l.trim().startsWith("```")){if(i){let e=p(o.join(`
`));n.push(`
          <div class="code-block-container" data-lang="${a||`text`}">
            <div class="code-block-header">
              <span class="code-lang-label">${a||`text`}</span>
              <button class="code-copy-btn" onclick="window.__copyCodeBlock(this)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                <span>复制</span>
              </button>
            </div>
            <pre class="code-pre"><code>${e}</code></pre>
          </div>
        `),i=!1,o=[],a=``}else i=!0,a=l.trim().replace(/^```/,``).trim();continue}if(i){o.push(l);continue}if(l.trim().startsWith(`|`)&&l.trim().endsWith(`|`)){s||(s=!0,c=[]),c.push(l);continue}if(s&&(n.push(_(c)),s=!1,c=[]),/^(\*{3,}|-{3,}|_{3,})$/.test(l.trim())){n.push(`<hr class="docs-divider" />`);continue}let u=l.match(/^(#{1,6})\s+(.*)$/);if(u){let e=u[1].length,t=u[2].trim(),i=m(t);(e===2||e===3)&&r.push({level:e,id:i,text:t.replace(/<[^>]+>/g,``)}),n.push(`<h${e} id="${i}" class="heading-anchor"><a href="#${i}" class="heading-anchor-link">#</a>${h(t)}</h${e}>`);continue}let d=l.match(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)$/i);if(d){let r=d[1].toUpperCase(),i=d[2],a=[];for(i&&a.push(i);e+1<t.length&&t[e+1].startsWith(`>`);)e++,a.push(t[e].replace(/^>\s?/,``));let o=h(a.join(`<br/>`));n.push(`
        <div class="callout-block callout-${r.toLowerCase()}">
          <div class="callout-header">
            <span class="callout-icon">${v(r)}</span>
            <span class="callout-title">${y(r)}</span>
          </div>
          <div class="callout-body">${o}</div>
        </div>
      `);continue}if(l.startsWith(`>`)){let r=[l.replace(/^>\s?/,``)];for(;e+1<t.length&&t[e+1].startsWith(`>`);)e++,r.push(t[e].replace(/^>\s?/,``));n.push(`<blockquote><p>${h(r.join(`<br/>`))}</p></blockquote>`);continue}if(/^\s*[-*]\s+(.*)$/.test(l)){let r=[],i=l;for(;i&&/^\s*[-*]\s+(.*)$/.test(i);){let n=i.replace(/^\s*[-*]\s+/,``);n.startsWith(`[x] `)?r.push(`<li class="task-item checked"><input type="checkbox" checked disabled /> ${h(n.slice(4))}</li>`):n.startsWith(`[ ] `)?r.push(`<li class="task-item"><input type="checkbox" disabled /> ${h(n.slice(4))}</li>`):r.push(`<li>${h(n)}</li>`),e++,i=t[e]}e--,n.push(`<ul>${r.join(``)}</ul>`);continue}if(/^\s*\d+\.\s+(.*)$/.test(l)){let r=[],i=l;for(;i&&/^\s*\d+\.\s+(.*)$/.test(i);){let n=i.replace(/^\s*\d+\.\s+/,``);r.push(`<li>${h(n)}</li>`),e++,i=t[e]}e--,n.push(`<ol>${r.join(``)}</ol>`);continue}l.trim()&&n.push(`<p>${h(l)}</p>`)}return s&&n.push(_(c)),{html:n.join(`
`),toc:r}}function _(e){if(!e||e.length<2)return``;let t=e[0],n=e.slice(2),r=e=>e.trim().replace(/^\||\|$/g,``).split(`|`).map(e=>h(e.trim()));return`
    <div class="table-container">
      <table class="docs-table">
        <thead><tr>${r(t).map(e=>`<th>${e}</th>`).join(``)}</tr></thead>
        <tbody>${n.map(e=>`<tr>${r(e).map(e=>`<td>${e}</td>`).join(``)}</tr>`).join(``)}</tbody>
      </table>
    </div>
  `}function v(e){switch(e){case`NOTE`:return`ℹ️`;case`TIP`:return`💡`;case`IMPORTANT`:return`📌`;case`WARNING`:return`⚠️`;case`CAUTION`:return`🛑`;default:return`ℹ️`}}function y(e){switch(e){case`NOTE`:return`提示 (Note)`;case`TIP`:return`技巧 (Tip)`;case`IMPORTANT`:return`重要 (Important)`;case`WARNING`:return`警告 (Warning)`;case`CAUTION`:return`避坑警示 (Caution)`;default:return`提示`}}function b(e){if(!e||!e.trim())return[];let n=e.trim().toLowerCase().split(/\s+/).filter(Boolean);if(n.length===0)return[];let r=[];return t.forEach(e=>{let t=(d[e.id]||``).toLowerCase(),i=e.title.toLowerCase(),a=(e.description||``).toLowerCase(),o=0,s=-1;if(n.forEach(e=>{i.includes(e)&&(o+=100,i.startsWith(e)&&(o+=50)),a.includes(e)&&(o+=30);let n=t.indexOf(e),r=0;for(;n!==-1&&r<10;)o+=5,s===-1&&(s=n),n=t.indexOf(e,n+e.length),r++}),o>0){let t=``,n=d[e.id]||``;if(s!==-1){let e=Math.max(0,s-40),r=Math.min(n.length,s+80);t=(e>0?`...`:``)+n.slice(e,r).replace(/\n/g,` `)+(r<n.length?`...`:``)}else t=e.description||n.slice(0,80);r.push({doc:e,score:o,snippet:t})}}),r.sort((e,t)=>t.score-e.score).slice(0,12)}var x=`darktu-docs-theme`;function S(){if(typeof window>`u`)return`light`;try{let e=localStorage.getItem(x);if(e===`dark`||e===`light`)return e;if(window.matchMedia&&window.matchMedia(`(prefers-color-scheme: dark)`).matches)return`dark`}catch{}return`light`}function C(e){if(!(typeof document>`u`)){document.documentElement.setAttribute(`data-theme`,e);try{localStorage.setItem(x,e)}catch{}}}function w(){let e=(document.documentElement.getAttribute(`data-theme`)||`light`)===`dark`?`light`:`dark`;return C(e),e}function T(){typeof window>`u`||(window.__copyCodeBlock=function(e){let t=e.closest(`.code-block-container`)?.querySelector(`code`);if(!t)return;let n=t.innerText;navigator.clipboard.writeText(n).then(()=>{e.classList.add(`copied`);let t=e.querySelector(`span`),n=t?t.innerText:``;t&&(t.innerText=`已复制`),setTimeout(()=>{e.classList.remove(`copied`),t&&(t.innerText=n)},1800)})})}function E(){if(typeof window>`u`||!(`IntersectionObserver`in window))return;let e=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting){let t=e.target.id;document.querySelectorAll(`.toc-link`).forEach(e=>e.classList.remove(`active`)),document.querySelector(`.toc-link[data-heading="${t}"]`)?.classList.add(`active`)}})},{rootMargin:`0px 0px -70% 0px`});document.querySelectorAll(`.heading-anchor`).forEach(t=>e.observe(t))}function D(){if(typeof window>`u`)return;let e=document.getElementById(`readingProgressBar`);window.addEventListener(`scroll`,()=>{let t=document.documentElement.scrollHeight-window.innerHeight,n=window.scrollY,r=t>0?n/t*100:0;e&&(e.style.width=`${Math.min(100,Math.max(0,r))}%`)},{passive:!0}),document.getElementById(`backToTopBtn`)?.addEventListener(`click`,()=>{window.scrollTo({top:0,behavior:`smooth`})})}var O=class{constructor(){this.currentDoc=null,this.init()}init(){T(),D(),C(S()),document.getElementById(`themeToggleBtn`)?.addEventListener(`click`,()=>w());let e=document.getElementById(`mobileMenuToggle`),t=document.getElementById(`docsSidebar`),n=document.getElementById(`sidebarBackdrop`);e?.addEventListener(`click`,()=>{t?.classList.toggle(`mobile-open`),n&&(n.style.display=t?.classList.contains(`mobile-open`)?`block`:`none`)}),n?.addEventListener(`click`,()=>{t?.classList.remove(`mobile-open`),n&&(n.style.display=`none`)}),this.renderSidebar(),window.addEventListener(`hashchange`,()=>this.handleRoute()),this.handleRoute(),this.initSearch()}renderSidebar(){let t=document.getElementById(`sidebarTree`);t&&(t.innerHTML=e.map(e=>`
      <div class="sidebar-category" id="cat-${e.id}">
        <div class="sidebar-category-header" onclick="this.parentElement.classList.toggle('collapsed')">
          <div class="category-title-group">
            <svg class="category-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
            <span>${e.title}</span>
          </div>
          <span class="category-badge">${e.badge}</span>
        </div>
        <div class="sidebar-items-list">
          ${e.items.map(e=>`
            <a href="#/${e.slug}" class="sidebar-item-link" id="link-${e.id.replace(/\//g,`-`)}">
              ${e.title}
            </a>
          `).join(``)}
        </div>
      </div>
    `).join(``),document.getElementById(`sidebarFilter`)?.addEventListener(`input`,e=>{let t=e.target.value.toLowerCase().trim();document.querySelectorAll(`.sidebar-item-link`).forEach(e=>{let n=e.innerText.toLowerCase();e.style.display=!t||n.includes(t)?`flex`:`none`})}))}handleRoute(){let e=window.location.hash,{doc:t,prev:r,next:i}=n(e);this.currentDoc=t,document.querySelectorAll(`.sidebar-item-link`).forEach(e=>e.classList.remove(`active`)),document.getElementById(`link-${t.id.replace(/\//g,`-`)}`)?.classList.add(`active`),document.getElementById(`docsSidebar`)?.classList.remove(`mobile-open`);let a=document.getElementById(`sidebarBackdrop`);a&&(a.style.display=`none`),this.renderContent(t,r,i),window.scrollTo({top:0,behavior:`smooth`})}renderContent(e,t,n){let r=document.getElementById(`docsBreadcrumb`),i=document.getElementById(`docsMetaHeader`),a=document.getElementById(`docsBody`),o=document.getElementById(`docsFooter`),s=document.getElementById(`tocList`);r&&(r.innerHTML=`
        <a href="#/overview" style="color: var(--text-muted); text-decoration: none;">知识库</a>
        <span class="breadcrumb-sep">/</span>
        <span>${e.categoryTitle}</span>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-current">${e.title}</span>
      `);let c=f(e.id),l=c.length,u=Math.max(1,Math.ceil(l/450));i&&(i.innerHTML=`
        <span class="docs-meta-badge">${e.categoryTitle}</span>
        <span class="docs-meta-divider"></span>
        <span class="docs-meta-item">预计阅读：约 ${u} 分钟</span>
        <span class="docs-meta-divider"></span>
        <span class="docs-meta-item">字数：约 ${l} 字</span>
        <span class="docs-meta-divider"></span>
        <span class="docs-meta-item">修订：2026-09</span>
      `);let{html:d,toc:p}=g(c);a&&(a.innerHTML=d),s&&(s.innerHTML=p.length===0?`<li class="toc-item"><span style="color: var(--text-muted);">本条目暂无小节</span></li>`:p.map(e=>`
            <li class="toc-item level-${e.level}">
              <a href="#${e.id}" class="toc-link" data-heading="${e.id}">${e.text}</a>
            </li>
          `).join(``),E()),o&&(o.innerHTML=`
        <div class="article-wiki-footer">
          <div class="wiki-footer-left">
            <span>本条目内容遵循 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a> 许可，欢迎自由阅读学习。</span>
          </div>
          <div class="wiki-footer-right">
            <a href="https://github.com/DF-Guan/we-markdown" target="_blank" rel="noopener noreferrer" class="wiki-edit-btn">在 GitHub 参与编辑</a>
            <a href="https://github.com/DF-Guan/we-markdown/issues/new?title=${encodeURIComponent(`[词条勘误] ${e.title}`)}" target="_blank" rel="noopener noreferrer" class="wiki-edit-btn">报告勘误</a>
          </div>
        </div>
        <div style="display: flex; gap: 16px; width: 100%; margin-top: 24px;">
          ${t?`<a href="#/${t.slug}" class="nav-card prev"><span class="nav-card-label">← 上一词条</span><span class="nav-card-title">${t.title}</span></a>`:`<div style="flex:1;"></div>`}
          ${n?`<a href="#/${n.slug}" class="nav-card next"><span class="nav-card-label">下一词条 →</span><span class="nav-card-title">${n.title}</span></a>`:`<div style="flex:1;"></div>`}
        </div>
      `),document.title=`${e.title} - Darktu 知识库`}initSearch(){let e=document.getElementById(`searchModalOverlay`),t=document.getElementById(`searchInputField`),n=document.getElementById(`searchResultsList`),r=()=>{e?.classList.remove(`hidden`),t?.focus()},i=()=>{e?.classList.add(`hidden`),t&&(t.value=``),n&&(n.innerHTML=``)};document.getElementById(`headerSearchBtn`)?.addEventListener(`click`,r),document.getElementById(`searchCloseBtn`)?.addEventListener(`click`,i),e?.addEventListener(`click`,t=>{t.target===e&&i()}),window.addEventListener(`keydown`,e=>{(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`k`?(e.preventDefault(),r()):(e.key===`Escape`||e.keyCode===27)&&i()}),t?.addEventListener(`input`,e=>{let t=e.target.value,r=b(t);n&&(n.innerHTML=r.length===0?`<div class="search-empty">未检索到匹配的知识条目</div>`:r.map(e=>`
            <a href="#/${e.doc.slug}" class="search-result-item" onclick="document.getElementById('searchModalOverlay').classList.add('hidden')">
              <div class="search-result-header">
                <span class="search-result-title">${e.doc.title}</span>
                <span class="search-result-cat">${e.doc.categoryTitle}</span>
              </div>
              <div class="search-result-snippet">${e.snippet}</div>
            </a>
          `).join(``))})}};function k(){return new O}typeof window<`u`&&document.addEventListener(`DOMContentLoaded`,()=>k());