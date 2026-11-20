import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { sanitizeUrl, renderMarkdown } from "../src/services/markdownRenderer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("sanitizeUrl neutralizes javascript and data protocol injections", () => {
  assert.equal(sanitizeUrl("javascript:alert(1)"), "#");
  assert.equal(sanitizeUrl("JAVASCRIPT:alert(document.cookie)"), "#");
  assert.equal(sanitizeUrl("data:text/html;base64,PHNjcmlwdD5..."), "#");
  assert.equal(sanitizeUrl("vbscript:msgbox(1)"), "#");

  // Legitimate URLs preserved
  assert.equal(sanitizeUrl("#/syntax"), "#/syntax");
  assert.equal(sanitizeUrl("/overview"), "/overview");
  assert.equal(sanitizeUrl("./assets/diagram.svg"), "./assets/diagram.svg");
  assert.equal(sanitizeUrl("https://docs.darktu.com"), "https://docs.darktu.com");
  assert.equal(sanitizeUrl("mailto:support@darktu.com"), "mailto:support@darktu.com");
});

test("renderMarkdown produces secure links and accessible copy buttons", () => {
  const unsafeMd = "[恶意链接](javascript:alert(1)) 与 [安全内链](#/syntax)";
  const { html } = renderMarkdown(unsafeMd);
  assert(!html.includes('href="javascript:'));
  assert(html.includes('href="#"'));
  assert(html.includes('href="#/syntax"'));
  assert(html.includes('class="wikilink"'));

  const codeMd = "```js\nconsole.log(1);\n```";
  const { html: codeHtml } = renderMarkdown(codeMd);
  assert(codeHtml.includes('type="button"'));
  assert(codeHtml.includes('aria-label="复制代码块内容"'));
});

test("content.css uses native custom-text-decorations for a.wikilink", () => {
  const cssPath = path.resolve(__dirname, "../src/styles/content.css");
  const css = fs.readFileSync(cssPath, "utf8");
  assert(css.includes("text-underline-offset: 3px"));
  assert(css.includes("text-decoration-thickness: 1px"));
  assert(!css.includes("border-bottom: 1px dashed var(--accent-primary)"));
});
