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
