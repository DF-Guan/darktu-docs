/**
 * UI 辅助交互组件与全局事件 (uiHelpers.js)
 */

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
      setTimeout(() => {
        btn.classList.remove("copied");
        if (span) span.innerText = oldText;
      }, 1800);
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

export function setupReadingProgressAndBackTop() {
  if (typeof window === "undefined") return;
  const bar = document.getElementById("readingProgressBar");
  window.addEventListener(
    "scroll",
    () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPos = window.scrollY;
      const progress = docHeight > 0 ? (scrollPos / docHeight) * 100 : 0;
      if (bar) bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    },
    { passive: true }
  );

  document.getElementById("backToTopBtn")?.addEventListener("click", () => {
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
