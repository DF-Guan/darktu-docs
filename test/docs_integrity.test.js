/**
 * 自动化知识库内容完整性与渲染回归测试 (docs_integrity.test.js)
 */

import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTests() {
  console.log("🧪 Running Darktu Docs Integrity Verification...");

  const { DOCS_NAVIGATION, ALL_DOCS, getDocBySlugOrId } = await import("../src/data/navigation.js");
  const { getArticleMarkdown } = await import("../src/data/articlesContent.js");
  const { renderMarkdown } = await import("../src/services/markdownRenderer.js");
  const { searchKnowledgeBase } = await import("../src/services/searchService.js");

  // 1. 验证分类与章节定义完备性
  assert(Array.isArray(DOCS_NAVIGATION) && DOCS_NAVIGATION.length >= 7, "Must have at least 7 categories");
  assert(ALL_DOCS.length >= 20, `Must have at least 20 chapters, got: ${ALL_DOCS.length}`);

  // 2. 验证每一篇文章的内容真实存在且不低于 200 字符
  ALL_DOCS.forEach((doc) => {
    const content = getArticleMarkdown(doc.id);
    assert(content && content.length > 200, `Article ${doc.id} must have substantial content, got ${content?.length}`);
    assert(!content.includes("TODO") && !content.includes("待补充"), `Article ${doc.id} must not contain placeholders`);

    // 验证渲染
    const { html } = renderMarkdown(content);
    assert(html && html.includes("<h1"), `Article ${doc.id} must render an H1 heading`);

    // 验证谦逊求真语气与学习导向：严禁商业吹捧套话
    const forbiddenBuzzwords = ["行业通用标准", "行业权威", "大厂权威", "业界第一"];
    forbiddenBuzzwords.forEach((kw) => {
      assert(!content.includes(kw), `Article ${doc.id} must not contain boastful buzzword: "${kw}"`);
    });
  });

  // 3. 验证维基式条目内链 (Wikilinks) 100% 连通无死链
  const allSlugs = new Set();
  ALL_DOCS.forEach((d) => {
    allSlugs.add(d.slug);
    if (d.aliasSlugs) d.aliasSlugs.forEach((a) => allSlugs.add(a));
  });

  ALL_DOCS.forEach((d) => {
    const md = getArticleMarkdown(d.id);
    const regex = /\(#\/([a-zA-Z0-9_-]+)\)/g;
    let match;
    while ((match = regex.exec(md)) !== null) {
      const targetSlug = match[1];
      assert(
        allSlugs.has(targetSlug),
        `Broken internal wikilink in [${d.id}]: #/${targetSlug} does not exist in navigation!`
      );
    }
  });

  // 4. 验证快捷别名 slug (特别是 we-markdown 跳转的 #/syntax)
  const syntaxDoc = getDocBySlugOrId("#/syntax");
  assert(syntaxDoc && syntaxDoc.doc && syntaxDoc.doc.slug === "syntax", "Slug #/syntax must resolve to basic syntax doc");

  // 5. 验证搜索功能
  const searchResults = searchKnowledgeBase("微信");
  assert(searchResults.length > 0, "Search for '微信' must return matching articles");
  const aiResults = searchKnowledgeBase("副驾驶");
  assert(aiResults.length > 0, "Search for '副驾驶' must return matching articles");

  // 6. 验证静态资源（Logo 等）物理存在
  const logoPath = path.resolve(__dirname, "../public/logo-128.png");
  assert(fs.existsSync(logoPath), "logo-128.png must physically exist in public/");

  // 7. 验证全部高清技术矢量插图物理存在
  const diagrams = [
    "clreq-embox-grid.svg",
    "punctuation-line-breaking.svg",
    "markdown-ast-pipeline.svg",
    "clipboard-mime-architecture.svg",
    "s3-presigned-upload-flow.svg",
    "font-subset-unicode-range.svg",
    "wcag-contrast-colorblind.svg",
  ];
  diagrams.forEach((d) => {
    const p = path.resolve(__dirname, `../public/assets/diagrams/${d}`);
    assert(fs.existsSync(p), `Diagram ${d} must physically exist in public/assets/diagrams/`);
  });

  console.log(`✅ All ${ALL_DOCS.length} Knowledge Base Articles, Wikilinks, Diagrams, and Functions 100% Verified!`);
  process.exit(0);
}

runTests().catch((err) => {
  console.error("❌ Docs Integrity Test Failed:", err);
  process.exit(1);
});
