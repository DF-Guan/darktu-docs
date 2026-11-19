import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

test("keyboardShortcuts.js embeds correct ARIA dialog semantics and title binding", () => {
  const code = readFileSync(resolve("src/services/keyboardShortcuts.js"), "utf8");

  // 1. Role and modal
  assert.match(code, /setAttribute\("role",\s*"dialog"\)/, "dialog must have role='dialog'");
  assert.match(code, /setAttribute\("aria-modal",\s*"true"\)/, "dialog must declare aria-modal='true'");
  assert.match(code, /setAttribute\("aria-labelledby",\s*"shortcutsModalTitle"\)/, "dialog must bind aria-labelledby");

  // 2. Title and close button accessibility
  assert.match(code, /id="shortcutsModalTitle"/, "title element must have id='shortcutsModalTitle'");
  assert.match(code, /id="shortcutsModalCloseBtn"[^>]*aria-label="关闭快捷键速查面板"/, "close button must have accessible aria-label");

  // 3. Focus trap and restoration logic
  assert.match(code, /lastFocusedElement\s*=\s*document\.activeElement/, "must preserve activeElement before opening");
  assert.match(code, /closeBtn\?\.focus\(\)/, "must focus close button or first interactive element upon open");
  assert.match(code, /lastFocusedElement\.focus\(\)/, "must restore focus upon modal close");
  assert.match(code, /e\.key === "Tab"/, "must handle Tab key for focus trapping");

  // 4. Motion reduction awareness
  assert.match(code, /prefers-reduced-motion/, "T key smooth scroll must check prefers-reduced-motion");
});

test("variables.css contains prefers-reduced-motion media query for motion sensitivity", () => {
  const css = readFileSync(resolve("src/styles/variables.css"), "utf8");
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/, "must provide prefers-reduced-motion fallback");
  assert.match(css, /scroll-behavior:\s*auto\s*!important/, "must disable smooth scrolling under reduced motion");
});

test("preview.css defines clear focus-visible outline for shortcuts close button", () => {
  const css = readFileSync(resolve("src/styles/preview.css"), "utf8");
  assert.match(css, /\.shortcuts-close-btn:focus-visible/, "must provide visible focus-visible outline");
});
