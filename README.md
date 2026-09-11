# Darktu 知识库 (Darktu Docs)

> 面向创作者与开发者的开放排版与文档工程学习百科  
> 线上地址：[https://darktu-docs.pages.dev](https://darktu-docs.pages.dev)（或 [https://docs.darktu.com](https://docs.darktu.com)）

---

## 📖 知识库概览

Darktu 知识库是一套专注于 Markdown 语法规范、中文排版美学、LaTeX 数学公式与现代富文本渲染机制的**学习型百科**。全库借鉴维基百科（Wikipedia）的开放知识架构，旨在为个人学习和社区技术交流提供严谨、无虚饰、无营销浮夸的技术指南。

### 八大知识篇章
1. **语法与规范**：CommonMark 0.31.2 规范演进、GFM 扩展规范手册、高级排版特性（Footnotes）与 Callouts 提示块。
2. **中文排版学**：W3C 中文排版需求 (CLReq)、盘古之白中西文混排、GB/T 15834 标点避头尾法则与模块化字阶。
3. **数学公式与符号**：LaTeX 基础语法、KaTeX 与 MathJax 引擎基准对比、复杂矩阵分段函数与希腊字母速查表。
4. **代码高亮与图表**：Prism vs Shiki 解析机制、Mermaid 流程图、时序图、ER 模型与 Git 拓扑图。
5. **富文本与剪贴板**：剪贴板 MIME 数据包机制、CSS Inliner 特异性合并、微信排版沙箱白名单与 SVG/Canvas 长图渲染。
6. **媒体资源与存储**：S3 / R2 / OSS 客户端预签名直传架构、WebP/AVIF 现代图片格式与 EXIF GPS 隐私擦除。
7. **写作实践与合规**：现代技术写作风格指南、DFA 有限状态机敏感词过滤算法、CC BY-NC-SA 4.0 许可协议与 Local-First 架构。
8. **术语索引与维护**：常见术语索引表 (Glossary) 与维基百科式条目维护指引。

---

## 🛠️ 本地开发与测试

### 环境依赖
- Node.js >= 18.0.0

### 安装与启动
```bash
# 安装依赖
npm install

# 启动本地开发服务器
npm run dev

# 执行全量自动化完整性与架构回归测试
npm test

# 生产环境编译打包
npm run build
```

---

## 🤝 参与贡献与勘误

知识库欢迎任何形式的技术勘误、错别字修正与条目补充：
1. **提交勘误**：在 [Issues 页面](https://github.com/DF-Guan/darktu-docs/issues) 提交反馈；
2. **编辑条目**：直接在每篇文章底部的“在 GitHub 编辑此条目”按钮发起 Pull Request；
3. **内容规范**：修改或新增内容请遵循 [知识库维护指引](https://darktu-docs.pages.dev/#/maintenance-guide)。

---

## 📄 知识许可

知识库正文内容遵循 [知识共享 署名-非商业性使用-相同方式共享 4.0 国际许可协议 (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans)。
代码部分采用 [MIT License](LICENSE)。