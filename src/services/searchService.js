/**
 * 全文搜索检索服务 (searchService.js)
 * 支持多关键字加权打分、上下文摘要提取与高亮展示
 */

import { ALL_DOCS } from "../data/navigation.js";
import { ARTICLES_CONTENT } from "../data/articlesContent.js";

/**
 * @typedef {Object} SearchResult
 * @property {object} doc
 * @property {number} score
 * @property {string} snippet
 * @property {string[]} tokens
 */

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * 在文本中高亮匹配的搜索关键词
 */
export function highlightKeywords(text, query) {
  if (!text || !query || !query.trim()) return text;
  const tokens = query.trim().split(/\s+/).filter(Boolean).map(escapeRegExp);
  if (tokens.length === 0) return text;

  try {
    const pattern = new RegExp(`(${tokens.join("|")})`, "gi");
    return text.replace(pattern, '<mark class="search-highlight">$1</mark>');
  } catch (e) {
    return text;
  }
}

/**
 * 执行全文关键字检索
 */
export function searchKnowledgeBase(query) {
  if (!query || !query.trim()) return [];

  const rawTokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (rawTokens.length === 0) return [];

  const results = [];

  ALL_DOCS.forEach((doc) => {
    const rawContent = (ARTICLES_CONTENT[doc.id] || "").toLowerCase();
    const titleLower = doc.title.toLowerCase();
    const descLower = (doc.description || "").toLowerCase();

    let score = 0;
    let bestMatchIndex = -1;

    rawTokens.forEach((token) => {
      // 标题完全匹配加权重
      if (titleLower.includes(token)) {
        score += 100;
        if (titleLower.startsWith(token)) score += 50;
      }

      // 描述匹配
      if (descLower.includes(token)) {
        score += 30;
      }

      // 正文匹配
      let idx = rawContent.indexOf(token);
      let count = 0;
      while (idx !== -1 && count < 10) {
        score += 5;
        if (bestMatchIndex === -1) bestMatchIndex = idx;
        idx = rawContent.indexOf(token, idx + token.length);
        count++;
      }
    });

    if (score > 0) {
      // 提取正文上下文摘要
      let snippet = "";
      const originalText = ARTICLES_CONTENT[doc.id] || "";
      if (bestMatchIndex !== -1) {
        const start = Math.max(0, bestMatchIndex - 35);
        const end = Math.min(originalText.length, bestMatchIndex + 85);
        snippet = (start > 0 ? "..." : "") +
          originalText.slice(start, end).replace(/\n/g, " ") +
          (end < originalText.length ? "..." : "");
      } else {
        snippet = doc.description || originalText.slice(0, 80);
      }

      results.push({
        doc,
        score,
        snippet,
        tokens: rawTokens,
      });
    }
  });

  return results.sort((a, b) => b.score - a.score).slice(0, 12);
}
