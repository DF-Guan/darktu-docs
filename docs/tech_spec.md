<!-- 🔒 本地私密技术架构档案 · 严禁公网上传 · 严禁发布泄露 -->
# 🟣 [Tier-2 · 深度技术规格] darktu-docs 深度技术规格与架构设计 (tech_spec.md)

> 🛡️ **重要程度：Tier-2（深度架构规格 · 核心开发与审计基线）**  
> **关联图谱**：详细三维可观测契约参见 [`docs/feature_map.md`](file:///./feature_map.md)；全局宪法约束参见工作区根目录 [`GEMINI.md`](file:///../../GEMINI.md)。

---

## 📌 一、系统全景架构 (System Architecture)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       1. 表现与入口层 (Presentation)                    │
│                       • `src/index.js` (轻量装配控制器 <= 250 行)       │
│                       • `index.html` (语义骨架与无障碍标记)             │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────────────┐
│                       2. 交互与阅读服务层 (Domain Services)              │
│                       • `src/services/wikilinkPreview.js` (悬浮预览)     │
│                       • `src/services/keyboardShortcuts.js` (全键盘导航) │
│                       • `src/services/readingSettings.js` (字号与舒适度) │
│                       • `src/services/searchUI.js` & `searchService.js` │
│                       • `src/services/markdownRenderer.js` (轻量渲染引擎)│
│                       • `src/services/uiHelpers.js` (锚点直达与 Toast)  │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────────────┐
│                       3. 知识库数据与索引层 (Data Layer)                 │
│                       • `src/data/navigation.js` (9 大分类 40 篇词条)   │
│                       • `src/data/articles/*.js` (模块化词条源码)        │
│                       • `src/data/articlesContent.js` (动态汇聚字典)     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📐 二、数学模型与排版计算公式

### 1. 阅读时长与字数预估公式
对于中文技术长文，人眼平均屏显扫读速度约为每分钟 $450$ 汉字，行内代码与数学公式需折算 $1.5$ 倍认知时长：
$$\text{ReadTime}(\text{minutes}) = \max\left(1, \left\lceil \frac{\text{WordCount}}{450} \right\rceil\right)$$

### 2. 调和音阶字阶比率 (Modular Scale)
字阶序列遵循五度音阶比率（Ratio $r = 1.25$），以基准字号 $f_0 = 16\text{px}$ 进行幂级数映射：
$$f_n = f_0 \times r^n \quad (n \in \{-1, 0, 1, 2, 3\})$$
- 辅助说明 ($n=-1$): $14\text{px}$
- 正文正文 ($n=0$): $16\text{px}$
- 小节标题 ($n=1$): $20\text{px}$
- 章节标题 ($n=2$): $24\text{px}$
- 主标题 ($n=3$): $32\text{px}$

### 3. 搜索多因子加权打分模型
对于检索词流 $T = \{t_1, t_2, \dots, t_k\}$，条目 $D$ 的相关度评分计算为：
$$\text{Score}(D) = \sum_{t \in T} \left( 100 \cdot \mathbb{I}_{\text{Title}}(t) + 50 \cdot \mathbb{I}_{\text{TitlePrefix}}(t) + 30 \cdot \mathbb{I}_{\text{Desc}}(t) + 5 \cdot \min(10, \text{Count}_{\text{Body}}(t)) \right)$$

---

## 🔒 三、零泄漏脱敏矩阵
- 仓库源码中严禁硬编码绝对本地磁盘路径；
- 部署至公网 (Cloudflare Pages / GitHub) 仅包含开源正文规范与公开技术实现。
