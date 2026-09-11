/**
 * 维基百科式正文内链悬浮即时预览服务 (wikilinkPreview.js)
 * 鼠标轻触词条内链，无需离开页面即可快速预览目标词条的核心定义与摘要
 */

import { getDocBySlugOrId } from "../data/navigation.js";
import { getArticleMarkdown } from "../data/articlesContent.js";

let previewPopoverEl = null;
let hideTimer = null;

function ensurePopover() {
  if (previewPopoverEl) return previewPopoverEl;
  previewPopoverEl = document.createElement("div");
  previewPopoverEl.className = "wikilink-preview-popover";
  previewPopoverEl.id = "wikilinkPreviewPopover";
  document.body.appendChild(previewPopoverEl);
  return previewPopoverEl;
}

function extractLeadExcerpt(markdown) {
  if (!markdown) return "";
  const lines = markdown.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith(">") && !trimmed.startsWith("> [!")) {
      return trimmed.replace(/^>\s*/, "").replace(/[*_`]/g, "");
    }
  }
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && !trimmed.startsWith("---") && !trimmed.startsWith(">") && !trimmed.startsWith("-")) {
      return trimmed.replace(/[*_`]/g, "");
    }
  }
  return "点击直接查看本条目详尽规范与解析。";
}

export function setupWikilinkPreview() {
  if (typeof window === "undefined") return;
  const popover = ensurePopover();

  document.addEventListener("mouseover", (e) => {
    const link = e.target.closest("a.wikilink");
    if (!link) return;

    clearTimeout(hideTimer);
    const href = link.getAttribute("href") || "";
    const cleanSlug = href.replace(/^#\/?/, "").trim();
    if (!cleanSlug) return;

    const { doc } = getDocBySlugOrId(cleanSlug);
    if (!doc) return;

    const rawMd = getArticleMarkdown(doc.id);
    const excerpt = extractLeadExcerpt(rawMd);
    const readMinutes = Math.max(1, Math.ceil(rawMd.length / 450));

    popover.innerHTML = `
      <div class="preview-popover-header">
        <span class="preview-popover-badge">${doc.categoryTitle}</span>
        <span class="preview-popover-readtime">约 ${readMinutes} 分钟</span>
      </div>
      <div class="preview-popover-title">${doc.title}</div>
      <div class="preview-popover-excerpt">${excerpt}</div>
      <div class="preview-popover-footer">
        <span>点击快速直达条目全文 →</span>
      </div>
    `;

    // 计算定位与防止越界
    const rect = link.getBoundingClientRect();
    const popWidth = 340;
    const popHeight = 160;

    let left = rect.left;
    let top = rect.bottom + 8;

    if (left + popWidth > window.innerWidth - 20) {
      left = window.innerWidth - popWidth - 20;
    }
    if (left < 16) left = 16;

    if (top + popHeight > window.innerHeight - 20) {
      top = rect.top - popHeight - 8;
    }

    popover.style.left = `${left}px`;
    popover.style.top = `${top}px`;
    popover.classList.add("visible");
  });

  document.addEventListener("mouseout", (e) => {
    const link = e.target.closest("a.wikilink");
    if (!link) return;
    hideTimer = setTimeout(() => {
      popover.classList.remove("visible");
    }, 120);
  });

  window.addEventListener("scroll", () => {
    popover.classList.remove("visible");
  }, { passive: true });

  document.addEventListener("click", () => {
    popover.classList.remove("visible");
  });
}
