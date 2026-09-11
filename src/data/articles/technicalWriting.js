/**
 * 篇章七：技术写作规范与内容合规工程 (technicalWriting.js)
 * 写作实践指南：技术写作风格指南, DFA 违禁词算法, 知识共享许可协议, Local-First 架构
 */

export const TECHNICAL_WRITING_ARTICLES = {
  "writing/technical-writing-guide": `# 现代技术写作风格指南与结构化信息架构设计

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
   - [推荐（主动）]：系统在接收到数据包后自动触发校验逻辑。
   - [避免（被动）]：数据包被系统接收后，校验逻辑被自动触发。
3. **保持术语全局绝对一致**：禁止在同一篇文档中对同一概念混用不同名词（如交替使用“Token”、“凭证”、“令牌”、“密钥”）。

---

## 3. AI 辅助写作与人机协同副驾驶 (AI Copilot) 规范

在生成式 AI 与大语言模型深度渗透技术写作的今天，必须恪守“人机协同副驾驶 (AI Copilot)”原则：
1. **真实性第一 (Fact-Checking)**：AI 生成的技术架构图、API 签名与参数列表必须经过真实编译器或测试用例硬验证，严禁直接照抄 LLM 幻觉；
2. **去除“AI 味”与废话膨胀**：剔除“在当今快节奏的数字化时代”、“总而言之”等模式化虚词，保持硬核技术密度；
3. **隐私与代码安全**：禁止向公共大模型上传带有真实生产环境密钥、私有数据库连接串的内容。
`,

  "writing/dfa-compliance-filter": `# 内容合规与违禁词检测：DFA 有限状态机敏感词过滤算法

> 在自媒体运营与数字出版中，违反《中华人民共和国广告法》（如滥用“最顶尖”、“绝对第一”、“全网唯一”）会导致公众号文章被强制下架甚至封号。

---

## 1. 为什么暴力正则扫描无法胜任工业级违禁词过滤？

若词库包含 20,000 个违禁词，对一篇 10,000 字的长文使用循环正则匹配，时间复杂度为 $\mathcal{O}(M \times N)$，耗时高达数秒，且极易导致浏览器主线程卡死（Freeze）。

---

## 2. DFA (Deterministic Finite Automaton) 核心算法模型

确定性有限自动机算法将数万敏感词预编译为一棵**多叉前缀树（Trie 字典树）**：
- 检索时间复杂度降低至极致的 $\mathcal{O}(N)$（只取决于文章长度，与敏感词库规模完全解耦！）；
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
`,

  "writing/open-licenses-copyright": `# 数字出版版权规范：知识共享 (CC BY-NC-SA) 与开源协议

> 数字时代的创作者必须清晰划定作品的授权边界，防范版权侵权与商业盗用纠纷。

---

## 1. 知识共享许可协议 (Creative Commons, CC) 全景拆解

CC 协议通过 4 种基础授权模块组合出 6 种标准许可：

| 模块符号 | 模块简称 | 法律约束力定义 |
| :---: | :--- | :--- |
| [BY] | **署名 (Attribution)** | 使用者必须向原作者明确署名，并提供原文链接与许可说明 |
| [NC] | **非商业性使用 (NonCommercial)** | 仅允许非商业目的传播与分享，禁止任何营利性使用 |
| [SA] | **相同方式共享 (ShareAlike)** | 若对原作品进行修改、演绎或衍生，衍生作品必须使用相同协议分发 |
| [ND] | **禁止演绎 (NoDerivatives)** | 仅允许原样复制分享，禁止修改、翻译、混剪或改编 |

### 技术写作最推荐的黄金组合：CC BY-NC-SA 4.0
允许全球技术读者免费阅读、学习、演绎与分享，同时从法律层面彻底阻断未经授权的黑产洗稿、商业打包售卖等侵权行为。

---

## 2. 软件代码许可协议 (Software Licenses) 选择简明指南

- **MIT License**：最宽松，商业公司与个人均可闭源集成，仅需保留原版权声明；
- **Apache 2.0**：宽松且友好，额外提供明确的专利保护条款；
- **GPL v3**：强传染性开源协议，任何引用或链接该代码的软件必须同步全量开源。
`,

  "writing/local-first-architecture": `# 本地优先 (Local-First) 离线文档与存储架构设计

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
`
};
