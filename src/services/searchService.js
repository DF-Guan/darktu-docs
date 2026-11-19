/**
 * 全文搜索检索服务 (searchService.js)
 * 借鉴 Fumadocs / Orama 客户端离线全文检索架构
 * 支持多关键字加权打分、首字母与别名容错、上下文摘要智能提取与安全高亮
 */

import { ALL_DOCS } from "../data/navigation.js";
import { ARTICLES_CONTENT } from "../data/articlesContent.js";

/**
 * 过滤 Markdown 语法标记，提取纯文本用于摘要与内容匹配
 * @param {string} md 原始 Markdown 文本
 * @returns {string} 纯文本
 */
export function stripMarkdown(md) {
  if (!md) return "";
  return md
    .replace(/^>\s*(\[!.*\])?/gm, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_~]/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\r?\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * 转义正则表达式特殊字符
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * 从标题或正文中提取英文缩写与括号别名
 * 例如 "生成式引擎优化 (Generative Engine Optimization / GEO)" => ["geo", "generative", "engine", "optimization"]
 * @param {string} text
 * @returns {string[]}
 */
export function extractAcronymsAndKeywords(text) {
  if (!text) return [];
  const results = [];

  // 1. 匹配括号内的英文缩写与别名
  const parenMatches = text.match(/\(([^)]+)\)/g);
  if (parenMatches) {
    parenMatches.forEach((m) => {
      const inner = m.slice(1, -1);
      inner.split(/[\/\s,]+/).forEach((part) => {
        const cleaned = part.trim().toLowerCase();
        if (cleaned.length >= 2) results.push(cleaned);
      });
    });
  }

  // 2. 匹配大写英文缩写与词汇 (如 AST, GFM, HVV, GEO, SVG, CLReq, WASM)
  const wordMatches = text.match(/\b[A-Za-z0-9_-]{2,}\b/g);
  if (wordMatches) {
    wordMatches.forEach((w) => {
      const lower = w.toLowerCase();
      if (!results.includes(lower)) results.push(lower);
    });
  }

  return results;
}

/**
 * 在文本中高亮匹配的搜索关键词（按关键词长度降序优先匹配，防止子串截断）
 * @param {string} text 待高亮文本
 * @param {string} query 用户搜索词
 * @returns {string} 注入 <mark class="search-highlight"> 的安全 HTML
 */
export function highlightKeywords(text, query) {
  if (!text || !query || !query.trim()) return text || "";

  const tokens = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  if (tokens.length === 0) return text;

  try {
    const escaped = tokens.map(escapeRegExp);
    const pattern = new RegExp(`(${escaped.join("|")})`, "gi");
    return text.replace(pattern, '<mark class="search-highlight">$1</mark>');
  } catch (err) {
    console.warn("Failed to highlight search keywords:", err);
    return text;
  }
}

/**
 * 执行全库关键字检索与多级加权排序
 * @param {string} query 搜索词
 * @param {Array} [docs] 知识库目录项 (默认 ALL_DOCS)
 * @param {Object} [articles] 文章内容映射表 (默认 ARTICLES_CONTENT)
 * @returns {Array} 排序后的搜索结果
 */
export function searchKnowledgeBase(query, docs = ALL_DOCS, articles = ARTICLES_CONTENT) {
  if (!query || !query.trim()) return [];

  const rawTokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (rawTokens.length === 0) return [];

  const fullQueryLower = query.trim().toLowerCase();
  const results = [];

  docs.forEach((doc) => {
    const rawMarkdown = articles[doc.id] || "";
    const plainContent = stripMarkdown(rawMarkdown);
    const plainContentLower = plainContent.toLowerCase();

    const titleLower = doc.title.toLowerCase();
    const descLower = (doc.description || "").toLowerCase();
    const slugLower = (doc.slug || "").toLowerCase();
    const idLower = (doc.id || "").toLowerCase();
    const catLower = (doc.categoryTitle || "").toLowerCase();

    const aliasList = (doc.aliasSlugs || []).map((a) => a.toLowerCase());
    const acronyms = extractAcronymsAndKeywords(doc.title);

    let score = 0;
    let bestMatchIndex = -1;
    let matchedTokenCount = 0;

    // 1. 全词完全匹配极高加权 (如直接检索完整标题或 slug)
    if (titleLower === fullQueryLower) {
      score += 300;
    } else if (slugLower === fullQueryLower || aliasList.includes(fullQueryLower)) {
      score += 250;
    }

    rawTokens.forEach((token) => {
      let tokenMatched = false;

      // 标题匹配
      if (titleLower.includes(token)) {
        tokenMatched = true;
        score += 100;
        if (titleLower.startsWith(token)) score += 50;
      }

      // 别名与缩写匹配 (如搜索 "hvv" 直达 "超链接向量投票 (HVV)")
      if (aliasList.includes(token) || acronyms.includes(token)) {
        tokenMatched = true;
        score += 120;
      }

      // Slug / ID 匹配
      if (slugLower.includes(token) || idLower.includes(token)) {
        tokenMatched = true;
        score += 80;
      }

      // 导航分类匹配
      if (catLower.includes(token)) {
        tokenMatched = true;
        score += 40;
      }

      // 描述匹配
      if (descLower.includes(token)) {
        tokenMatched = true;
        score += 35;
      }

      // 正文匹配
      let idx = plainContentLower.indexOf(token);
      let count = 0;
      while (idx !== -1 && count < 10) {
        tokenMatched = true;
        score += 6;
        if (bestMatchIndex === -1) bestMatchIndex = idx;
        idx = plainContentLower.indexOf(token, idx + token.length);
        count++;
      }

      if (tokenMatched) {
        matchedTokenCount++;
      }
    });

    // 2. 多词连带协同加权 (Conjunction / AND Bonus)
    // 若所有搜索词在同一篇文档中全部命中，赋予协同加权
    if (rawTokens.length > 1 && matchedTokenCount === rawTokens.length) {
      score += 150;
    }

    if (score > 0) {
      // 提取正文上下文摘要
      let snippet = "";
      if (bestMatchIndex !== -1) {
        const start = Math.max(0, bestMatchIndex - 35);
        const end = Math.min(plainContent.length, bestMatchIndex + 85);
        snippet =
          (start > 0 ? "..." : "") +
          plainContent.slice(start, end).trim() +
          (end < plainContent.length ? "..." : "");
      } else {
        snippet = doc.description || (plainContent.slice(0, 90).trim() + (plainContent.length > 90 ? "..." : ""));
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
