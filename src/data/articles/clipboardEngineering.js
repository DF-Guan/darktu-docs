/**
 * 篇章五：富文本剪贴板与排版引擎底层工程 (clipboardEngineering.js)
 * 剪贴板与富文本学习指南：MIME text/html, CSS 行内化 Inliner, 微信排版沙箱, SVG/Canvas 渲染
 */

export const CLIPBOARD_ENGINEERING_ARTICLES = {
  "clipboard/clipboard-mime-inliner": `# 富文本剪贴板工程原理：MIME text/html 与 CSS 行内化编译

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
`,

  "clipboard/wechat-engine-sandbox": `# 微信公众号排版引擎沙箱与 CSS 白名单全景剖析

> 微信公众号编辑器基于一套高度定制的富文本清洗沙箱。掌握其过滤黑白名单，是设计高可靠自媒体排版工具的前提。

---

## 1. 微信排版过滤沙箱的三大铁律

1. **绝对禁止任何外部超链接**：
   - 微信后台会对所有 \`<a href="...">\` 进行严格域名白名单拦截；
   - **非微信公众平台官方域名（如 qq.com, weixin.qq.com）的外部链接会被强行剥离超链接**，降级为纯文本或直接吞掉；
   - **行业规范解决方案**：将 Markdown 外部链接在编译时自动转换为学术级“文末文内脚注（Footnotes）”。
2. **绝对禁止外部网络字体与 \`@font-face\`**：
   - 必须使用系统原生安全字体栈（-apple-system, PingFang SC, Microsoft YaHei）；
3. **彻底封杀伪元素与相对/绝对定位的特定属性**：
   - \`::before\` 与 \`::after\` 伪元素无法通过行内 style 注入，在微信富文本中完全失效；
   - 部分高危的 \`position: fixed\` 与多层负向 \`z-index\` 会被直接剔除。

---

## 2. 微信后台完全兼容的 CSS 安全属性清单

| 样式维度 | 安全兼容的属性 (100% 保留) | 风险或被过滤属性 (严禁使用) |
| :--- | :--- | :--- |
| **盒模型** | \`margin\`, \`padding\`, \`border\`, \`border-radius\`, \`box-sizing\` | \`outline-offset\`, 负 margin 破位穿透 |
| **色彩与背景** | \`color\`, \`background-color\`, \`background-image: linear-gradient(...)\` | 依赖外部 URL 的背景图（常被微信跨域防盗链拦截） |
| **文字排版** | \`font-size\`, \`font-weight\`, \`line-height\`, \`letter-spacing\`, \`text-align\` | \`text-shadow\` (部分旧版安卓端可能丢失) |
| **现代布局** | \`display: flex\`, \`justify-content\`, \`align-items\`, \`flex-wrap\` | \`display: grid\` (微信历史版本兼容性欠佳) |
| **视觉层次** | \`box-shadow\`, \`opacity\` | \`filter: blur()\` (部分移动端产生性能黑边) |
`,

  "clipboard/multiplatform-publishing": `# 多平台富文本排版适配：知乎、掘金、微信与简书

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
`,

  "clipboard/svg-canvas-rendering": `# SVG 矢量渲染与跨域 Canvas 长图合成技术

> 在小红书爆款卡片、微信朋友圈分享图或技术信息图制作中，客户端纯前端生成 2K/4K 高清长图是现代自媒体工具的必备能力。

---

## 1. 纯前端 HTML 转图片的三大实现路径

1. **SVG \`<foreignObject>\` 虚拟化**：将待渲染的 HTML 片段序列化包裹进 SVG 的 foreignObject 节点中，绘制到 Canvas 后导出位图；
2. **DOM-to-Canvas 深度遍历重绘**：通过递归解析 DOM 树的每个节点几何尺寸（\`getBoundingClientRect\`）、边框、字号，直接用 Canvas 2D 绘图 API（\`fillText\`, \`strokeRect\`）物理重绘；
3. **高分屏 Retina 抗锯齿缩放**：根据设备像素比（\`window.devicePixelRatio\` 或固定 2x/3x 倍率）动态放大 Canvas 画布宽高，再缩小样式尺寸，彻底消除字体模糊与毛刺。

---

## 2. 避免 Canvas 污染 (Tainted Canvas) 的 CORS 跨域治理

当渲染包含外部第三方图床（如阿里云 OSS、AWS S3）的图片时，若图片未配置 CORS 响应头，Canvas 在调用 \`toDataURL()\` 或 \`toBlob()\` 时会抛出致命的 **SecurityError (The operation is insecure)**：
- **前置预加载**：所有参与长图绘制的图片必须设置 \`img.crossOrigin = "anonymous"\`；
- **回退机制**：若外部图床响应头缺失 \`Access-Control-Allow-Origin\`，客户端应通过本地 IndexedDB 缓存 Blob 转换为 \`blob:...\` 伪协议安全加载。
`
};
