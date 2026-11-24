import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatMarkdownForLlm, setupCopyMarkdown } from '../src/services/uiHelpers.js';

const mockDoc = {
  id: "search-geo/global-search-indexing-and-indexnow",
  slug: "global-search-indexing-and-indexnow",
  title: "全球搜索引擎收录矩阵与 IndexNow 实时推送协议",
  categoryTitle: "8. 搜索优化与 GEO",
};

const rawMdSample = `# 全球搜索引擎收录矩阵与 IndexNow 实时推送协议\n\n正文内容测试段落。`;

test('formatMarkdownForLlm builds standard frontmatter header and body', () => {
  const result = formatMarkdownForLlm(mockDoc, rawMdSample);
  assert.ok(result.startsWith('---\n'));
  assert.ok(result.includes('title: "全球搜索引擎收录矩阵与 IndexNow 实时推送协议"'));
  assert.ok(result.includes('category: "8. 搜索优化与 GEO"'));
  assert.ok(result.includes('url: "https://docs.darktu.com/#/global-search-indexing-and-indexnow"'));
  assert.ok(result.includes('source: "Darktu Docs"'));
  assert.ok(result.includes('license: "CC BY-NC-SA 4.0"'));
  assert.ok(result.includes('# 全球搜索引擎收录矩阵与 IndexNow 实时推送协议'));
});

test('formatMarkdownForLlm handles empty or null safely', () => {
  assert.equal(formatMarkdownForLlm(null, 'hello'), 'hello');
  assert.ok(formatMarkdownForLlm(mockDoc, '').includes('source: "Darktu Docs"'));
});

test('setupCopyMarkdown binds click event and calls clipboard', async () => {
  let clipboardText = '';
  const originalNavigator = globalThis.navigator;

  Object.defineProperty(globalThis, 'navigator', {
    value: {
      clipboard: {
        writeText: async (text) => {
          clipboardText = text;
        }
      }
    },
    configurable: true,
    writable: true,
  });

  class MockButton {
    constructor() {
      this.classList = new Set();
      this.classList.add = (c) => this.classList[c] = true;
      this.classList.remove = (c) => delete this.classList[c];
      this._listeners = {};
    }
    querySelector(sel) {
      return { innerText: '复制 Markdown' };
    }
    addEventListener(evt, fn) {
      this._listeners[evt] = fn;
    }
    click() {
      if (this._listeners['click']) this._listeners['click']();
    }
  }

  const btn = new MockButton();
  try {
    setupCopyMarkdown(btn, mockDoc, rawMdSample);
    btn.click();
    await new Promise((r) => setTimeout(r, 10));
    assert.ok(clipboardText.includes('title: "全球搜索引擎收录矩阵与 IndexNow 实时推送协议"'));
  } finally {
    Object.defineProperty(globalThis, 'navigator', {
      value: originalNavigator,
      configurable: true,
      writable: true,
    });
  }
});
