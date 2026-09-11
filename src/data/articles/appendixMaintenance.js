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
- **提交 Issue / 勘误建议**：[GitHub Issues 页面](https://github.com/DF-Guan/darktu-docs/issues)
- **提交 Pull Request 参与编辑**：[GitHub 仓库主页](https://github.com/DF-Guan/darktu-docs)
- **文档使用许可**：采用 **知识共享 署名-非商业性使用-相同方式共享 4.0 国际许可协议 (CC BY-NC-SA 4.0)**，支持自由学习与非商业传播。
`
};
