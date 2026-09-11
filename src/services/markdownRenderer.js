/**
 * 现代轻量级 Markdown 渲染与大纲提取引擎 (markdownRenderer.js)
 * 支持 CommonMark 核心、表格、提示块 Callouts、代码块复制与 TOC 大纲分析
 */

/**
 * 转义 HTML 特殊字符
 */
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * 生成标题的安全 URL 锚点 slug
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * 渲染行内语法 (粗体/斜体/代码/链接/标记/上下标)
 */
function renderInline(text) {
  if (!text) return "";

  // 1. 行内代码 `code`
  let html = text.replace(/`([^`]+)`/g, (match, code) => {
    return `<code>${escapeHtml(code)}</code>`;
  });

  // 2. 粗体 **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // 3. 斜体 *text*
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  // 4. 删除线 ~~text~~
  html = html.replace(/~~([^~]+)~~/g, "<del>$1</del>");

  // 5. 下划线 ++text++
  html = html.replace(/\+\+([^+]+)\+\+/g, "<u>$1</u>");

  // 6. 高亮背景 ==text==
  html = html.replace(/==([^=]+)==/g, "<mark>$1</mark>");

  // 7. 下标 H~2~O
  html = html.replace(/~([^~]+)~/g, "<sub>$1</sub>");

  // 8. 上标 X^2^
  html = html.replace(/\^([^^]+)\^/g, "<sup>$1</sup>");

  // 9. 超链接 [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, label, url) => {
    const isExternal = url.startsWith("http");
    const isWiki = url.startsWith("#/");
    return `<a href="${url}" class="${isWiki ? "wikilink" : ""}" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ""}>${label}</a>`;
  });

  return html;
}

/**
 * 主渲染器：将 Markdown 转为 HTML，并同步提取大纲标题列表 (TOC)
 */
export function renderMarkdown(markdown) {
  if (!markdown) return { html: "", toc: [] };

  const lines = markdown.split("\n");
  const output = [];
  const toc = [];

  let inCodeBlock = false;
  let codeBlockLang = "";
  let codeBlockContent = [];

  let inTable = false;
  let tableRows = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 1. 处理代码块 ```lang
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        // 代码块闭合
        const rawCode = codeBlockContent.join("\n");
        const escaped = escapeHtml(rawCode);
        output.push(`
          <div class="code-block-container" data-lang="${codeBlockLang || "text"}">
            <div class="code-block-header">
              <span class="code-lang-label">${codeBlockLang || "text"}</span>
              <button class="code-copy-btn" onclick="window.__copyCodeBlock(this)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                <span>复制</span>
              </button>
            </div>
            <pre class="code-pre"><code>${escaped}</code></pre>
          </div>
        `);
        inCodeBlock = false;
        codeBlockContent = [];
        codeBlockLang = "";
      } else {
        // 代码块开启
        inCodeBlock = true;
        codeBlockLang = line.trim().replace(/^```/, "").trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // 2. 处理表格 | ... |
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      tableRows.push(line);
      continue;
    } else if (inTable) {
      // 表格结束，进行编译
      output.push(renderTableBlock(tableRows));
      inTable = false;
      tableRows = [];
    }

    // 3. 处理分割线 ---
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(line.trim())) {
      output.push('<hr class="docs-divider" />');
      continue;
    }

    // 4. 处理标题 # ~ ######
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const titleRaw = headingMatch[2].trim();
      const id = slugify(titleRaw);

      // 提取 H2, H3 进 TOC 大纲
      if (level === 2 || level === 3) {
        toc.push({
          level,
          id,
          text: titleRaw.replace(/<[^>]+>/g, ""),
        });
      }

      output.push(`<h${level} id="${id}" class="heading-anchor"><a href="#${id}" class="heading-anchor-link">#</a>${renderInline(titleRaw)}</h${level}>`);
      continue;
    }

    // 5. 处理提示块 Callouts: > [!NOTE] 等
    const calloutMatch = line.match(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)$/i);
    if (calloutMatch) {
      const type = calloutMatch[1].toUpperCase();
      const firstLineText = calloutMatch[2];
      const calloutLines = [];
      if (firstLineText) calloutLines.push(firstLineText);

      // 收集后续连续的引用行
      while (i + 1 < lines.length && lines[i + 1].startsWith(">")) {
        i++;
        calloutLines.push(lines[i].replace(/^>\s?/, ""));
      }

      const bodyHtml = renderInline(calloutLines.join("<br/>"));
      output.push(`
        <div class="callout-block callout-${type.toLowerCase()}">
          <div class="callout-header">
            <span class="callout-icon">${getCalloutIcon(type)}</span>
            <span class="callout-title">${getCalloutTitle(type)}</span>
          </div>
          <div class="callout-body">${bodyHtml}</div>
        </div>
      `);
      continue;
    }

    // 6. 普通引用块 > ...
    if (line.startsWith(">")) {
      const quoteLines = [line.replace(/^>\s?/, "")];
      while (i + 1 < lines.length && lines[i + 1].startsWith(">")) {
        i++;
        quoteLines.push(lines[i].replace(/^>\s?/, ""));
      }
      const isLead = toc.length === 0 && output.length <= 2;
      output.push(`<blockquote class="${isLead ? "docs-lead-abstract" : ""}"><p>${renderInline(quoteLines.join("<br/>"))}</p></blockquote>`);
      continue;
    }

    // 7. 无序列表 - 或 *
    if (/^\s*[-*]\s+(.*)$/.test(line)) {
      const listItems = [];
      let currentLine = line;
      while (currentLine && /^\s*[-*]\s+(.*)$/.test(currentLine)) {
        const itemText = currentLine.replace(/^\s*[-*]\s+/, "");
        // 支持任务列表 [x] [ ]
        if (itemText.startsWith("[x] ")) {
          listItems.push(`<li class="task-item checked"><input type="checkbox" checked disabled /> ${renderInline(itemText.slice(4))}</li>`);
        } else if (itemText.startsWith("[ ] ")) {
          listItems.push(`<li class="task-item"><input type="checkbox" disabled /> ${renderInline(itemText.slice(4))}</li>`);
        } else {
          listItems.push(`<li>${renderInline(itemText)}</li>`);
        }
        i++;
        currentLine = lines[i];
      }
      i--; // 回退一行
      output.push(`<ul>${listItems.join("")}</ul>`);
      continue;
    }

    // 8. 有序列表 1. ...
    if (/^\s*\d+\.\s+(.*)$/.test(line)) {
      const listItems = [];
      let currentLine = line;
      while (currentLine && /^\s*\d+\.\s+(.*)$/.test(currentLine)) {
        const itemText = currentLine.replace(/^\s*\d+\.\s+/, "");
        listItems.push(`<li>${renderInline(itemText)}</li>`);
        i++;
        currentLine = lines[i];
      }
      i--;
      output.push(`<ol>${listItems.join("")}</ol>`);
      continue;
    }

    // 9. 空行与普通段落
    if (!line.trim()) {
      continue;
    }

    output.push(`<p>${renderInline(line)}</p>`);
  }

  // 如果文件末尾有未闭合的表格
  if (inTable) {
    output.push(renderTableBlock(tableRows));
  }

  return {
    html: output.join("\n"),
    toc,
  };
}

/**
 * 辅助：编译 Markdown 表格
 */
function renderTableBlock(rows) {
  if (!rows || rows.length < 2) return "";
  const header = rows[0];
  const body = rows.slice(2); // 跳过分隔行 |---|---|

  const parseRow = (r) =>
    r
      .trim()
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((c) => renderInline(c.trim()));

  const ths = parseRow(header)
    .map((c) => `<th>${c}</th>`)
    .join("");
  const trs = body
    .map((r) => `<tr>${parseRow(r).map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("");

  return `
    <div class="table-container">
      <table class="docs-table">
        <thead><tr>${ths}</tr></thead>
        <tbody>${trs}</tbody>
      </table>
    </div>
  `;
}

function getCalloutIcon(type) {
  switch (type) {
    case "NOTE":
      return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>';
    case "TIP":
      return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2v1"/><path d="M12 7a5 5 0 0 1 5 5c0 2-1 3-2 4H9c-1-1-2-2-2-4a5 5 0 0 1 5-5z"/></svg>';
    case "IMPORTANT":
      return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    case "WARNING":
      return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
    case "CAUTION":
      return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>';
    default:
      return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>';
  }
}

function getCalloutTitle(type) {
  switch (type) {
    case "NOTE": return "说明";
    case "TIP": return "技巧";
    case "IMPORTANT": return "关键";
    case "WARNING": return "注意";
    case "CAUTION": return "警示";
    default: return "说明";
  }
}
