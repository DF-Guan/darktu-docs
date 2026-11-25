/**
 * 全文搜索与精确检索服务 (searchService.js)
 * 对标 Fumadocs / Orama / Algolia DocSearch 客户端分级索引架构
 * 支持 CJK/拉丁混排自动切词、H2/H3 章节深层锚点定位、BM25 饱和加权、短语邻近度、
 * 领域同义词桥接、Damerau-Levenshtein 拼写纠错容错及 XSS 安全高亮
 */

import { ALL_DOCS } from "../data/navigation.js";
import { ARTICLES_CONTENT } from "../data/articlesContent.js";
import { slugify } from "./markdownRenderer.js";

const CONCEPT_SYNONYMS = new Map([
  ["公式", ["latex", "katex", "mathjax"]],
  ["流程图", ["mermaid"]],
  ["时序图", ["mermaid"]],
  ["甘特图", ["mermaid"]],
  ["思维导图", ["mermaid"]],
  ["类图", ["mermaid"]],
  ["图床", ["s3", "r2", "oss", "对象存储"]],
  ["对象存储", ["s3", "r2", "oss", "图床"]],
  ["盘古之白", ["中西文混排", "pangu"]],
  ["避头尾", ["禁则", "标点"]],
  ["广告法", ["dfa", "合规"]],
  ["违禁词", ["dfa", "合规"]],
  ["防幻觉", ["rag", "geo", "引用", "hvv"]],
  ["溯源", ["c2pa", "jumbf"]],
  ["防盗链", ["referer", "cdn"]],
  ["xss", ["dompurify", "mxss", "清洗"]],
  ["收录", ["indexnow", "sitemap", "robots"]],
  ["大纲", ["toc", "目录"]],
]);

let cachedDefaultSource = { docs: null, articles: null, index: null };

/**
 * 转义 HTML 特殊字符，防止检索渲染或标签展示产生 XSS 或标签吞没
 */
export function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * 过滤 Markdown 语法标记，提取纯文本用于摘要与正文匹配
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

  const parenMatches = text.match(/\(([^)]+)\)/g);
  if (parenMatches) {
    parenMatches.forEach((m) => {
      const inner = m.slice(1, -1);
      inner.split(/[\/\s,]+/).forEach((part) => {
        const cleaned = part.trim().toLowerCase();
        if (cleaned.length >= 2 && !results.includes(cleaned)) {
          results.push(cleaned);
        }
      });
    });
  }

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
 * 生成 CJK 连续二元组切片，解决中文无空格复合词召回难题
 */
function buildCjkBigrams(cjkStr) {
  if (!cjkStr || cjkStr.length < 3) return [];
  const bigrams = [];
  for (let i = 0; i < cjkStr.length - 1; i++) {
    const bg = cjkStr.slice(i, i + 2);
    if (!bigrams.includes(bg)) bigrams.push(bg);
  }
  return bigrams;
}

/**
 * 中英混合边界智能分词器：
 * 将 "Markdown表格" 自动切分为 ["markdown", "表格"]；
 * 将 "中文排版规范" 保留整词并生成二元组子特征 ["中文", "文排", "排版", "版规", "规范"]；
 * 并收集匹配到的领域同义词集合。
 * @param {string} query
 */
export function tokenizeQuery(query) {
  if (!query || !query.trim()) {
    return { fullQuery: "", units: [], highlightTerms: [], synonyms: [] };
  }

  const fullQuery = query.trim().toLowerCase();
  const clauses = fullQuery
    .split(/[\s,，。；;：:、|/()（）【】\[\]<>《》"'“”‘’!?！？]+/)
    .filter(Boolean);

  const units = [];
  const seenTerms = new Set();
  const highlightSet = new Set();

  for (const clause of clauses) {
    highlightSet.add(clause);
    const segmentRegex = /([a-z0-9_+#.-]+)|([\u4e00-\u9fa5]+)/g;
    let match;
    while ((match = segmentRegex.exec(clause)) !== null) {
      if (match[1]) {
        const ascii = match[1].replace(/^[._-]+|[._-]+$/g, "");
        if (!ascii) continue;
        highlightSet.add(ascii);
        if (!seenTerms.has(ascii)) {
          seenTerms.add(ascii);
          units.push({ term: ascii, type: "ascii", subBigrams: [] });
        }
      } else if (match[2]) {
        const cjk = match[2];
        const subBigrams = buildCjkBigrams(cjk);
        highlightSet.add(cjk);
        subBigrams.forEach((bg) => highlightSet.add(bg));
        if (!seenTerms.has(cjk)) {
          seenTerms.add(cjk);
          units.push({ term: cjk, type: "cjk", subBigrams });
        }
      }
    }
  }

  // 收集语义桥接同义词
  const synonyms = new Set();
  for (const [concept, targets] of CONCEPT_SYNONYMS.entries()) {
    if (fullQuery.includes(concept) || units.some((u) => u.term === concept)) {
      targets.forEach((t) => {
        if (!seenTerms.has(t)) synonyms.add(t);
      });
    }
  }

  // 补充原始空格分隔片（保留如 "3.0" 等特例字符不被标点拆分）
  fullQuery.split(/\s+/).filter(Boolean).forEach((raw) => highlightSet.add(raw));

  const highlightTerms = [...highlightSet]
    .filter((t) => t.length >= 2 || /[\u4e00-\u9fa5]/.test(t) || t === fullQuery)
    .sort((a, b) => b.length - a.length);

  return {
    fullQuery,
    units,
    highlightTerms,
    synonyms: [...synonyms],
  };
}

/**
 * 计算 Damerau-Levenshtein 编辑距离（支持相邻字符换位检测，如 makrdown -> markdown）
 */
export function damerauLevenshtein(a, b) {
  const lenA = a.length;
  const lenB = b.length;
  if (lenA === 0) return lenB;
  if (lenB === 0) return lenA;

  const dp = Array.from({ length: lenA + 1 }, () => new Array(lenB + 1).fill(0));
  for (let i = 0; i <= lenA; i++) dp[i][0] = i;
  for (let j = 0; j <= lenB; j++) dp[0][j] = j;

  for (let i = 1; i <= lenA; i++) {
    for (let j = 1; j <= lenB; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + cost);
      }
    }
  }
  return dp[lenA][lenB];
}

function findFuzzyMatches(term, vocabulary) {
  if (!term || term.length < 4 || !vocabulary || vocabulary.size === 0) return [];
  const maxDist = term.length >= 7 ? 2 : 1;
  const matches = [];

  for (const candidate of vocabulary) {
    if (Math.abs(candidate.length - term.length) > maxDist) continue;
    if (candidate === term) continue;
    const dist = damerauLevenshtein(term, candidate);
    if (dist <= maxDist) {
      matches.push({ term: candidate, dist });
    }
  }

  matches.sort((a, b) => a.dist - b.dist || a.term.length - b.term.length);
  return matches.slice(0, 2);
}

/**
 * 提取文章内的 H2/H3 章节结构与代码块符号词元，用于章节级直达锚点定位 (#/slug#anchor)
 */
export function extractSections(rawMarkdown) {
  if (!rawMarkdown) return { sections: [], codeLower: "" };

  const lines = rawMarkdown.split("\n");
  const sections = [];
  const globalCodeChunks = [];

  let current = {
    level: 1,
    id: "",
    title: "",
    titleLower: "",
    bodyLines: [],
    codeChunks: [],
  };
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      current.codeChunks.push(line);
      globalCodeChunks.push(line);
      continue;
    }

    const headingMatch = line.match(/^(#{2,3})\s+(.*)$/);
    if (headingMatch) {
      if (current.bodyLines.length > 0 || current.id) {
        sections.push(finalizeSection(current));
      }
      const level = headingMatch[1].length;
      const rawTitle = headingMatch[2].trim();
      const inlinePlaceholders = [];
      const preservedTitle = rawTitle.replace(/`([^`]+)`/g, (_, code) => {
        inlinePlaceholders.push(code);
        return `__CODE_SLOT_${inlinePlaceholders.length - 1}__`;
      });
      const cleanTitle = preservedTitle
        .replace(/<[^>]+>/g, "")
        .replace(/__CODE_SLOT_(\d+)__/g, (_, i) => inlinePlaceholders[Number(i)] || "");
      current = {
        level,
        id: slugify(rawTitle),
        title: cleanTitle,
        titleLower: cleanTitle.toLowerCase(),
        bodyLines: [],
        codeChunks: [],
      };
      continue;
    }

    // 收集行内代码符号
    const inlineCodes = line.match(/`([^`]+)`/g);
    if (inlineCodes) {
      inlineCodes.forEach((c) => {
        const inner = c.slice(1, -1);
        current.codeChunks.push(inner);
        globalCodeChunks.push(inner);
      });
    }
    current.bodyLines.push(line);
  }

  if (current.bodyLines.length > 0 || current.id) {
    sections.push(finalizeSection(current));
  }

  return {
    sections,
    codeLower: globalCodeChunks.join(" ").toLowerCase(),
  };
}

function finalizeSection(sec) {
  const plainBody = stripMarkdown(sec.bodyLines.join("\n"));
  return {
    level: sec.level,
    id: sec.id,
    title: sec.title,
    titleLower: sec.titleLower,
    plainBody,
    plainBodyLower: plainBody.toLowerCase(),
    codeLower: sec.codeChunks.join(" ").toLowerCase(),
  };
}

/**
 * 构建全库结构化检索索引（按默认数据引用自动缓存，测试传入自定义数据集时即时重建）
 */
export function buildSearchIndex(docs = ALL_DOCS, articles = ARTICLES_CONTENT) {
  if (docs === cachedDefaultSource.docs && articles === cachedDefaultSource.articles && cachedDefaultSource.index) {
    return cachedDefaultSource.index;
  }

  const vocabulary = new Set();
  let totalLen = 0;

  const entries = docs.map((doc) => {
    const rawMarkdown = articles[doc.id] || "";
    const plainContent = stripMarkdown(rawMarkdown);
    const plainContentLower = plainContent.toLowerCase();
    const { sections, codeLower } = extractSections(rawMarkdown);

    const titleLower = (doc.title || "").toLowerCase();
    const descLower = (doc.description || "").toLowerCase();
    const slugLower = (doc.slug || "").toLowerCase();
    const idLower = (doc.id || "").toLowerCase();
    const catLower = (doc.categoryTitle || "").toLowerCase();
    const aliasList = (doc.aliasSlugs || []).map((a) => a.toLowerCase());
    const acronyms = extractAcronymsAndKeywords(`${doc.title} ${doc.description || ""}`);

    const vocabSources = [
      titleLower,
      slugLower,
      descLower,
      ...aliasList,
      ...acronyms,
      ...sections.map((s) => s.titleLower),
    ];
    vocabSources.forEach((src) => {
      const words = src.match(/[a-z0-9]{4,}/g);
      if (words) words.forEach((w) => vocabulary.add(w));
    });

    const plainLen = Math.max(1, plainContentLower.length);
    totalLen += plainLen;

    return {
      doc,
      titleLower,
      descLower,
      slugLower,
      idLower,
      catLower,
      aliasList,
      acronyms,
      plainContent,
      plainContentLower,
      plainLen,
      sections,
      codeLower,
    };
  });

  const avgDocLen = entries.length > 0 ? totalLen / entries.length : 1000;
  const index = { entries, avgDocLen, vocabulary };

  if (docs === ALL_DOCS && articles === ARTICLES_CONTENT) {
    cachedDefaultSource = { docs, articles, index };
  }
  return index;
}

function countOccurrences(haystack, needle, cap = 12) {
  if (!haystack || !needle) return { count: 0, firstIndex: -1 };
  let idx = haystack.indexOf(needle);
  if (idx === -1) return { count: 0, firstIndex: -1 };
  const firstIndex = idx;
  let count = 0;
  while (idx !== -1 && count < cap) {
    count++;
    idx = haystack.indexOf(needle, idx + needle.length);
  }
  return { count, firstIndex };
}

function bm25Saturation(tf, docLen, avgDocLen) {
  if (tf <= 0) return 0;
  const k1 = 1.4;
  const b = 0.55;
  const norm = 1 - b + b * (docLen / Math.max(1, avgDocLen));
  return (tf * (k1 + 1)) / (tf + k1 * norm);
}

/**
 * 提取包含最多查询词密度的最佳正文片段（Best-Match Context Window）
 */
function extractBestSnippet(plainText, terms, fallbackDesc) {
  if (!plainText) return fallbackDesc || "";
  const lower = plainText.toLowerCase();
  const offsets = [];

  for (const term of terms) {
    if (!term || term.length < 2) continue;
    let idx = lower.indexOf(term);
    let hits = 0;
    while (idx !== -1 && hits < 5) {
      offsets.push({ idx, term });
      hits++;
      idx = lower.indexOf(term, idx + term.length);
    }
  }

  if (offsets.length === 0) {
    if (fallbackDesc) return fallbackDesc;
    return plainText.slice(0, 100).trim() + (plainText.length > 100 ? "..." : "");
  }

  offsets.sort((a, b) => a.idx - b.idx);
  let bestCenter = offsets[0].idx;
  let bestScore = -1;

  for (const anchor of offsets) {
    const winStart = Math.max(0, anchor.idx - 32);
    const winEnd = winStart + 124;
    const distinctTerms = new Set();
    let totalInWin = 0;
    for (const o of offsets) {
      if (o.idx >= winStart && o.idx <= winEnd) {
        distinctTerms.add(o.term);
        totalInWin++;
      }
    }
    const winScore = distinctTerms.size * 10 + totalInWin;
    if (winScore > bestScore) {
      bestScore = winScore;
      bestCenter = anchor.idx;
    }
  }

  const start = Math.max(0, bestCenter - 32);
  const end = Math.min(plainText.length, bestCenter + 92);
  return (
    (start > 0 ? "..." : "") +
    plainText.slice(start, end).trim() +
    (end < plainText.length ? "..." : "")
  );
}

/**
 * 在文本中高亮匹配的搜索关键词（先逐段进行 XSS HTML 实体转义再包裹 <mark>，杜绝标签注入或转义串破坏）
 * @param {string} text 待高亮文本
 * @param {string} query 用户搜索词
 * @returns {string} 注入 <mark class="search-highlight"> 的安全 HTML
 */
export function highlightKeywords(text, query) {
  if (!text) return "";
  if (!query || !query.trim()) return escapeHtml(text);

  const { highlightTerms } = tokenizeQuery(query);
  if (highlightTerms.length === 0) return escapeHtml(text);

  try {
    const escaped = highlightTerms.map(escapeRegExp);
    const pattern = new RegExp(`(${escaped.join("|")})`, "gi");
    let out = "";
    let lastIndex = 0;
    let match;

    while ((match = pattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        out += escapeHtml(text.slice(lastIndex, match.index));
      }
      out += `<mark class="search-highlight">${escapeHtml(match[0])}</mark>`;
      lastIndex = pattern.lastIndex;
      if (match[0].length === 0) break;
    }
    if (lastIndex < text.length) {
      out += escapeHtml(text.slice(lastIndex));
    }
    return out;
  } catch (err) {
    console.warn("Failed to highlight search keywords:", err);
    return escapeHtml(text);
  }
}

function computeIdfWeight(entries, term) {
  const n = entries.length;
  if (n <= 1 || !term) return 1.0;
  let df = 0;
  for (const e of entries) {
    if (
      e.titleLower.includes(term) ||
      e.descLower.includes(term) ||
      e.slugLower.includes(term) ||
      e.plainContentLower.includes(term) ||
      e.codeLower.includes(term)
    ) {
      df++;
    }
  }
  const idf = Math.log(1 + (n - df + 0.5) / (df + 0.5));
  return Math.max(0.55, Math.min(2.2, idf / 1.4));
}

function scoreSingleTermOnEntry(entry, term, avgDocLen, weightFactor = 1.0, secScores = null) {
  let score = 0;
  let matched = false;
  let bodyHitIdx = -1;

  if (entry.titleLower.includes(term)) {
    matched = true;
    score += 110 * weightFactor;
    if (entry.titleLower.startsWith(term)) score += 50 * weightFactor;
  }

  if (entry.aliasList.includes(term) || entry.acronyms.includes(term)) {
    matched = true;
    score += 125 * weightFactor;
  }

  if (entry.slugLower.includes(term) || entry.idLower.includes(term)) {
    matched = true;
    score += 85 * weightFactor;
  }

  if (entry.catLower.includes(term)) {
    matched = true;
    score += 32 * weightFactor;
  }

  if (entry.descLower.includes(term)) {
    matched = true;
    score += 48 * weightFactor;
  }

  // 章节标题与章节正文精细评分
  for (let sIdx = 0; sIdx < entry.sections.length; sIdx++) {
    const sec = entry.sections[sIdx];
    let sScore = 0;
    if (sec.id && sec.titleLower.includes(term)) {
      matched = true;
      const headingPts = (sec.level === 2 ? 82 : 68) * weightFactor;
      score += headingPts;
      sScore += headingPts;
    }
    const secBodyHit = countOccurrences(sec.plainBodyLower, term, 6);
    if (secBodyHit.count > 0) {
      matched = true;
      const secPts = 7 * bm25Saturation(secBodyHit.count, entry.plainLen, avgDocLen) * weightFactor;
      sScore += secPts;
    }
    if (sec.codeLower && sec.codeLower.includes(term)) {
      matched = true;
      const codePts = 26 * weightFactor;
      score += codePts;
      sScore += codePts;
    }
    if (secScores && sScore > 0) {
      secScores[sIdx] = (secScores[sIdx] || 0) + sScore;
    }
  }

  // 全文 BM25 饱和正文评分
  const bodyHit = countOccurrences(entry.plainContentLower, term, 12);
  if (bodyHit.count > 0) {
    matched = true;
    bodyHitIdx = bodyHit.firstIndex;
    score += 10 * bm25Saturation(bodyHit.count, entry.plainLen, avgDocLen) * weightFactor;
  }

  return { score, matched, bodyHitIdx };
}

function hasProximityCluster(textLower, terms, maxSpan = 44) {
  if (!textLower || terms.length < 2) return false;
  const firstTerm = terms[0];
  let pos = textLower.indexOf(firstTerm);
  let checks = 0;
  while (pos !== -1 && checks < 8) {
    const winStart = Math.max(0, pos - maxSpan);
    const winEnd = Math.min(textLower.length, pos + firstTerm.length + maxSpan);
    const slice = textLower.slice(winStart, winEnd);
    if (terms.every((t) => slice.includes(t))) {
      return true;
    }
    pos = textLower.indexOf(firstTerm, pos + firstTerm.length);
    checks++;
  }
  return false;
}

/**
 * 执行全库关键字精准检索、章节级定位与多维加权排序
 * @param {string} query 搜索词
 * @param {Array} [docs] 知识库目录项 (默认 ALL_DOCS)
 * @param {Object} [articles] 文章内容映射表 (默认 ARTICLES_CONTENT)
 * @param {Object} [options] 检索配置 ({ limit })
 * @returns {Array} 排序后的精确搜索结果
 */
export function searchKnowledgeBase(query, docs = ALL_DOCS, articles = ARTICLES_CONTENT, options = {}) {
  if (!query || !query.trim()) return [];

  const { fullQuery, units, synonyms } = tokenizeQuery(query);
  if (units.length === 0) return [];

  const limit = options.limit || 12;
  const index = buildSearchIndex(docs, articles);
  const unitGlobalHits = new Array(units.length).fill(0);
  const unitIdfWeights = units.map((u) => computeIdfWeight(index.entries, u.term));
  const bigramIdfCache = new Map();
  const getBigramIdf = (bg) => {
    if (!bigramIdfCache.has(bg)) {
      bigramIdfCache.set(bg, computeIdfWeight(index.entries, bg));
    }
    return bigramIdfCache.get(bg);
  };
  const scoredDrafts = [];

  for (const entry of index.entries) {
    const secScores = new Array(entry.sections.length).fill(0);
    let score = 0;
    let matchedPrimaryCount = 0;
    const matchedHighlightTerms = new Set();

    // 1. 完整查询精确匹配加权
    if (entry.titleLower === fullQuery) {
      score += 360;
    } else if (entry.slugLower === fullQuery || entry.aliasList.includes(fullQuery)) {
      score += 290;
    } else if (entry.titleLower.includes(fullQuery)) {
      score += 130;
    }
    if (entry.descLower.includes(fullQuery)) {
      score += 95;
    }

    // 章节标题精确包含整句查询
    entry.sections.forEach((sec, sIdx) => {
      if (sec.id && sec.titleLower.includes(fullQuery)) {
        const exactSecPts = sec.titleLower === fullQuery ? 180 : 90;
        score += exactSecPts;
        secScores[sIdx] += exactSecPts;
      }
    });

    // 2. 逐词元 IDF 加权评分 + CJK 二元组与最长连续子串重合评估
    units.forEach((unit, uIdx) => {
      const idfFactor = unitIdfWeights[uIdx];
      const exactRes = scoreSingleTermOnEntry(entry, unit.term, index.avgDocLen, idfFactor, secScores);
      if (exactRes.matched) {
        score += exactRes.score;
        matchedPrimaryCount += 1;
        unitGlobalHits[uIdx]++;
        matchedHighlightTerms.add(unit.term);
        return;
      }

      // 针对 CJK 复合词进行二元组切片召回评估
      if (unit.type === "cjk" && unit.subBigrams.length >= 2) {
        let hitBigrams = 0;
        let bigramScoreSum = 0;
        for (const bg of unit.subBigrams) {
          const bgIdf = getBigramIdf(bg);
          const bgRes = scoreSingleTermOnEntry(entry, bg, index.avgDocLen, 0.34 * bgIdf, secScores);
          if (bgRes.matched) {
            hitBigrams++;
            bigramScoreSum += bgRes.score;
            matchedHighlightTerms.add(bg);
          }
        }
        // 长汉字连续子串 (3/4-gram) 在标题命中时的精确度加权 (如 "中文排版规范" 命中 "中文排版")
        if (unit.term.length >= 4) {
          let longestTitleOverlap = 0;
          for (let subLen = Math.min(unit.term.length - 1, 6); subLen >= 3; subLen--) {
            for (let start = 0; start <= unit.term.length - subLen; start++) {
              const sub = unit.term.slice(start, start + subLen);
              if (entry.titleLower.includes(sub)) {
                longestTitleOverlap = Math.max(longestTitleOverlap, subLen);
              }
            }
            if (longestTitleOverlap > 0) break;
          }
          if (longestTitleOverlap >= 3) {
            bigramScoreSum += longestTitleOverlap * 22;
          }
        }

        const coverage = hitBigrams / unit.subBigrams.length;
        const minRequired = 2;
        if (hitBigrams >= minRequired) {
          score += bigramScoreSum;
          matchedPrimaryCount += Math.min(1, coverage * 1.15);
          unitGlobalHits[uIdx]++;
        }
      }
    });

    // 3. 语义同义词桥接温和加权
    for (const syn of synonyms) {
      const synRes = scoreSingleTermOnEntry(entry, syn, index.avgDocLen, 0.28, secScores);
      if (synRes.matched) {
        score += Math.min(48, synRes.score);
        matchedHighlightTerms.add(syn);
      }
    }

    scoredDrafts.push({
      entry,
      secScores,
      score,
      matchedPrimaryCount,
      matchedHighlightTerms,
      usedFuzzy: false,
    });
  }

  // 4. 拼写容错二阶段兜底（仅对全库 0 精确命中的 Latin >= 4 词元生效）
  const missedAsciiIndices = [];
  units.forEach((u, idx) => {
    if (u.type === "ascii" && u.term.length >= 4 && unitGlobalHits[idx] === 0) {
      missedAsciiIndices.push(idx);
    }
  });

  if (missedAsciiIndices.length > 0) {
    for (const uIdx of missedAsciiIndices) {
      const fuzzyCandidates = findFuzzyMatches(units[uIdx].term, index.vocabulary);
      for (const cand of fuzzyCandidates) {
        const factor = cand.dist === 1 ? 0.65 : 0.45;
        for (const draft of scoredDrafts) {
          const fRes = scoreSingleTermOnEntry(draft.entry, cand.term, index.avgDocLen, factor, draft.secScores);
          if (fRes.matched) {
            draft.score += fRes.score;
            draft.matchedPrimaryCount += 0.85;
            draft.matchedHighlightTerms.add(cand.term);
            draft.usedFuzzy = true;
          }
        }
      }
    }
  }

  // 5. 多词协同 (AND Bonus) 与邻近度加成，并提取最佳章节与上下文片段
  const unitTerms = units.map((u) => u.term);
  const candidates = [];

  for (const draft of scoredDrafts) {
    let finalScore = draft.score;
    if (finalScore <= 0) continue;

    const { entry, secScores, matchedPrimaryCount, matchedHighlightTerms, usedFuzzy } = draft;
    const coverageRatio = matchedPrimaryCount / units.length;

    if (units.length > 1) {
      if (coverageRatio >= 0.99) {
        finalScore += 160;
      } else if (coverageRatio >= 0.5) {
        finalScore += 45 * coverageRatio;
      } else {
        finalScore *= 0.45;
      }

      if (hasProximityCluster(entry.plainContentLower, unitTerms) || hasProximityCluster(entry.titleLower, unitTerms)) {
        finalScore += 95;
      }
    }

    // 定位得分最高的子章节作为深层锚点 (#/slug#anchor)
    let bestSec = null;
    let bestSecScore = 0;
    for (let i = 0; i < entry.sections.length; i++) {
      const sec = entry.sections[i];
      if (sec.id && secScores[i] > bestSecScore) {
        bestSecScore = secScores[i];
        bestSec = sec;
      }
    }

    const snippetSource = bestSec && bestSec.plainBody ? bestSec.plainBody : entry.plainContent;
    const activeTerms = matchedHighlightTerms.size > 0 ? [...matchedHighlightTerms] : unitTerms;
    const snippet = extractBestSnippet(snippetSource, activeTerms, entry.doc.description);

    let matchType = "content";
    if (entry.titleLower.includes(fullQuery) || entry.titleLower === fullQuery || entry.aliasList.includes(fullQuery)) {
      matchType = "title";
    } else if (bestSec && bestSecScore >= 40) {
      matchType = "section";
    } else if (usedFuzzy) {
      matchType = "fuzzy";
    }

    candidates.push({
      doc: entry.doc,
      score: Math.round(finalScore),
      coverageRatio,
      snippet,
      anchor: bestSec ? bestSec.id : "",
      sectionTitle: bestSec ? bestSec.title : "",
      matchType,
      tokens: activeTerms,
    });
  }

  candidates.sort((a, b) => b.score - a.score);
  if (candidates.length === 0) return [];

  // 6. 动态信噪比裁剪：按榜首置信度与匹配类型自适应过滤长尾偶发噪音
  const topScore = candidates[0].score;
  const floorRatio = candidates[0].matchType === "fuzzy" ? 0.25 : 0.11;
  const filtered =
    topScore >= 130
      ? candidates.filter((item, idx) => idx === 0 || (item.score >= topScore * floorRatio && (item.score >= 22 || item.coverageRatio >= 0.75)))
      : candidates;

  return filtered.slice(0, limit);
}
