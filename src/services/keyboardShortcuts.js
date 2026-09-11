/**
 * 知识库全键盘极速导航与快捷键服务 (keyboardShortcuts.js)
 * 支持纯键盘浏览：[ / ] 上下篇、T 回到顶部、/ 全文搜索、? 快捷键速查帮助
 */

let shortcutsModalEl = null;

function ensureShortcutsModal() {
  if (shortcutsModalEl) return shortcutsModalEl;
  shortcutsModalEl = document.createElement("div");
  shortcutsModalEl.className = "shortcuts-modal-overlay hidden";
  shortcutsModalEl.id = "shortcutsModalOverlay";
  shortcutsModalEl.setAttribute("role", "dialog");
  shortcutsModalEl.setAttribute("aria-modal", "true");
  shortcutsModalEl.innerHTML = `
    <div class="shortcuts-modal-card">
      <div class="shortcuts-modal-header">
        <div class="shortcuts-modal-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="6" x2="6.01" y1="9" y2="9"/><line x1="10" x2="10.01" y1="9" y2="9"/><line x1="14" x2="14.01" y1="9" y2="9"/><line x1="18" x2="18.01" y1="9" y2="9"/><line x1="8" x2="16" y1="13" y2="13"/></svg>
          <span>键盘无障碍操作速查表</span>
        </div>
        <button id="shortcutsModalCloseBtn" class="shortcuts-close-btn" title="按 ESC 退出">ESC</button>
      </div>
      <div class="shortcuts-list">
        <div class="shortcut-row">
          <span class="shortcut-desc">切换到上一词条</span>
          <div class="shortcut-keys"><kbd>[</kbd> 或 <kbd>P</kbd></div>
        </div>
        <div class="shortcut-row">
          <span class="shortcut-desc">切换到下一词条</span>
          <div class="shortcut-keys"><kbd>]</kbd> 或 <kbd>N</kbd></div>
        </div>
        <div class="shortcut-row">
          <span class="shortcut-desc">快速平滑回到顶部</span>
          <div class="shortcut-keys"><kbd>T</kbd></div>
        </div>
        <div class="shortcut-row">
          <span class="shortcut-desc">打开全库全文搜索</span>
          <div class="shortcut-keys"><kbd>/</kbd> 或 <kbd>⌘ K</kbd></div>
        </div>
        <div class="shortcut-row">
          <span class="shortcut-desc">调整阅读排版字号</span>
          <div class="shortcut-keys"><kbd>A</kbd></div>
        </div>
        <div class="shortcut-row">
          <span class="shortcut-desc">打开本快捷键面板</span>
          <div class="shortcut-keys"><kbd>?</kbd></div>
        </div>
        <div class="shortcut-row">
          <span class="shortcut-desc">复制当前小节直达链接</span>
          <div class="shortcut-keys"><span class="shortcut-note">点击标题旁 # 锚点</span></div>
        </div>
        <div class="shortcut-row">
          <span class="shortcut-desc">词条定义即时悬浮预览</span>
          <div class="shortcut-keys"><span class="shortcut-note">鼠标悬停正文内链</span></div>
        </div>
      </div>
      <div class="shortcuts-modal-footer">
        <span>按任意处或 ESC 即可关闭此速查面板</span>
      </div>
    </div>
  `;
  document.body.appendChild(shortcutsModalEl);

  const closeBtn = document.getElementById("shortcutsModalCloseBtn");
  closeBtn?.addEventListener("click", () => toggleShortcutsModal(false));
  shortcutsModalEl.addEventListener("click", (e) => {
    if (e.target === shortcutsModalEl) toggleShortcutsModal(false);
  });

  return shortcutsModalEl;
}

export function toggleShortcutsModal(show) {
  const modal = ensureShortcutsModal();
  if (show === undefined) {
    modal.classList.toggle("hidden");
  } else if (show) {
    modal.classList.remove("hidden");
  } else {
    modal.classList.add("hidden");
  }
}

export function setupKeyboardShortcuts(getAppInstance) {
  if (typeof window === "undefined") return;
  ensureShortcutsModal();

  window.addEventListener("keydown", (e) => {
    // 处于输入框、文本域时忽略全局单键快捷键
    const tag = (e.target?.tagName || "").toLowerCase();
    const isEditing = tag === "input" || tag === "textarea" || e.target?.isContentEditable;

    if (e.key === "Escape" || e.keyCode === 27) {
      toggleShortcutsModal(false);
      return;
    }

    if (isEditing) return;

    const app = typeof getAppInstance === "function" ? getAppInstance() : null;
    const currentNav = app?.getCurrentNavCardSlugs ? app.getCurrentNavCardSlugs() : null;

    // 1. [ 或 P: 上一词条
    if (e.key === "[" || e.key === "p" || e.key === "P") {
      e.preventDefault();
      if (currentNav?.prevSlug) {
        window.location.hash = `#/${currentNav.prevSlug}`;
      }
      return;
    }

    // 2. ] 或 N: 下一词条
    if (e.key === "]" || e.key === "n" || e.key === "N") {
      e.preventDefault();
      if (currentNav?.nextSlug) {
        window.location.hash = `#/${currentNav.nextSlug}`;
      }
      return;
    }

    // 3. T: 回到顶部
    if (e.key === "t" || e.key === "T") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // 4. /: 聚焦全局搜索
    if (e.key === "/") {
      e.preventDefault();
      const searchBtn = document.getElementById("headerSearchBtn");
      searchBtn?.click();
      return;
    }

    // 5. ?: 快捷键面板
    if (e.key === "?" || (e.shiftKey && e.key === "/")) {
      e.preventDefault();
      toggleShortcutsModal(true);
      return;
    }

    // 6. A: 切换阅读字号
    if (e.key === "a" || e.key === "A") {
      e.preventDefault();
      const fontBtn = document.getElementById("fontSizeToggleBtn");
      fontBtn?.click();
      return;
    }
  });

  document.getElementById("shortcutsHelpBtn")?.addEventListener("click", () => {
    toggleShortcutsModal(true);
  });
}
