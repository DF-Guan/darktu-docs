/**
 * 知识库文章聚合器 (articlesContent.js)
 * 聚合全部 8 大专业分类条目
 */

import { MARKDOWN_SPECS_ARTICLES } from "./articles/markdownSpecs.js";
import { CLREQ_TYPOGRAPHY_ARTICLES } from "./articles/clreqTypography.js";
import { LATEX_FORMULAS_ARTICLES } from "./articles/latexFormulas.js";
import { CODE_AND_MERMAID_ARTICLES } from "./articles/codeAndMermaid.js";
import { CLIPBOARD_ENGINEERING_ARTICLES } from "./articles/clipboardEngineering.js";
import { ASSETS_STORAGE_ARTICLES } from "./articles/assetsStorage.js";
import { TECHNICAL_WRITING_ARTICLES } from "./articles/technicalWriting.js";
import { SEARCH_AND_GEO_ARTICLES } from "./articles/searchAndGeo.js";
import { APPENDIX_MAINTENANCE_ARTICLES } from "./articles/appendixMaintenance.js";

export const ARTICLES_CONTENT = {
  ...MARKDOWN_SPECS_ARTICLES,
  ...CLREQ_TYPOGRAPHY_ARTICLES,
  ...LATEX_FORMULAS_ARTICLES,
  ...CODE_AND_MERMAID_ARTICLES,
  ...CLIPBOARD_ENGINEERING_ARTICLES,
  ...ASSETS_STORAGE_ARTICLES,
  ...TECHNICAL_WRITING_ARTICLES,
  ...SEARCH_AND_GEO_ARTICLES,
  ...APPENDIX_MAINTENANCE_ARTICLES,
};

export function getArticleMarkdown(docId) {
  if (ARTICLES_CONTENT[docId]) {
    return ARTICLES_CONTENT[docId];
  }
  return MARKDOWN_SPECS_ARTICLES["markdown-specs/spec-evolution"];
}
