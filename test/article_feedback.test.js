import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  getFeedbackIssueUrl,
  renderFeedbackWidgetHtml,
  saveArticleFeedback,
  getArticleFeedback,
  clearArticleFeedback,
  setupArticleFeedback,
} from '../src/services/feedbackService.js';

const mockDoc = {
  id: "search-geo/global-search-indexing-and-indexnow",
  slug: "global-search-indexing-and-indexnow",
  title: "全球搜索引擎收录矩阵与 IndexNow 实时推送协议",
  categoryTitle: "8. 搜索优化与 GEO",
};

test('getFeedbackIssueUrl encodes title, slug, and category in URL', () => {
  const url = getFeedbackIssueUrl(mockDoc);
  assert.ok(url.startsWith('https://github.com/DF-Guan/darktu-docs/issues/new?'));
  assert.ok(url.includes(encodeURIComponent('[文档反馈] 《全球搜索引擎收录矩阵与 IndexNow 实时推送协议》内容改进建议')));
  assert.ok(url.includes(encodeURIComponent('https://docs.darktu.com/#/global-search-indexing-and-indexnow')));
  assert.ok(url.includes(encodeURIComponent('8. 搜索优化与 GEO')));
});

test('renderFeedbackWidgetHtml renders initial unrated state with buttons', () => {
  const html = renderFeedbackWidgetHtml(mockDoc, null);
  assert.ok(html.includes('这篇文档对您有帮助吗？'));
  assert.ok(html.includes('data-feedback="helpful"'));
  assert.ok(html.includes('data-feedback="unhelpful"'));
  assert.ok(html.includes('aria-label="文章实用度反馈"'));
  assert.ok(html.includes('role="region"'));
});

test('renderFeedbackWidgetHtml renders helpful state with thank you message', () => {
  const html = renderFeedbackWidgetHtml(mockDoc, 'helpful');
  assert.ok(html.includes('感谢您的认可！'));
  assert.ok(html.includes('feedback-state-helpful'));
  assert.ok(html.includes('data-action="reset"'));
});

test('renderFeedbackWidgetHtml renders unhelpful state with issue link', () => {
  const html = renderFeedbackWidgetHtml(mockDoc, 'unhelpful');
  assert.ok(html.includes('感谢您的宝贵建议！'));
  assert.ok(html.includes('feedback-state-unhelpful'));
  assert.ok(html.includes('feedback-issue-link'));
  assert.ok(html.includes('在 GitHub 提交具体疑问与改进建议'));
  assert.ok(html.includes('data-action="reset"'));
});

test('localStorage operations safely store and clear feedback', () => {
  // Mock window.localStorage in node environment
  const store = {};
  global.window = {
    localStorage: {
      getItem: (key) => store[key] || null,
      setItem: (key, val) => { store[key] = String(val); },
      removeItem: (key) => { delete store[key]; },
    },
    dispatchEvent: () => {},
  };
  global.CustomEvent = class CustomEvent {
    constructor(type, eventInitDict) {
      this.type = type;
      this.detail = eventInitDict?.detail;
    }
  };

  try {
    // 1. Initial state
    assert.equal(getArticleFeedback(mockDoc.id), null);

    // 2. Save helpful
    saveArticleFeedback(mockDoc.id, 'helpful');
    assert.equal(getArticleFeedback(mockDoc.id), 'helpful');

    // 3. Save unhelpful
    saveArticleFeedback(mockDoc.id, 'unhelpful');
    assert.equal(getArticleFeedback(mockDoc.id), 'unhelpful');

    // 4. Clear feedback
    clearArticleFeedback(mockDoc.id);
    assert.equal(getArticleFeedback(mockDoc.id), null);
  } finally {
    delete global.window;
    delete global.CustomEvent;
  }
});

test('setupArticleFeedback mounts and triggers listeners on container', () => {
  const store = {};
  global.window = {
    localStorage: {
      getItem: (key) => store[key] || null,
      setItem: (key, val) => { store[key] = String(val); },
      removeItem: (key) => { delete store[key]; },
    },
    dispatchEvent: () => {},
  };
  global.CustomEvent = class CustomEvent {
    constructor(type, eventInitDict) {
      this.type = type;
      this.detail = eventInitDict?.detail;
    }
  };

  // Minimal simulated DOM element
  class MockElement {
    constructor() {
      this._html = '';
      this._listeners = {};
    }
    get innerHTML() { return this._html; }
    set innerHTML(val) {
      this._html = val;
    }
    querySelector(sel) {
      const el = new MockElement();
      el.selector = sel;
      return el;
    }
    addEventListener(evt, fn) {
      this._listeners[evt] = fn;
    }
  }

  const container = new MockElement();
  let reported = null;

  try {
    setupArticleFeedback(container, mockDoc, (docId, type) => {
      reported = { docId, type };
    });

    assert.ok(container.innerHTML.includes('这篇文档对您有帮助吗？'));
  } finally {
    delete global.window;
    delete global.CustomEvent;
  }
});
