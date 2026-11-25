import test from "node:test";
import assert from "node:assert/strict";
import {
  stripMarkdown,
  escapeHtml,
  extractAcronymsAndKeywords,
  tokenizeQuery,
  extractSections,
  damerauLevenshtein,
  highlightKeywords,
  searchKnowledgeBase,
} from "../src/services/searchService.js";
import { renderSearchResultsMarkup } from "../src/services/searchUI.js";

test("stripMarkdown cleans Markdown syntax, code fences, and callout tags", () => {
  const md = `
# 标题一
> [!NOTE]
> 这是一个提示块

正文包含 **粗体**、*斜体* 以及 [链接文本](https://example.com)。
\`\`\`js
console.log("hello");
\`\`\`
行内代码 \`const a = 1\`;
`;
  const plain = stripMarkdown(md);
  assert(!plain.includes("# 标题一"));
  assert(!plain.includes("[!NOTE]"));
  assert(!plain.includes("```"));
  assert(plain.includes("粗体"));
  assert(plain.includes("链接文本"));
  assert(!plain.includes("https://example.com"));
  assert(plain.includes("const a = 1"));
});

test("extractAcronymsAndKeywords extracts acronyms and words inside parentheses", () => {
  const title1 = "超链接向量投票 (Hyperlink Vector Voting / HVV) 与权威度机制";
  const acronyms1 = extractAcronymsAndKeywords(title1);
  assert(acronyms1.includes("hvv"));
  assert(acronyms1.includes("hyperlink"));
  assert(acronyms1.includes("vector"));
  assert(acronyms1.includes("voting"));

  const title2 = "面向 AI 搜索的 GEO 架构指南";
  const acronyms2 = extractAcronymsAndKeywords(title2);
  assert(acronyms2.includes("geo"));
  assert(acronyms2.includes("ai"));
});

test("tokenizeQuery handles mixed CJK/Latin boundaries and CJK bigram slicing", () => {
  const mixed = tokenizeQuery("Markdown表格");
  assert.deepEqual(
    mixed.units.map((u) => u.term),
    ["markdown", "表格"]
  );

  const cjkPhrase = tokenizeQuery("中文排版规范");
  assert.equal(cjkPhrase.units.length, 1);
  assert.equal(cjkPhrase.units[0].term, "中文排版规范");
  assert(cjkPhrase.units[0].subBigrams.includes("中文"));
  assert(cjkPhrase.units[0].subBigrams.includes("排版"));
  assert(cjkPhrase.units[0].subBigrams.includes("规范"));

  const storage = tokenizeQuery("对象存储签名");
  assert(storage.synonyms.includes("s3"));
  assert(storage.synonyms.includes("r2"));
});

test("extractSections parses H2/H3 headings safely while ignoring comments in fenced code", () => {
  const md = `# 标题
## 1. 概述
正文段落，含 \`inlineSym\`。
\`\`\`bash
# fake heading inside bash comment
## not a heading
bmatrix
\`\`\`
### 1.1 \`<picture>\` 用法
细节说明
`;
  const { sections, codeLower } = extractSections(md);
  assert(!sections.some((s) => s.title.includes("not a heading")));
  assert(sections.some((s) => s.title === "1. 概述" && s.id === "1-概述"));
  assert(sections.some((s) => s.title === "1.1 <picture> 用法"));
  assert(codeLower.includes("bmatrix"));
  assert(codeLower.includes("inlinesym"));
});

test("highlightKeywords safely marks keywords with XSS HTML escaping", () => {
  const text = "CommonMark 规范与 Markdown Extra 语法";
  const highlighted = highlightKeywords(text, "Markdown CommonMark");
  assert(highlighted.includes('<mark class="search-highlight">CommonMark</mark>'));
  assert(highlighted.includes('<mark class="search-highlight">Markdown</mark>'));

  const textSpecial = "Vue 3.0 与 React 18 核心机制";
  const highlightedSpecial = highlightKeywords(textSpecial, "3.0");
  assert(highlightedSpecial.includes('<mark class="search-highlight">3.0</mark>'));

  const xssText = '评测 <picture> 与 <script>alert("xss")</script> 净化';
  const safeHighlighted = highlightKeywords(xssText, "<picture> script");
  assert(!safeHighlighted.includes("<script>"));
  assert(safeHighlighted.includes("&lt;picture&gt;"));
  assert(safeHighlighted.includes('<mark class="search-highlight">&lt;picture&gt;</mark>'));
  assert.equal(escapeHtml("<b>"), "&lt;b&gt;");
});

test("searchKnowledgeBase multi-level BM25/IDF ranking, section anchors, and noise filtering", () => {
  assert.deepEqual(searchKnowledgeBase(""), []);
  assert.deepEqual(searchKnowledgeBase("   "), []);

  // 1. 缩写检索高权直达 (HVV) 并携带精确章节锚点
  const hvvResults = searchKnowledgeBase("hvv");
  assert(hvvResults.length > 0);
  assert.equal(hvvResults[0].doc.slug, "hvv-hyperlink-vector-voting");
  assert(hvvResults[0].score >= 120);

  // 2. 别名直达 (syntax)
  const syntaxResults = searchKnowledgeBase("syntax");
  assert(syntaxResults.length > 0);
  assert.equal(syntaxResults[0].doc.slug, "syntax");

  // 3. 中英混排无空格查询 + BM25 IDF 对低频精准词"表格"加权
  const mixedTable = searchKnowledgeBase("Markdown表格");
  assert(mixedTable.length >= 2);
  const top3Slugs = mixedTable.slice(0, 3).map((r) => r.doc.slug);
  assert(top3Slugs.includes("gfm-extensions"), `Expected gfm-extensions in top 3, got ${top3Slugs}`);
  assert(mixedTable[0].anchor.length > 0, "Section match must expose non-empty anchor");

  // 4. 中文无空格长词精确召回
  const cnTypo = searchKnowledgeBase("中文排版规范");
  assert(cnTypo.length > 0);
  assert.equal(cnTypo[0].doc.slug, "w3c-clreq", "W3C CLReq must rank #1 for 中文排版规范");

  const mathAlign = searchKnowledgeBase("公式对齐");
  assert(mathAlign.length > 0);
  assert.equal(mathAlign[0].doc.slug, "matrices-and-cases");

  const objStorage = searchKnowledgeBase("对象存储签名");
  assert(objStorage.length > 0);
  assert.equal(objStorage[0].doc.slug, "image-hosting-arch");

  // 5. 代码符号直达 (bmatrix) 与精细章节定位
  const bmatrixRes = searchKnowledgeBase("bmatrix");
  assert(bmatrixRes.length > 0);
  assert.equal(bmatrixRes[0].doc.slug, "matrices-and-cases");
  assert(bmatrixRes[0].anchor.includes("matrix"), `Expected matrix section anchor, got ${bmatrixRes[0].anchor}`);

  // 6. 精确噪点过滤 (indexnow rfc, mXSS)
  const mxssRes = searchKnowledgeBase("mXSS");
  assert.equal(mxssRes[0].doc.slug, "html-sanitizer-ast");
  assert(mxssRes[0].anchor.includes("mxss"));

  const indexnowRes = searchKnowledgeBase("indexnow rfc");
  assert.equal(indexnowRes[0].doc.slug, "global-search-indexing-and-indexnow");
  assert(!indexnowRes.some((r) => r.doc.slug === "mermaid-gantt-c4"), "Unrelated single-word noise must be pruned");

  // 7. 摘要纯净验证
  const multiResults = searchKnowledgeBase("Markdown 表格");
  assert(multiResults.some((r) => r.doc.id.includes("gfm-extensions")));
  multiResults.forEach((r) => {
    assert(!r.snippet.includes("```"));
    assert(!r.snippet.startsWith("> "));
  });
});

test("damerauLevenshtein and searchKnowledgeBase typo tolerance recover misspelled queries", () => {
  assert.equal(damerauLevenshtein("katx", "katex"), 1);
  assert.equal(damerauLevenshtein("makrdown", "markdown"), 1);

  const fuzzyKatx = searchKnowledgeBase("katx");
  assert(fuzzyKatx.length > 0, "Typo 'katx' should recover katex results");
  assert.equal(fuzzyKatx[0].doc.slug, "katex-vs-mathjax");
  assert.equal(fuzzyKatx[0].matchType, "fuzzy");
});

test("renderSearchResultsMarkup generates deep anchor URLs, section badges, and safe escaped HTML", () => {
  const results = searchKnowledgeBase("<picture>");
  assert(results.length > 0);
  const markup = renderSearchResultsMarkup("<picture>", results);
  assert(markup.includes(`href="#/${results[0].doc.slug}#${results[0].anchor}"`));
  assert(markup.includes("search-result-section"));
  assert(markup.includes("&lt;picture&gt;"));
  assert(markup.includes("search-results-summary"));
});
