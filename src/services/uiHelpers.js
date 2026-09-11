/**
 * UI 辅助交互组件与全局事件 (uiHelpers.js)
 */

let toastTimeout = null;

/**
 * 弹出平滑浮动 Toast 气泡提示
 */
export function showToast(message, duration = 2200) {
  if (typeof window === "undefined") return;
  let toastEl = document.getElementById("docsToast");
  if (!toastEl) {
    toastEl = document.createElement("div");
    toastEl.id = "docsToast";
    toastEl.className = "docs-toast";
    document.body.appendChild(toastEl);
  }

  clearTimeout(toastTimeout);
  toastEl.innerText = message;
  toastEl.classList.add("visible");

  toastTimeout = setTimeout(() => {
    toastEl.classList.remove("visible");
  }, duration);
}

export function setupCodeCopy() {
  if (typeof window === "undefined") return;
  window.__copyCodeBlock = function (btn) {
    const container = btn.closest(".code-block-container");
    const codeEl = container?.querySelector("code");
    if (!codeEl) return;

    const text = codeEl.innerText;
    navigator.clipboard.writeText(text).then(() => {
      btn.classList.add("copied");
      const span = btn.querySelector("span");
      const oldText = span ? span.innerText : "";
      if (span) span.innerText = "已复制";
      showToast("代码片段已成功复制到剪贴板 📋");
      setTimeout(() => {
        btn.classList.remove("copied");
        if (span) span.innerText = oldText;
      }, 1800);
    }).catch(() => {
      showToast("复制失败，请手动选择复制");
    });
  };
}

export function setupTOCScrollSpy() {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          document.querySelectorAll(".toc-link").forEach((l) => l.classList.remove("active"));
          document.querySelector(`.toc-link[data-heading="${id}"]`)?.classList.add("active");
        }
      });
    },
    { rootMargin: "0px 0px -70% 0px" }
  );

  document.querySelectorAll(".heading-anchor").forEach((h) => observer.observe(h));
}

/**
 * 设置标题锚点复制与平滑滚动聚焦
 */
export function setupHeadingAnchorLinks(getCurrentDoc) {
  if (typeof window === "undefined") return;

  document.addEventListener("click", (e) => {
    const link = e.target.closest(".heading-anchor-link");
    if (!link) return;

    e.preventDefault();
    const heading = link.closest(".heading-anchor");
    if (!heading) return;

    const headingId = heading.id;
    const currentDoc = typeof getCurrentDoc === "function" ? getCurrentDoc() : null;
    const slug = currentDoc?.slug || "overview";

    // 构造带精准锚点的完整直达链接
    const deepUrl = `${window.location.origin}${window.location.pathname}#/${slug}#${headingId}`;

    navigator.clipboard.writeText(deepUrl).then(() => {
      showToast("已复制本节锚点直达链接 🔗");
    }).catch(() => {
      showToast("已定位至小节：" + heading.innerText.replace("#", "").trim());
    });

    // 顺畅滚入视野并添加呼吸强调高亮
    heading.scrollIntoView({ behavior: "smooth", block: "start" });
    heading.classList.add("heading-highlight-pulse");
    setTimeout(() => {
      heading.classList.remove("heading-highlight-pulse");
    }, 1600);

    // 同步修改 hash 方便回溯
    history.replaceState(null, "", `#/${slug}#${headingId}`);
  });
}

export function setupReadingProgressAndBackTop() {
  if (typeof window === "undefined") return;
  const bar = document.getElementById("readingProgressBar");
  const backTopBtn = document.getElementById("backToTopBtn");

  window.addEventListener(
    "scroll",
    () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPos = window.scrollY;
      const progress = docHeight > 0 ? Math.round((scrollPos / docHeight) * 100) : 0;
      const clamped = Math.min(100, Math.max(0, progress));
      if (bar) bar.style.width = `${clamped}%`;

      if (backTopBtn) {
        if (clamped > 10) {
          backTopBtn.innerText = `↑ 顶部 (${clamped}%)`;
        } else {
          backTopBtn.innerText = "↑ 顶部";
        }
      }
    },
    { passive: true }
  );

  backTopBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/**
 * 根据文章 ID 计算对应的 GitHub 源码编辑链接与预填勘误 Issue 链接
 */
export function getWikiEditLinks(doc) {
  const catToSourceFile = {
    "markdown-specs": "markdownSpecs.js",
    typography: "clreqTypography.js",
    math: "latexFormulas.js",
    diagrams: "codeAndMermaid.js",
    clipboard: "clipboardEngineering.js",
    assets: "assetsStorage.js",
    writing: "technicalWriting.js",
    appendix: "appendixMaintenance.js",
  };
  const categoryKey = (doc.id || "").split("/")[0];
  const sourceFile = catToSourceFile[categoryKey] || "markdownSpecs.js";
  const editUrl = `https://github.com/DF-Guan/darktu-docs/blob/main/src/data/articles/${sourceFile}`;
  const issueUrl = `https://github.com/DF-Guan/darktu-docs/issues/new?title=${encodeURIComponent(
    `[词条勘误] ${doc.title}`
  )}&body=${encodeURIComponent(
    `**词条名称**：${doc.title} (#/${doc.slug})\n**发现问题**：\n\n**修改建议**：\n`
  )}`;
  return { editUrl, issueUrl };
}
