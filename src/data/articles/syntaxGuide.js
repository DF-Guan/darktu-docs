/**
 * 第二章：Markdown 核心与扩展语法全集 (Syntax Guide)
 */

export const syntaxGuideArticles = {
  "syntax/basic": `
# ✍️ Markdown 核心基础语法全集

WeMarkdown 完整兼容 CommonMark 与 GFM (GitHub Flavored Markdown) 标准规范，并在公众号富文本兼容层做了内联 CSS 特殊优化。

---

## 1. 标题分级 (Headings)

使用 1 到 6 个 \`#\` 号表示六级标题。自媒体排版中推荐主要使用 H2 与 H3 保证手机端易读性：

\`\`\`markdown
# 一级主标题（通常作为文章主题或大专题）
## 二级小节标题（建议搭配设计主题下划线样式）
### 三级核心观点（重点强化）
#### 四级细分点
\`\`\`

---

## 2. 文本强调与高亮 (Emphasis & Highlight)

| 语法 | 说明 | 渲染示例 |
| :--- | :--- | :--- |
| \`**粗体文字**\` | 强调核心词汇 | **粗体文字** |
| \`*斜体文字*\` | 次要提示或英文书名 | *斜体文字* |
| \`~~删除线~~\` | 纠错或修辞幽默 | ~~删除线~~ |
| \`++下划线++\` | 重要下划线标注 | <u>下划线</u> |
| \`==高亮背景==\` | 黄色荧光笔划线质感 | <mark>高亮背景</mark> |
| \`H~2~O\` | 下标（化学式、微积分） | H<sub>2</sub>O |
| \`X^2^\` | 上标（幂次方、学术引用） | X<sup>2</sup> |

---

## 3. 引用块 (Blockquotes)

在行首使用 \`>\` 符号表示引用。支持多段落与嵌套：

\`\`\`markdown
> 写作不是为了取悦算法，而是为了留下经得起时间检验的思想。
> 
> —— Darktu 创作者手记
\`\`\`

WeMarkdown 会根据当前选中的主题，将引用块渲染为带优雅左边框或卡片底色的视觉区块。

---

## 4. 列表与待办任务 (Lists & Task Lists)

### 无序列表
\`\`\`markdown
- 保持专注与克制
- 杜绝废话与信息冗余
  - 提炼结构化清单
\`\`\`

### 有序列表
\`\`\`markdown
1. 第一阶段：构思选题与大纲
2. 第二阶段：Markdown 纯文本起草
3. 第三阶段：WeMarkdown 一键排版与插图
\`\`\`

### 待办任务清单 (Task Lists)
\`\`\`markdown
- [x] 完成文章初稿撰写
- [x] 使用 AI 副驾驶生成 5 组爆款标题
- [ ] 导出小红书 3:4 封面卡片
\`\`\`

---

## 5. 代码块与行内代码 (Code)

### 行内代码
使用单个反引号包裹：\`console.log('Hello WeMarkdown')\`。

### 多行代码块 (带语言指定与微信换行保护)
\`\`\`typescript
interface ArticleConfig {
  title: string;
  theme: "darktu-cyber" | "dongfang-qingdai" | "bloomberg";
  panguFormatting: boolean;
}

export function publishArticle(config: ArticleConfig): boolean {
  console.log(\`Ready to publish: \${config.title}\`);
  return true;
}
\`\`\`

> [!TIP]
> 很多在线编辑器直接复制到微信后台时，长代码块不会自动折行且排版混乱。WeMarkdown 在复制底层注入了 \`overflow-x: auto\` 与等宽字体规范，移动端自动水平滑动且保全颜色高亮。

---

## 6. 表格 (Tables)

使用 \`|\` 与 \`-\` 分隔行列，使用 \`:\` 控制对齐方向：

\`\`\`markdown
| 平台名称 | 适用场景 | 优势特点 |
| :--- | :---: | ---: |
| 微信公众号 | 深度阅读 / 私域沉淀 | 格式自由，支持丰富排版组件 |
| 知乎专栏 | 专业问答 / 知识沉淀 | LaTeX 公式支持极佳 |
| 掘金社区 | 技术干货 / 开发者社区 | 程序员专属互动平台 |
\`\`\`
`,

  "syntax/math": `
# 📐 LaTeX 数学公式 KaTeX 全能指南

WeMarkdown 内置了高性能 **KaTeX** 数学排版引擎，支持所有标准 LaTeX 数学语法，毫秒级快速编译，复制到微信时自动转换为跨平台保真的高精度排版结构。

---

## 1. 行内公式 (Inline Math)

在行文中使用单个美元符号 \`$公式$\` 包裹：

\`\`\`markdown
质能方程由爱因斯坦提出：$E = mc^2$，揭示了质量与能量的等价性。
\`\`\`
渲染效果：$E = mc^2$

---

## 2. 块级居中公式 (Display Math)

使用双美元符号 \`$$...$$\` 独立成行，公式将自动居中并具备充裕的上下留白：

\`\`\`markdown
$$
f(x) = \\int_{-\\infty}^{\\infty} \\hat{f}(\\xi)\\,e^{2 \\pi i \\xi x} \\,d\\xi
$$
\`\`\`

---

## 3. 常用高等数学符号速查

### 分式与根号
\`\`\`latex
$$
\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$
\`\`\`

### 求和、积分与极限
\`\`\`latex
$$
\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1, \\quad \\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}
$$
\`\`\`

### 矩阵表示 (Matrices)
\`\`\`latex
$$
\\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix}
\\begin{pmatrix}
x \\\\
y
\\end{pmatrix}
=
\\begin{pmatrix}
ax + by \\\\
cx + dy
\\end{pmatrix}
$$
\`\`\`

### 分段函数 (Piecewise Functions)
\`\`\`latex
$$
f(n) =
\\begin{cases}
n/2,  & \\text{若 } n \\text{ 是偶数} \\\\
3n+1, & \\text{若 } n \\text{ 是奇数}
\\end{cases}
$$
\`\`\`
`,

  "syntax/mermaid": `
# 📊 Mermaid 图表全能实战指南

WeMarkdown 完整支持 **Mermaid** 矢量图表语法。纯文本即可编写工业级流程图、时序图、甘特图等，无需外部绘图工具导出截图。

---

## 1. 流程图 (Flowchart)

\`\`\`mermaid
flowchart TD
    Start["构思选题"] --> Draft["Markdown 写作"]
    Draft --> AI{"开启 AI 副驾驶?"}
    AI -- "是" --> Refine["爆款标题 & 润色去AI味"]
    AI -- "否" --> Pangu["盘古中英文美化"]
    Refine --> Pangu
    Pangu --> Theme["选择主题 & 自媒体组件"]
    Theme --> Copy["一键复制到公众号"]
\`\`\`

---

## 2. 时序图 (Sequence Diagram)

适合展示系统交互、接口调用或业务流程流转：

\`\`\`mermaid
sequenceDiagram
    autonumber
    actor Creator as 创作者
    participant Web as WeMarkdown 前端
    participant Core as 排版核心引擎
    participant WeChat as 微信公众号后台

    Creator->>Web: 输入 Markdown 与插入排版组件
    Web->>Core: 触发 ThemeProcessor 内联编译
    Core-->>Web: 生成富文本 DOM 与内联 CSS
    Creator->>Web: 点击「复制到公众号」
    Web->>WeChat: 系统剪贴板静默注入 (HTML+Plain)
    WeChat-->>Creator: Ctrl+V 完美保全样式粘贴
\`\`\`

---

## 3. 甘特图 (Gantt Chart)

用于展示项目发布排期与里程碑规划：

\`\`\`mermaid
gantt
    title WeMarkdown v1.3.0 迭代甘特图
    dateFormat  YYYY-MM-DD
    section 核心排版
    自媒体组件挑选器       :done,    des1, 2026-09-01, 2026-09-04
    盘古排版与字数统计     :done,    des2, 2026-09-04, 2026-09-06
    section 客户端与知识库
    客户端下载专区 (A+B)   :active,  des3, 2026-09-09, 2026-09-11
    Darktu 知识库系统     :active,  des4, 2026-09-10, 2026-09-11
\`\`\`

---

## 4. 饼图 (Pie Chart)

\`\`\`mermaid
pie title 自媒体受众阅读终端分布
    "微信移动端 iOS" : 58
    "微信移动端 Android" : 32
    "桌面端与网页阅读" : 10
\`\`\`
`,

  "syntax/pangu": `
# 🌐 盘古中英文排版美化规范与阅读时长算法

优秀的版面呼吸感是优质自媒体的核心特征。WeMarkdown 深度集成了符合《中文排版指北》的 **盘古排版美化引擎** 与精准阅读时长测算模型。

---

## 1. 为什么需要「盘古之白」？

有研究表明，在汉字与英文字符、数字之间保持适当的留白（半角空格），能显著降低眼睛的阅读疲劳度，让科技类、教程类与商业分析文章呈现出大厂出版物级别的质感。

- **不良排版示例**：\`今天我们在WeMarkdown中体验了10个新特性。\`（拥挤、字符黏连）
- **规范排版示例**：\`今天我们在 WeMarkdown 中体验了 10 个新特性。\`（呼吸感充盈）

---

## 2. 排版美化规则覆盖范围

WeMarkdown 的「排版美化」功能会自动执行以下规范化处理：
1. **中英文混排**：在中文与英文词汇之间智能补齐单空格；
2. **中英文与数字**：在汉字与阿拉伯数字之间智能补齐单空格；
3. **标点符号修正**：自动将全角数字转为半角数字；修正全角标点两侧的冗余空格；
4. **代码块与公式隔离保护**：排版美化引擎具备 AST 预扫描机制，**绝对不会误伤** 代码块内部、数学公式、URL 链接及 HTML 标签属性！

---

## 3. 阅读时长统计算法模型

底部状态栏显示的「预计阅读时长」基于中文移动端阅读心理学大数据换算：
- **普通中文文本**：按照每分钟 **400 ~ 500 字** 的平均阅读速率测算；
- **技术代码块与公式**：自动按每行 3 秒的停顿深度思考时间加权；
- **排版组件与配图**：每张大图折算 5 秒视觉驻留时间；
- 最终得出类似 \`预计阅读: 约 4 分钟\` 的科学参考值，帮助作者把控篇幅结构。
`,

  "syntax/callouts": `
# 💡 提示块 Callouts 优雅排版全集

WeMarkdown 完美支持 GitHub / Obsidian 规范的 5 类标准提示块（Callouts）。在公众号中呈现为带柔和背景底色、侧边高光与专属图标的卡片：

---

## 1. 五大提示块语法

### 1.1 笔记提示块 (Note)
\`\`\`markdown
> [!NOTE]
> 记录背景信息、辅助说明或额外阅读背景。
\`\`\`

### 1.2 技巧建议块 (Tip)
\`\`\`markdown
> [!TIP]
> 写作技巧：在开头前三行抛出核心矛盾，可有效提升完读率 40% 以上。
\`\`\`

### 1.3 重要须知块 (Important)
\`\`\`markdown
> [!IMPORTANT]
> 微信公众号后台不支持外链直接点击，文中外链会自动转换为文末脚注索引。
\`\`\`

### 1.4 警告提示块 (Warning)
\`\`\`markdown
> [!WARNING]
> 涉及敏感违禁词汇可能导致公众号图文审核不通过，建议发布前使用合规自检功能。
\`\`\`

### 1.5 避坑警示块 (Caution)
\`\`\`markdown
> [!CAUTION]
> 严禁在未经授权的情况下直接复制网络侵权字体或盗用受版权保护的图片素材。
\`\`\`
`,
};
