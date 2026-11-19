/**
 * 维基百科式正文内链悬浮即时预览服务 (wikilinkPreview.js)
 * 鼠标轻触词条内链，无需离开页面即可快速预览目标词条的核心定义与摘要
 * 具备视口边缘碰撞检测与自适应上下翻转 (Flip) 算法
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

/**
 * 提取 Markdown 正文首段导语摘要作为预览内容
 */
export function extractLeadExcerpt(markdown) {
  if (!markdown) return "";
  const lines = markdown.split("\n");
  let inCallout = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("> [!")) {
      inCallout = true;
      continue;
    }
    if (inCallout) {
      if (trimmed.startsWith(">")) {
        continue;
      } else {
        inCallout = false;
      }
    }
    if (trimmed.startsWith(">")) {
      return trimmed.replace(/^>\s*/, "").replace(/[*_`]/g, "");
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (
      trimmed &&
      !trimmed.startsWith("#") &&
      !trimmed.startsWith("---") &&
      !trimmed.startsWith(">") &&
      !trimmed.startsWith("-")
    ) {
      return trimmed.replace(/[*_`]/g, "");
    }
  }
  return "点击直接查看本条目详尽规范与解析。";
}

/**
 * 视口边缘防溢出定位与翻转计算纯函数
 * @param {DOMRect|Object} rect 触发内链的 getBoundingClientRect
 * @param {number} popWidth 悬浮卡片宽度
 * @param {number} popHeight 悬浮卡片高度
 * @param {number} viewportWidth 视口宽度
 * @param {number} viewportHeight 视口高度
 * @param {number} [gap=8] 间距
 * @param {number} [padding=16] 视口安全内边距
 * @returns {{ left: number, top: number, placement: "bottom"|"top" }}
 */
export function calculatePopoverPosition(
  rect,
  popWidth,
  popHeight,
  viewportWidth,
  viewportHeight,
  gap = 8,
  padding = 16
) {
  let placement = "bottom";
  let left = rect.left;
  let top = rect.bottom + gap;

  // 1. 水平边界溢出修正 (防止右侧或左侧超出视口)
  if (left + popWidth > viewportWidth - padding) {
    left = viewportWidth - popWidth - padding;
  }
  if (left < padding) {
    left = padding;
  }

  // 2. 垂直溢出检测与自动翻转 (Flip)
  const overflowsBottom = top + popHeight > viewportHeight - padding;
  const overflowsTop = rect.top - popHeight - gap < padding;

  if (overflowsBottom) {
    // 底部空间不足，检查顶部空间是否充足
    if (!overflowsTop || rect.top > viewportHeight - rect.bottom) {
      top = Math.max(padding, rect.top - popHeight - gap);
      placement = "top";
    } else {
      // 极端情况（如视口高度较小），贴紧底部安全区
      top = Math.max(padding, viewportHeight - popHeight - padding);
    }
  } else {
    // 底部空间充足，但确保 top 不小于 padding
    top = Math.max(padding, top);
  }

  return { left, top, placement };
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

    // 计算定位与自适应翻转防溢出
    const rect = link.getBoundingClientRect();
    const popWidth = popover.offsetWidth || 340;
    const popHeight = popover.offsetHeight || 160;

    const pos = calculatePopoverPosition(
      rect,
      popWidth,
      popHeight,
      window.innerWidth,
      window.innerHeight
    );

    popover.dataset.placement = pos.placement;
    popover.style.left = `${pos.left}px`;
    popover.style.top = `${pos.top}px`;
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
