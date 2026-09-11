/**
 * 知识库全量目录与章节索引 (docs.darktu.com)
 * 学习型文档百科：Markdown 规范、中文排版、数学公式、图表、剪贴板工程、媒体存储与写作合规
 */

export const DOCS_NAVIGATION = [
  {
    id: "markdown-specs",
    title: "1. 语法与规范",
    badge: "7 篇",
    items: [
      {
        id: "markdown-specs/spec-evolution",
        slug: "overview", // 默认首篇
        aliasSlugs: ["spec-evolution"],
        title: "Markdown 发展史与方言差异",
        description: "CommonMark、GFM、Markdown Extra 与 Pandoc 的设计哲学、文法演进与 AST 解析管线对比。",
      },
      {
        id: "markdown-specs/commonmark-core",
        slug: "syntax", // 兼容 #/syntax 快捷直达核心语法
        aliasSlugs: ["basic-syntax", "commonmark-core"],
        title: "CommonMark 核心规范解析",
        description: "ATX 与 Setext 标题、定界符栈算法、松散与紧凑列表、区块引用及围栏代码块。",
      },
      {
        id: "markdown-specs/gfm-extensions",
        slug: "gfm-extensions",
        title: "GFM 扩展规范手册",
        description: "结构化表格对齐、任务列表、删除线、自动超链接与 Emoji 简码扩展用法。",
      },
      {
        id: "markdown-specs/advanced-markdown",
        slug: "advanced-markdown",
        title: "高级排版特性与 HTML 嵌入",
        description: "学术脚注 Footnotes 语法、定义列表与 HTML5 标签安全子集及清洗机制。",
      },
      {
        id: "markdown-specs/callouts-spec",
        slug: "callouts",
        title: "现代 Callout 提示块指南",
        description: "[!NOTE]、[!TIP]、[!IMPORTANT]、[!WARNING]、[!CAUTION] 五大提示块语法体系。",
      },
      {
        id: "markdown-specs/frontmatter-and-metadata",
        slug: "frontmatter-and-metadata",
        title: "YAML Frontmatter 与元数据规范",
        description: "Hugo、Jekyll、Astro 与 Next.js 等前置元数据规范、YAML/TOML/JSON 对比与 AST 灰度解析。",
      },
      {
        id: "markdown-specs/edge-cases-and-gotchas",
        slug: "edge-cases-and-gotchas",
        title: "Markdown 语法陷阱与歧义解析",
        description: "紧凑/松散列表行距、有序列表断裂、围栏反引号逃逸、表格单元格竖线与转义陷阱。",
      },
    ],
  },
  {
    id: "typography",
    title: "2. 中文排版学",
    badge: "5 篇",
    items: [
      {
        id: "typography/w3c-clreq",
        slug: "w3c-clreq",
        title: "W3C 中文排版需求 (CLReq) 要点",
        description: "汉字网格概念、字身框与字面比、最佳行长限制与行距呼吸律动标准。",
      },
      {
        id: "typography/pangu-spacing",
        slug: "pangu-spacing",
        title: "盘古之白：中西文混排规范",
        description: "中西文及数字间隙四分之一汉字宽规则、特定标点豁免场景与处理机制。",
      },
      {
        id: "typography/punctuation-system",
        slug: "punctuation-system",
        title: "中文标点规范与避头尾法则",
        description: "GB/T 15834 标点标准、避头尾折行禁则 (Line Breaking) 与标点挤压计算模型。",
      },
      {
        id: "typography/visual-hierarchy",
        slug: "visual-hierarchy",
        title: "版面视觉节奏与字阶体系",
        description: "调和音阶模块化字号阶梯、行高系数计算、段落间距与标题亲密性法则。",
      },
      {
        id: "typography/web-font-optimization",
        slug: "web-font-optimization",
        title: "Web 中文字体加载与切片子集化",
        description: "中文字体体积困境、font-display 渲染策略、字蛛子集化与 unicode-range 动态分包。",
      },
    ],
  },
  {
    id: "math",
    title: "3. 数学公式与符号",
    badge: "5 篇",
    items: [
      {
        id: "math/latex-fundamentals",
        slug: "latex-fundamentals",
        title: "LaTeX 数学公式基础语法",
        description: "行内与块级公式定界符、上下标、分式、根号、求和积分与自适应括号。",
      },
      {
        id: "math/katex-vs-mathjax",
        slug: "katex-vs-mathjax",
        title: "KaTeX 与 MathJax 引擎对比",
        description: "DOM 渲染速度基准测试、资源体积对比与富文本复制中的公式转换方案。",
      },
      {
        id: "math/matrices-and-cases",
        slug: "matrices-and-cases",
        title: "复杂数学矩阵与分段函数排版",
        description: "matrix/pmatrix/bmatrix 矩阵环境、cases 分段函数与 aligned 连等式对齐实战。",
      },
      {
        id: "math/scientific-symbols",
        slug: "scientific-symbols",
        title: "数学、物理与希腊字母速查表",
        description: "24 个希腊字母大小写对照、集合算子、微积分算子与逻辑命题速查表。",
      },
      {
        id: "math/physics-and-chemistry",
        slug: "physics-and-chemistry",
        title: "物理量单位与 mhchem 化学方程式",
        description: "SI 国际单位制正斜体规范、mhchem 宏包化学式与核反应衰变方程排版指南。",
      },
    ],
  },
  {
    id: "diagrams",
    title: "4. 代码高亮与图表",
    badge: "6 篇",
    items: [
      {
        id: "diagrams/syntax-highlighting",
        slug: "syntax-highlighting",
        title: "代码高亮机制与写作规范",
        description: "Prism.js 正则分词 vs Shiki TextMate 机制、行号高亮与 Diff 补丁书写规范。",
      },
      {
        id: "diagrams/mermaid-flowchart",
        slug: "mermaid-flowcharts",
        title: "Mermaid 流程图建模指南",
        description: "拓扑流动方向、8 种几何节点形状、条件分支连接线与 Subgraph 架构分层。",
      },
      {
        id: "diagrams/mermaid-sequence",
        slug: "mermaid-sequence",
        title: "Mermaid 时序图交互建模",
        description: "Actor 与 Participant 声明、同步/异步消息序列与生命周期激活柱控制。",
      },
      {
        id: "diagrams/mermaid-class-er",
        slug: "mermaid-class-er",
        title: "Mermaid 类图、状态机与 ER 模型",
        description: "数据库关系实体属性定义、有限状态机流转建模与甘特图里程碑规划。",
      },
      {
        id: "diagrams/mermaid-git-mindmap",
        slug: "mermaid-git-mindmap",
        title: "Mermaid Git 拓扑图与思维导图",
        description: "Git Graph 提交/分支/合并拓扑图与 Mindmap 树形发散节点绘制指南。",
      },
      {
        id: "diagrams/mermaid-gantt-c4",
        slug: "mermaid-gantt-c4",
        title: "Mermaid 甘特图与 C4 架构模型",
        description: "研发项目甘特图排期里程碑、依赖任务链与 C4 软件架构模型上下文与容器建模。",
      },
    ],
  },
  {
    id: "clipboard",
    title: "5. 富文本与剪贴板",
    badge: "5 篇",
    items: [
      {
        id: "clipboard/clipboard-mime-inliner",
        slug: "clipboard-mime-inliner",
        title: "剪贴板机制：MIME 与 CSS 行内化",
        description: "多重数据包机制、宿主环境外部样式剥离风险与 Inliner 特异性权重合并原理。",
      },
      {
        id: "clipboard/wechat-engine-sandbox",
        slug: "wechat-sandbox",
        title: "微信公众平台富文本排版沙箱",
        description: "外链转文末脚注处理、网络字体限制与微信后台安全样式白名单全景。",
      },
      {
        id: "clipboard/multiplatform-publishing",
        slug: "multiplatform-publishing",
        title: "多平台富文本排版适配要点",
        description: "知乎公式映射、掘金技术专栏渲染特性与多平台一键分发调度器架构设计。",
      },
      {
        id: "clipboard/svg-canvas-rendering",
        slug: "svg-canvas-rendering",
        title: "SVG 矢量渲染与 Canvas 长图绘制",
        description: "foreignObject 虚拟化、Retina 高分抗锯齿缩放与 CORS 跨域污染防御策略。",
      },
      {
        id: "clipboard/html-sanitizer-ast",
        slug: "html-sanitizer-ast",
        title: "DOMPurify 与 AST 白名单深度清洗",
        description: "富文本跨站脚本 XSS 风险、突变型 mXSS 深度剖析与 DOMPurify 安全白名单配置。",
      },
    ],
  },
  {
    id: "assets",
    title: "6. 媒体资源与存储",
    badge: "3 篇",
    items: [
      {
        id: "assets/image-hosting-arch",
        slug: "image-hosting-arch",
        title: "图床架构：S3 / R2 / OSS 签名体系",
        description: "传统服务端中转弊端、客户端预签名直传机制与三大存储服务特性对比。",
      },
      {
        id: "assets/nextgen-image-formats",
        slug: "nextgen-image-formats",
        title: "下一代图片格式：WebP 与 AVIF",
        description: "JPEG/PNG 与 WebP/AVIF 压缩比评测与 <picture> 标签渐进式加载方案。",
      },
      {
        id: "assets/cdn-and-security",
        slug: "cdn-and-security",
        title: "防盗链机制、CDN 缓存与隐私擦除",
        description: "HTTP Referer 鉴权白名单、图片 EXIF GPS 经纬度本地强制擦除算法。",
      },
    ],
  },
  {
    id: "writing",
    title: "7. 写作实践与合规",
    badge: "5 篇",
    items: [
      {
        id: "writing/technical-writing-guide",
        slug: "technical-writing-guide",
        title: "技术写作风格指南与信息架构",
        description: "金字塔原理、开发者写作准则、人机协同辅助规范与无歧义术语表。",
      },
      {
        id: "writing/dfa-compliance-filter",
        slug: "dfa-compliance-filter",
        title: "内容合规：DFA 有限状态机算法",
        description: "广告法违禁词检测、Trie 前缀树构建、O(N) 极速扫描与跳字干扰过滤。",
      },
      {
        id: "writing/open-licenses-copyright",
        slug: "open-licenses-copyright",
        title: "数字出版版权：知识共享 (CC) 协议",
        description: "CC BY-NC-SA 4.0 组合定义、MIT/Apache/GPL 软件协议选择与合理引用准则。",
      },
      {
        id: "writing/local-first-architecture",
        slug: "local-first-architecture",
        title: "本地优先 (Local-First) 离线存储架构",
        description: "零延迟输入准则、数据所有权、IndexedDB 事务库与快照版本比对回滚。",
      },
      {
        id: "writing/accessibility-a11y",
        slug: "accessibility-a11y",
        title: "数字文档无障碍访问规范 (A11y)",
        description: "WCAG 2.2 核心原则、屏幕阅读器大纲流、色彩对比度科学与键盘完全无障碍操作。",
      },
    ],
  },
  {
    id: "appendix",
    title: "8. 术语索引与维护",
    badge: "2 篇",
    items: [
      {
        id: "appendix/glossary",
        slug: "glossary",
        title: "常见术语索引表 (Glossary)",
        description: "按字母顺序收录 AST、CommonMark、KaTeX、Pangu 等核心术语概念与速查定义。",
      },
      {
        id: "appendix/maintenance-guide",
        slug: "maintenance-guide",
        title: "知识库编写与持续维护指引",
        description: "维基百科式开放条目组织规则、如何新增词条、自动化校验测试与 GitHub 贡献流程。",
      },
    ],
  },
];

// 展平为所有文章扁平列表
export const ALL_DOCS = DOCS_NAVIGATION.flatMap((cat) =>
  cat.items.map((item) => ({
    ...item,
    categoryId: cat.id,
    categoryTitle: cat.title,
  }))
);

/**
 * 根据 URL hash 或 slug 查找文章及相邻上一篇/下一篇
 */
export function getDocBySlugOrId(hashOrSlug) {
  let clean = (hashOrSlug || "").replace(/^#\/?/, "").trim();
  if (!clean) clean = "overview";

  const index = ALL_DOCS.findIndex(
    (d) => d.slug === clean || d.id === clean || (d.aliasSlugs && d.aliasSlugs.includes(clean))
  );

  const doc = index !== -1 ? ALL_DOCS[index] : ALL_DOCS[0];
  const activeIndex = index !== -1 ? index : 0;
  const prev = activeIndex > 0 ? ALL_DOCS[activeIndex - 1] : null;
  const next = activeIndex < ALL_DOCS.length - 1 ? ALL_DOCS[activeIndex + 1] : null;

  return { doc, prev, next };
}
