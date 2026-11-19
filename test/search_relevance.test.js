import test from "node:test";
import assert from "node:assert/strict";
import {
  stripMarkdown,
  extractAcronymsAndKeywords,
  highlightKeywords,
  searchKnowledgeBase,
} from "../src/services/searchService.js";

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

test("highlightKeywords safely marks keywords with length-descending precedence", () => {
  const text = "CommonMark 规范与 Markdown Extra 语法";
  const highlighted = highlightKeywords(text, "Markdown CommonMark");
  assert(highlighted.includes('<mark class="search-highlight">CommonMark</mark>'));
  assert(highlighted.includes('<mark class="search-highlight">Markdown</mark>'));

  // 特殊字符安全转义测试
  const textSpecial = "Vue 3.0 与 React 18 核心机制";
  const highlightedSpecial = highlightKeywords(textSpecial, "3.0");
  assert(highlightedSpecial.includes('<mark class="search-highlight">3.0</mark>'));
});

test("searchKnowledgeBase multi-level weighting and ranking accuracy", async () => {
  // 1. 空查询防护
  assert.deepEqual(searchKnowledgeBase(""), []);
  assert.deepEqual(searchKnowledgeBase("   "), []);

  // 2. 缩写检索高权直达 (HVV)
  const hvvResults = searchKnowledgeBase("hvv");
  assert(hvvResults.length > 0, "Searching 'hvv' should return matching results");
  assert.equal(hvvResults[0].doc.slug, "hvv-hyperlink-vector-voting", "HVV article must rank #1");
  assert(hvvResults[0].score >= 120, "HVV score must reflect acronym weighting");

  // 3. 别名与快捷 slug 检索 (syntax)
  const syntaxResults = searchKnowledgeBase("syntax");
  assert(syntaxResults.length > 0);
  assert.equal(syntaxResults[0].doc.slug, "syntax", "Slug 'syntax' must rank #1");

  // 4. 多词联合检索加权 (Markdown 表格)
  const multiResults = searchKnowledgeBase("Markdown 表格");
  assert(multiResults.length > 0);
  const gfmIndex = multiResults.findIndex((r) => r.doc.id.includes("gfm-extensions"));
  assert(gfmIndex !== -1, "GFM extensions (table spec) must appear in results");

  // 5. 摘要清理验证
  multiResults.forEach((r) => {
    assert(!r.snippet.includes("```"), "Snippet should not contain code fence markers");
    assert(!r.snippet.startsWith("> "), "Snippet should not contain raw blockquote prefix");
  });
});
