/**
 * 文章实用度反馈组件服务 (feedbackService.js)
 * 深度对标 Fumadocs / Astro Starlight 顶级文档体验 ("Was this page helpful?")
 * 提供 localStorage 本地记忆、即时轻量交互、多态反馈与 GitHub Issue 快速直达
 */

const STORAGE_KEY = "darktu_docs_feedback_v1";

/**
 * 安全读取 localStorage（防 SSR / Node / 无痕模式禁用抛错）
 */
function getStorageMap() {
  if (typeof window === "undefined" || !window.localStorage) {
    return {};
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn("[feedbackService] localStorage read failed:", err);
    return {};
  }
}

/**
 * 安全写入 localStorage
 */
function setStorageMap(map) {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch (err) {
    console.warn("[feedbackService] localStorage write failed:", err);
  }
}

/**
 * 获取指定文章的反馈状态 ('helpful' | 'unhelpful' | null)
 */
export function getArticleFeedback(docId) {
  const map = getStorageMap();
  const entry = map[docId];
  return entry && entry.type ? entry.type : null;
}

/**
 * 保存指定文章的反馈状态
 */
export function saveArticleFeedback(docId, type) {
  const map = getStorageMap();
  map[docId] = {
    type,
    timestamp: Date.now()
  };
  setStorageMap(map);
  return map[docId];
}

/**
 * 撤销指定文章的反馈状态
 */
export function clearArticleFeedback(docId) {
  const map = getStorageMap();
  delete map[docId];
  setStorageMap(map);
}

/**
 * 生成预填反馈建议的 GitHub Issue 链接
 */
export function getFeedbackIssueUrl(doc) {
  const title = `[文档反馈] 《${doc.title}》内容改进建议`;
  const body = [
    `### 📚 文档信息`,
    `- **词条名称**：${doc.title}`,
    `- **词条链接**：https://docs.darktu.com/#/${doc.slug}`,
    `- **所属分类**：${doc.categoryTitle || ""}`,
    ``,
    `### 💡 您的疑问或改进建议`,
    `<!-- 请简要描述您在阅读该词条时遇到的困惑、未讲透的概念或排版错误 -->`,
    ``,
    `---`,
    `*由 Darktu Docs 反馈组件一键发起*`
  ].join("\n");

  return `https://github.com/DF-Guan/darktu-docs/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}

/**
 * 生成反馈卡片 HTML
 */
export function renderFeedbackWidgetHtml(doc, currentFeedback = null) {
  const issueUrl = getFeedbackIssueUrl(doc);

  if (currentFeedback === "helpful") {
    return `
      <div class="docs-feedback-card feedback-state-helpful" role="region" aria-label="文章实用度反馈">
        <div class="feedback-icon">🎉</div>
        <div class="feedback-message">
          <span class="feedback-title">感谢您的认可！</span>
          <span class="feedback-sub">我们会继续保持并持续精进知识库内容。</span>
        </div>
        <button type="button" class="feedback-reset-btn" data-action="reset" aria-label="撤销反馈">
          撤销
        </button>
      </div>
    `;
  }

  if (currentFeedback === "unhelpful") {
    return `
      <div class="docs-feedback-card feedback-state-unhelpful" role="region" aria-label="文章实用度反馈">
        <div class="feedback-icon">💡</div>
        <div class="feedback-message">
          <span class="feedback-title">感谢您的宝贵建议！</span>
          <span class="feedback-sub">欢迎告诉我们哪里需要改进，与我们一同完善：</span>
        </div>
        <div class="feedback-actions-row">
          <a href="${issueUrl}" target="_blank" rel="noopener noreferrer" class="feedback-issue-link">
            在 GitHub 提交具体疑问与改进建议 →
          </a>
          <button type="button" class="feedback-reset-btn" data-action="reset" aria-label="撤销反馈">
            撤销
          </button>
        </div>
      </div>
    `;
  }

  // 默认未评价状态
  return `
    <div class="docs-feedback-card feedback-state-idle" role="region" aria-label="文章实用度反馈">
      <div class="feedback-prompt">
        <span class="feedback-question">这篇文档对您有帮助吗？</span>
        <span class="feedback-desc">您的真实反馈是知识库持续迭代的重要动力</span>
      </div>
      <div class="feedback-buttons" role="group" aria-label="实用度打分">
        <button type="button" class="feedback-btn feedback-btn-helpful" data-feedback="helpful" aria-label="这篇文档有帮助">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>
          <span>有帮助</span>
        </button>
        <button type="button" class="feedback-btn feedback-btn-unhelpful" data-feedback="unhelpful" aria-label="这篇文档仍有疑问">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"/></svg>
          <span>仍有疑问</span>
        </button>
      </div>
    </div>
  `;
}

/**
 * 挂载并激活文章反馈组件交互
 */
export function setupArticleFeedback(containerEl, doc, onFeedbackChange = null) {
  if (!containerEl || !doc) return;

  const render = () => {
    const current = getArticleFeedback(doc.id);
    containerEl.innerHTML = renderFeedbackWidgetHtml(doc, current);

    // 绑定事件
    const helpfulBtn = containerEl.querySelector('[data-feedback="helpful"]');
    const unhelpfulBtn = containerEl.querySelector('[data-feedback="unhelpful"]');
    const resetBtn = containerEl.querySelector('[data-action="reset"]');

    helpfulBtn?.addEventListener("click", () => {
      saveArticleFeedback(doc.id, "helpful");
      if (typeof onFeedbackChange === "function") onFeedbackChange(doc.id, "helpful");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("darktu:feedback", { detail: { docId: doc.id, type: "helpful" } }));
      }
      render();
    });

    unhelpfulBtn?.addEventListener("click", () => {
      saveArticleFeedback(doc.id, "unhelpful");
      if (typeof onFeedbackChange === "function") onFeedbackChange(doc.id, "unhelpful");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("darktu:feedback", { detail: { docId: doc.id, type: "unhelpful" } }));
      }
      render();
    });

    resetBtn?.addEventListener("click", () => {
      clearArticleFeedback(doc.id);
      if (typeof onFeedbackChange === "function") onFeedbackChange(doc.id, null);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("darktu:feedback", { detail: { docId: doc.id, type: null } }));
      }
      render();
    });
  };

  render();
}
