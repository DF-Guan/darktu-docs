/**
 * Sidebar disclosure regression: native keyboard-operable controls and synced state.
 * No DOM dependency: exercise the real renderSidebar method against a focused fake.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DOCS_NAVIGATION } from "../src/data/navigation.js";
import { DarktuDocsApp } from "../src/index.js";

const listeners = new Map();
let collapsed = false;

const category = {
  classList: {
    toggle(name) {
      assert.equal(name, "collapsed");
      collapsed = !collapsed;
      return collapsed;
    },
  },
};
const trigger = {
  attributes: {},
  closest(selector) {
    return selector === ".sidebar-category" ? category : null;
  },
  setAttribute(name, value) {
    this.attributes[name] = value;
  },
};
const sidebar = {
  innerHTML: "",
  addEventListener(type, listener) {
    listeners.set(type, listener);
  },
  contains(element) {
    return element === trigger;
  },
};
const filter = {
  addEventListener(type, listener) {
    listeners.set(`filter:${type}`, listener);
  },
};
const links = [
  { innerText: "Markdown", style: {} },
  { innerText: "中文排版", style: {} },
];

globalThis.document = {
  getElementById(id) {
    if (id === "sidebarTree") return sidebar;
    if (id === "sidebarFilter") return filter;
    return null;
  },
  querySelectorAll(selector) {
    assert.equal(selector, ".sidebar-item-link");
    return links;
  },
};

try {
  DarktuDocsApp.prototype.renderSidebar.call({});

  const buttons = sidebar.innerHTML.match(/<button type="button" class="sidebar-category-header"/g) || [];
  assert.equal(buttons.length, DOCS_NAVIGATION.length, "each category is a native keyboard-operable button");
  assert.doesNotMatch(sidebar.innerHTML, /\bonclick=/, "no inline click handler");
  for (const group of DOCS_NAVIGATION) {
    assert.ok(sidebar.innerHTML.includes(`aria-expanded="true" aria-controls="sidebar-items-${group.id}"`));
    assert.ok(sidebar.innerHTML.includes(`id="sidebar-items-${group.id}"`));
  }

  const click = listeners.get("click");
  assert.equal(typeof click, "function");
  const target = { closest: (selector) => selector === ".sidebar-category-header" ? trigger : null };

  click({ target });
  assert.equal(collapsed, true);
  assert.equal(trigger.attributes["aria-expanded"], "false", "collapsed state announced");

  click({ target });
  assert.equal(collapsed, false);
  assert.equal(trigger.attributes["aria-expanded"], "true", "expanded state announced");

  click({ target: { closest: () => null } });
  assert.equal(collapsed, false, "other clicks do not toggle categories");

  const filterInput = listeners.get("filter:input");
  assert.equal(typeof filterInput, "function", "existing sidebar search stays wired");
  filterInput({ target: { value: "mark" } });
  assert.equal(links[0].style.display, "flex");
  assert.equal(links[1].style.display, "none");

  const css = readFileSync(new URL("../src/styles/sidebar.css", import.meta.url), "utf8");
  assert.match(css, /\.sidebar-category-header:focus-visible\s*\{/);
  assert.match(css, /outline:\s*2px solid var\(--border-focus\)/);

  console.log("✅ Sidebar disclosure semantics, expanded state, filter, and focus style verified.");
} finally {
  delete globalThis.document;
}
