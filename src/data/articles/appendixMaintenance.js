/**
 * 附录：术语索引与知识库维护指南 (appendixMaintenance.js)
 * 维基百科式条目索引与可持续更新机制
 */

export const APPENDIX_MAINTENANCE_ARTICLES = {
  "appendix/glossary": `# 常见术语索引表 (Glossary)

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
- **DFA (Deterministic Finite Automaton, 确定性有限状态机)**：一种状态转移系统。在敏感词与合规词过滤中，常将词库构建为 DFA 前缀字典树（Trie），实现 $\mathcal{O}(N)$ 复杂度的毫秒级单次扫描。详见 [内容合规与 DFA 敏感词过滤](#/dfa-compliance-filter)。

### E
- **Em-square (全形正方形 / 字身框)**：传统铅字活字与现代中文字库的基本几何容器，通常为 $1 \times 1$ 的正方形网格。

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
`,

  "appendix/maintenance-guide": `# 知识库编写与持续维护指引 (Maintenance Guide)

> 本知识库借鉴维基百科（Wikipedia）的开放知识沉淀理念，旨在为所有学习排版、数字写作与文档工程的学习者提供准确、清晰、无虚饰的技术参考。本文说明其目录架构、实战项目知识持续反哺机制、权威文献溯源标准与自动化更新流水线。

---

## 1. 核心设计原则与风格准则

为保证知识库长期的阅读体验与学术严谨性，所有词条编写与维护必须遵循以下准则：

1. **客观中立，拒绝推销宣传**：
   - 本知识库是纯粹的学习与查阅工具，严禁写入任何产品营销套话、吹捧形容词或虚浮的公关话术；
   - 介绍工具、框架或规范时，始终陈述其客观原理、性能指标、兼容边界与适用场景。
2. **拒绝无意义的图标堆砌**：
   - 目录与标题保持纯净整洁，避免在每行每句前滥用各类装饰性 Emoji；
   - 仅在必要的信息图表、流程图或关键状态提示时使用规范的图形与 SVG 矢量图。
3. **理论推导与工程实践结合**：
   - 深入底层解析规范与数据流，配合代码片段、数学公式或架构拓扑图；
   - 文末必须提供可追溯的原始文献与官方标准规范链接（如 W3C、IETF RFC、CommonMark 规范、Unicode 报告）。

---

## 2. 知识库架构与八大专业领域分类

知识库采用 Lauren Tan 编译器级 Dune 架构哲学，各领域相互隔离，通过注册表聚合：

\`\`\`
projects/darktu-docs/
├── src/
│   ├── data/
│   │   ├── navigation.js           # 目录树、Slug 别名与章节注册
│   │   ├── articlesContent.js      # 全量词条聚合器
│   │   └── articles/               # 八大专业领域词条源码（隔离扩展）
│   │       ├── markdownSpecs.js       # 1. 语法与标准 (CommonMark, GFM, AST, 安全)
│   │       ├── clreqTypography.js     # 2. 中文排版学 (CLReq, 网格, 盘古之白, 禁则)
│   │       ├── latexFormulas.js       # 3. 数学公式 (KaTeX, AMS 矩阵, 物理化学)
│   │       ├── codeAndMermaid.js      # 4. 代码与图表 (Prism, Shiki, Mermaid 建模)
│   │       ├── clipboardEngineering.js# 5. 富文本剪贴板 (MIME, 行内化, 防剥离)
│   │       ├── assetsStorage.js       # 6. 媒体与存储 (AVIF/WebP, S3/R2 预签名, 本地优先)
│   │       ├── technicalWriting.js    # 7. 写作实践与合规 (RFC2119, DFA 词库, WCAG)
│   │       └── appendixMaintenance.js # 8. 附录与索引 (术语总表, 维护指南)
│   ├── services/
│   │   ├── markdownRenderer.js     # Markdown 语法与大纲解析引擎
│   │   ├── searchService.js        # 全文索引与检索服务
│   │   ├── themeService.js         # 深浅模式偏好持久化
│   │   └── uiHelpers.js            # 代码复制与大纲追踪交互
│   └── styles/                     # 经典排版样式表
└── test/
    ├── verify_dune_architecture.js # Dune 架构公理硬断言 (index.js <= 250 行)
    └── docs_integrity.test.js      # 词条内容完整性、死链与合规扫描
\`\`\`

---

## 3. 实战项目持续反哺与文献入库机制

知识库并非孤立的静态手册，而是与整个工程生态紧密相连的活态知识库。在具体项目（如富文本编辑器、图片处理工具、IDE 扩展等）开发与演进过程中，一旦遇到**现有知识库未涵盖或解释不够透彻的专业边界**，必须遵循以下反哺入库流程：

### 3.1 权威文献溯源标准 (Literature Sourcing Hierarchy)
编写词条时，严禁使用未经证实的二手博客或软文作为依据，必须溯源一手权威技术文献：
- **Tier-1 国际组织核心标准**：
  - W3C Recommendations：如 [W3C 中文排版需求要点](#/w3c-clreq)、HTML5 规范、CSS Text Module Level 3；
  - IETF RFC 规范：如 RFC 2119（规范级别说明）、RFC 2046（MIME 类型定义）、RFC 7946（GeoJSON 规范）；
  - Unicode Consortium：Unicode 核心规范、UAX #14（断行算法）、UAX #29（文本分词）。
- **Tier-2 工业级文法与语言基准**：
  - CommonMark 形式化规范与自动化测试套件；
  - GitHub Flavored Markdown (GFM) 规范；
  - KaTeX / MathJax 语法支持矩阵与 AMS-LaTeX 符号标准；
  - Mermaid.js 官方架构与渲染管道文档。
- **Tier-3 底层平台与开发者白皮书**：
  - MDN Web Docs（Mozilla 开发者网络）；
  - Chromium Blink 与 WebKit 渲染引擎设计白皮书；
  - ECMA-262 语言规范。

### 3.2 分类决策树 (Taxonomy Routing)
遇到新课题时，依据以下决策树进行精准分类归档：
- 涉及纯文本标记、AST 节点抽象、扩展语法解析、XSS 防护 $\\rightarrow$ **1. 语法与标准** (\`markdownSpecs.js\`)；
- 涉及汉字字身框、行距比率、标点悬挂、中西文混排空隙 $\\rightarrow$ **2. 中文排版学** (\`clreqTypography.js\`)；
- 涉及数学符号、矩阵行列式、物理化学宏包、公式无障碍 $\\rightarrow$ **3. 数学公式** (\`latexFormulas.js\`)；
- 涉及代码语法高亮、Token 流分词、Mermaid 流程图/时序图/甘特图 $\\rightarrow$ **4. 代码与图表** (\`codeAndMermaid.js\`)；
- 涉及 \`navigator.clipboard\`、多 MIME 封包、第三方平台样式隔离与 CSS 行内化 $\\rightarrow$ **5. 富文本剪贴板** (\`clipboardEngineering.js\`)；
- 涉及现代图片压缩、对象存储临时凭据、本地优先离线同步 $\\rightarrow$ **6. 媒体与存储** (\`assetsStorage.js\`)；
- 涉及双语撰写风格、敏感词 DFA 状态机匹配、版权授权许可 $\\rightarrow$ **7. 写作实践与合规** (\`technicalWriting.js\`)；
- 涉及全库通用术语、概念跨度大的缩略词或维护规范 $\\rightarrow$ **8. 附录与索引** (\`appendixMaintenance.js\`)。

---

## 4. 词条入库四步闭环标准

入库编写只需遵循以下四步流程，全程由自动化测试网与 CI/CD 流水线守护：

### 第一步：编写词条 Markdown 内容
在 \`src/data/articles/\` 下对应的领域文件中，添加以词条 ID 为键的 Markdown 字符串：
\`\`\`javascript
export const MY_DOMAIN_ARTICLES = {
  "domain/new-topic": \`# 新词条标题

> 这里是一句话的词条概述或背景说明。

---

## 1. 规范来源与核心概念
引用相关权威文献（如 RFC 或 W3C 规范），解析其原理...

## 2. 工程实现与代码示例
提供无虚饰的最小可复现示例代码...

## 3. 参考文献与官方标准
- 官方规范文档链接
\`
};
\`\`\`

### 第二步：在 \`src/data/navigation.js\` 中登记目录
在对应的分类 \`items\` 数组中追加该词条的 Slug、标题与简介：
\`\`\`javascript
{
  id: "domain/new-topic",
  slug: "new-topic",
  title: "新词条显示名称",
  description: "简明扼要的一句话摘要，供全库搜索和卡片展示。",
}
\`\`\`

### 第三步：运行本地自动化回归测试
在项目目录下执行：
\`\`\`bash
npm test
\`\`\`
自动化测试套件（包含 \`verify_dune_architecture.js\` 与 \`docs_integrity.test.js\`）会自动执行以下硬断言：
1. **Dune 架构公理**：主入口模块（\`src/index.js\`）代码行数 $\\le 250$ 行，所有异步捕获均窄化且显式；
2. **实质内容校验**：每一个词条的内容真实有效且字数 $> 200$ 字；
3. **占位符零容忍**：严禁遗留任何未完成的草稿占位标记；
4. **语言纯洁性**：严禁包含商业吹捧营销词汇；
5. **维基内链连通性**：全库所有条目内链（\`#/{slug}\`）100% 存在且可解析。

### 第四步：推送 Git 触发全自动构建发布
通过 Git 提交代码并推送到 GitHub 仓库主干：
\`\`\`bash
git add -A
git commit -m "docs: add comprehensive chapter on <topic>"
git push origin main
\`\`\`
Cloudflare Pages 已与 GitHub 仓库打通自动化 CI/CD 管道：
- 监测到 \`main\` 分支变动后自动启动云端容器；
- 执行 \`npm run build\` 进行 Vite 高性能生产编译；
- 全球 Anycast 边缘节点秒级完成部署与生效（正式域名：\`https://docs.darktu.com\`）。

---

## 5. 社区协同与勘误渠道

知识库源代码完全开源并托管于 GitHub。欢迎每位读者对发现的错别字、陈旧规范或不准确描述提出改进：
- **提交 Issue / 勘误建议**：[GitHub Issues 页面](https://github.com/DF-Guan/darktu-docs/issues)
- **提交 Pull Request 参与编辑**：[GitHub 仓库主页](https://github.com/DF-Guan/darktu-docs)
- **文档使用许可**：采用 **知识共享 署名-非商业性使用-相同方式共享 4.0 国际许可协议 (CC BY-NC-SA 4.0)**，支持自由学习与非商业传播。
`
};
