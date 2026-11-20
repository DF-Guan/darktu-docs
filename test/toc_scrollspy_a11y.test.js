import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { renderMarkdown } from "../src/services/markdownRenderer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("toc.css implements Google Modern Web Guidance scroll-target-group and :target-current", () => {
  const cssPath = path.resolve(__dirname, "../src/styles/toc.css");
  const css = fs.readFileSync(cssPath, "utf8");

  // Modern CSS target grouping on navigation container
  assert(css.includes("scroll-target-group: auto;"), "toc-list must specify scroll-target-group: auto");

  // Modern pseudo-class with fallback selector wrapper
  assert(css.includes(".toc-link:is(:target-current, .active)"), "toc-link must support :target-current via :is()");
});

test("markdownRenderer generates headings with tabindex='-1' and accessible anchor label", () => {
  const md = "## 架构设计规范\n正文内容";
  const { html, toc } = renderMarkdown(md);

  assert(html.includes('id="架构设计规范"'));
  assert(html.includes('class="heading-anchor"'));
  assert(html.includes('tabindex="-1"'), "Headings must have tabindex='-1' for programmatic focus");
  assert(html.includes('aria-label="章节直达锚点"'), "Anchor links must have accessible label");
  assert.equal(toc.length, 1);
  assert.equal(toc[0].id, "架构设计规范");
});

test("uiHelpers.js provides both native scroll-target-group sync and IntersectionObserver fallback", () => {
  const jsPath = path.resolve(__dirname, "../src/services/uiHelpers.js");
  const js = fs.readFileSync(jsPath, "utf8");

  assert(js.includes('CSS.supports("scroll-target-group: auto")'), "Must check native CSS support");
  assert(js.includes('aria-current'), "Must synchronize aria-current attribute for a11y");
  assert(js.includes('IntersectionObserver'), "Must provide fallback for older browsers");
});
