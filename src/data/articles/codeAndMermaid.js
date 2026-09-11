/**
 * 篇章四：现代图表与代码可视化工程 (codeAndMermaid.js)
 * 行业权威规范：Prism/Shiki 高亮机制, Mermaid 流程图/时序图/ER/Git拓扑全家桶
 */

export const CODE_AND_MERMAID_ARTICLES = {
  "diagrams/syntax-highlighting": `# 现代代码高亮体系与开发者写作规范

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
`,

  "diagrams/mermaid-flowchart": `# Mermaid 流程图 (Flowchart) 完整工业建模指南

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
`,

  "diagrams/mermaid-sequence": `# Mermaid 时序图 (Sequence Diagram) 消息传递与通信建模

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
`,

  "diagrams/mermaid-class-er": `# Mermaid 类图、状态机与实体关系图 (ER) 规范

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
`,

  "diagrams/mermaid-git-mindmap": `# Mermaid Git 拓扑图与思维导图 (Mindmap) 绘制标准

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
`
};
