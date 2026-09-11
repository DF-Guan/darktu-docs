/**
 * 知识库系统主入口 (index.js)
 * 遵循 Dune 架构第 4 公理（单文件行数 <= 250 行，模块清晰解耦）
 */

import { DOCS_NAVIGATION, getDocBySlugOrId } from "./data/navigation.js";
import { getArticleMarkdown } from "./data/articlesContent.js";
import { renderMarkdown } from "./services/markdownRenderer.js";
import { setupSearchUI } from "./services/searchUI.js";
import { getInitialTheme, applyTheme, toggleTheme } from "./services/themeService.js";
import {
  setupCodeCopy,
  setupTOCScrollSpy,
  setupReadingProgressAndBackTop,
  setupHeadingAnchorLinks,
  getWikiEditLinks,
} from "./services/uiHelpers.js";
import { setupWikilinkPreview } from "./services/wikilinkPreview.js";
import { setupKeyboardShortcuts } from "./services/keyboardShortcuts.js";
import { setupReadingSettings } from "./services/readingSettings.js";

export class DarktuDocsApp {
  constructor() {
    this.currentDoc = null;
    this.prev = null;
    this.next = null;
    this.init();
  }

  init() {
    setupCodeCopy();
    setupReadingProgressAndBackTop();
    setupHeadingAnchorLinks(() => this.currentDoc);
    setupWikilinkPreview();
    setupReadingSettings();
    setupKeyboardShortcuts(() => this);
    setupSearchUI();

    // 1. 初始化主题
    applyTheme(getInitialTheme());
    document.getElementById("themeToggleBtn")?.addEventListener("click", () => toggleTheme());

    // 2. 移动端侧边栏切换
    const toggleBtn = document.getElementById("mobileMenuToggle");
    const sidebar = document.getElementById("docsSidebar");
    const backdrop = document.getElementById("sidebarBackdrop");
    toggleBtn?.addEventListener("click", () => {
      sidebar?.classList.toggle("mobile-open");
      if (backdrop) backdrop.style.display = sidebar?.classList.contains("mobile-open") ? "block" : "none";
    });
    backdrop?.addEventListener("click", () => {
      sidebar?.classList.remove("mobile-open");
      if (backdrop) backdrop.style.display = "none";
    });

    // 3. 渲染目录树并监听路由
    this.renderSidebar();
    window.addEventListener("hashchange", () => this.handleRoute());
    this.handleRoute();
  }

  getCurrentNavCardSlugs() {
    return {
      prevSlug: this.prev ? this.prev.slug : null,
      nextSlug: this.next ? this.next.slug : null,
    };
  }

  renderSidebar() {
    const container = document.getElementById("sidebarTree");
    if (!container) return;

    container.innerHTML = DOCS_NAVIGATION.map((cat) => `
      <div class="sidebar-category" id="cat-${cat.id}">
        <div class="sidebar-category-header" onclick="this.parentElement.classList.toggle('collapsed')">
          <div class="category-title-group">
            <svg class="category-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
            <span>${cat.title}</span>
          </div>
          <span class="category-badge">${cat.badge}</span>
        </div>
        <div class="sidebar-items-list">
          ${cat.items.map((item) => `
            <a href="#/${item.slug}" class="sidebar-item-link" id="link-${item.id.replace(/\//g, "-")}">
              ${item.title}
            </a>
          `).join("")}
        </div>
      </div>
    `).join("");

    const filterInput = document.getElementById("sidebarFilter");
    filterInput?.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      document.querySelectorAll(".sidebar-item-link").forEach((el) => {
        const text = el.innerText.toLowerCase();
        el.style.display = !q || text.includes(q) ? "flex" : "none";
      });
    });
  }

  handleRoute() {
    const hash = window.location.hash;
    const parts = hash.replace(/^#\/?/, "").split("#");
    const docSlug = parts[0] || "overview";
    const headingAnchor = parts[1] || "";

    const { doc, prev, next } = getDocBySlugOrId(docSlug);
    this.currentDoc = doc;
    this.prev = prev;
    this.next = next;

    document.querySelectorAll(".sidebar-item-link").forEach((el) => el.classList.remove("active"));
    const activeLink = document.getElementById(`link-${doc.id.replace(/\//g, "-")}`);
    activeLink?.classList.add("active");

    document.getElementById("docsSidebar")?.classList.remove("mobile-open");
    const backdrop = document.getElementById("sidebarBackdrop");
    if (backdrop) backdrop.style.display = "none";

    this.renderContent(doc, prev, next);

    if (headingAnchor) {
      setTimeout(() => {
        const targetEl = document.getElementById(headingAnchor);
        targetEl?.scrollIntoView({ behavior: "smooth", block: "start" });
        targetEl?.classList.add("heading-highlight-pulse");
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  renderContent(doc, prev, next) {
    const breadcrumbEl = document.getElementById("docsBreadcrumb");
    const metaHeaderEl = document.getElementById("docsMetaHeader");
    const bodyEl = document.getElementById("docsBody");
    const footerEl = document.getElementById("docsFooter");
    const tocListEl = document.getElementById("tocList");

    if (breadcrumbEl) {
      breadcrumbEl.innerHTML = `
        <a href="#/overview" style="color: var(--text-muted); text-decoration: none;">知识库</a>
        <span class="breadcrumb-sep">/</span>
        <span>${doc.categoryTitle}</span>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-current">${doc.title}</span>
      `;
    }

    const rawMd = getArticleMarkdown(doc.id);
    const wordCount = rawMd.length;
    const readMinutes = Math.max(1, Math.ceil(wordCount / 450));

    if (metaHeaderEl) {
      metaHeaderEl.innerHTML = `
        <span class="docs-meta-badge">${doc.categoryTitle}</span>
        <span class="docs-meta-divider"></span>
        <span class="docs-meta-item">预计阅读：约 ${readMinutes} 分钟</span>
        <span class="docs-meta-divider"></span>
        <span class="docs-meta-item">字数：约 ${wordCount} 字</span>
        <span class="docs-meta-divider"></span>
        <span class="docs-meta-item">修订：2026-09</span>
      `;
    }

    const { html, toc } = renderMarkdown(rawMd);
    if (bodyEl) bodyEl.innerHTML = html;

    if (tocListEl) {
      tocListEl.innerHTML =
        toc.length === 0
          ? '<li class="toc-item"><span style="color: var(--text-muted);">本条目暂无小节</span></li>'
          : toc.map((t) => `
            <li class="toc-item level-${t.level}">
              <a href="#${t.id}" class="toc-link" data-heading="${t.id}">${t.text}</a>
            </li>
          `).join("");
      setupTOCScrollSpy();
    }

    if (footerEl) {
      const { editUrl, issueUrl } = getWikiEditLinks(doc);
      footerEl.innerHTML = `
        <div class="article-wiki-footer">
          <div class="wiki-footer-left">
            <span>本条目内容遵循 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a> 开放许可，面向大众自由阅读学习。</span>
          </div>
          <div class="wiki-footer-right">
            <a href="${editUrl}" target="_blank" rel="noopener noreferrer" class="wiki-edit-btn">在 GitHub 编辑此条目</a>
            <a href="${issueUrl}" target="_blank" rel="noopener noreferrer" class="wiki-edit-btn">提交勘误</a>
          </div>
        </div>
        <div style="display: flex; gap: 16px; width: 100%; margin-top: 24px;">
          ${prev ? `<a href="#/${prev.slug}" class="nav-card prev"><span class="nav-card-label">← [ 上一篇</span><span class="nav-card-title">${prev.title}</span></a>` : '<div style="flex:1;"></div>'}
          ${next ? `<a href="#/${next.slug}" class="nav-card next"><span class="nav-card-label">下一篇 ] →</span><span class="nav-card-title">${next.title}</span></a>` : '<div style="flex:1;"></div>'}
        </div>
      `;
    }

    document.title = `${doc.title} - Darktu 知识库`;
  }
}

export function main() {
  return new DarktuDocsApp();
}

if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => main());
}
