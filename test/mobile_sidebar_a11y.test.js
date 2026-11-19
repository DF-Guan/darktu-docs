import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { DarktuDocsApp } from "../src/index.js";

test("index.html embeds correct ARIA attributes for mobile drawer", () => {
  const html = readFileSync(resolve("index.html"), "utf8");

  assert.match(
    html,
    /id="mobileMenuToggle"[^>]*aria-expanded="false"[^>]*aria-controls="docsSidebar"/,
    "mobileMenuToggle must specify aria-expanded and aria-controls"
  );
  assert.match(
    html,
    /id="mobileMenuToggle"[^>]*aria-label="打开目录菜单"/,
    "mobileMenuToggle must have accessible aria-label"
  );
  assert.match(
    html,
    /id="sidebarBackdrop"[^>]*aria-hidden="true"/,
    "sidebarBackdrop must have aria-hidden='true'"
  );
  assert.match(
    html,
    /id="docsSidebar"[^>]*aria-label="知识库目录导航"/,
    "docsSidebar aside must have accessible aria-label"
  );
});

test("DarktuDocsApp.prototype.setMobileSidebarOpen manages mobile drawer state and ARIA attributes", () => {
  const sidebarClasses = new Set();
  const toggleAttributes = {};
  const backdropAttributes = {};
  const backdropStyle = {};

  const sidebar = {
    classList: {
      toggle(name, state) {
        if (state) sidebarClasses.add(name);
        else sidebarClasses.delete(name);
        return sidebarClasses.has(name);
      },
      contains(name) {
        return sidebarClasses.has(name);
      },
    },
    contains() {
      return false;
    },
  };
  const toggleBtn = {
    setAttribute(name, val) {
      toggleAttributes[name] = val;
    },
    focus() {},
  };
  const backdrop = {
    style: backdropStyle,
    setAttribute(name, val) {
      backdropAttributes[name] = val;
    },
  };

  globalThis.document = {
    getElementById(id) {
      if (id === "docsSidebar") return sidebar;
      if (id === "mobileMenuToggle") return toggleBtn;
      if (id === "sidebarBackdrop") return backdrop;
      return null;
    },
  };

  try {
    const app = Object.create(DarktuDocsApp.prototype);

    // 1. Open mobile drawer
    app.setMobileSidebarOpen(true);
    assert.equal(sidebarClasses.has("mobile-open"), true, "must add mobile-open class");
    assert.equal(toggleAttributes["aria-expanded"], "true", "must set aria-expanded to true");
    assert.equal(backdropStyle.display, "block", "must show backdrop");
    assert.equal(backdropAttributes["aria-hidden"], "false", "backdrop must be aria-hidden='false' when visible");

    // 2. Close mobile drawer
    app.setMobileSidebarOpen(false);
    assert.equal(sidebarClasses.has("mobile-open"), false, "must remove mobile-open class");
    assert.equal(toggleAttributes["aria-expanded"], "false", "must set aria-expanded to false");
    assert.equal(backdropStyle.display, "none", "must hide backdrop");
    assert.equal(backdropAttributes["aria-hidden"], "true", "backdrop must be aria-hidden='true' when hidden");
  } finally {
    delete globalThis.document;
  }
});
