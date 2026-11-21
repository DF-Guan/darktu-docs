import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ALL_DOCS } from "../src/data/navigation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("public/robots.txt permits major web search and generative AI crawlers", () => {
  const robotsPath = path.resolve(__dirname, "../public/robots.txt");
  assert(fs.existsSync(robotsPath), "robots.txt must exist in public directory");
  const content = fs.readFileSync(robotsPath, "utf8");

  assert(content.includes("User-agent: *"));
  assert(content.includes("User-agent: GPTBot"));
  assert(content.includes("User-agent: ClaudeBot"));
  assert(content.includes("User-agent: PerplexityBot"));
  assert(content.includes("User-agent: Google-Extended"));
  assert(content.includes("Sitemap: https://docs.darktu.com/sitemap.xml"));
});

test("public/sitemap.xml exhaustively indexes all 47 knowledge articles", () => {
  const sitemapPath = path.resolve(__dirname, "../public/sitemap.xml");
  assert(fs.existsSync(sitemapPath), "sitemap.xml must exist in public directory");
  const xml = fs.readFileSync(sitemapPath, "utf8");

  assert(xml.includes("<loc>https://docs.darktu.com/</loc>"));
  assert(xml.includes("<loc>https://docs.darktu.com/#/overview</loc>"));
  assert(xml.includes("<loc>https://docs.darktu.com/#/syntax</loc>"));
  assert(xml.includes("<loc>https://docs.darktu.com/#/mcp-model-context-protocol</loc>"));
  assert(xml.includes("<loc>https://docs.darktu.com/#/webgpu-client-side-inference</loc>"));

  // Check that every single article is present in sitemap
  ALL_DOCS.forEach((doc) => {
    assert(xml.includes(`<loc>https://docs.darktu.com/#/${doc.slug}</loc>`), `Sitemap missing ${doc.slug}`);
  });
});

test("index.html contains rich OpenGraph, Twitter Cards, and Schema.org JSON-LD", () => {
  const htmlPath = path.resolve(__dirname, "../index.html");
  const html = fs.readFileSync(htmlPath, "utf8");

  // Open Graph
  assert(html.includes('property="og:type" content="website"'));
  assert(html.includes('property="og:site_name" content="Darktu Docs"'));

  // Twitter Cards
  assert(html.includes('name="twitter:card" content="summary_large_image"'));
  assert(html.includes('name="twitter:title"'));

  // Schema.org JSON-LD
  assert(html.includes('application/ld+json'));
  assert(html.includes('"@type": "WebSite"'));
  assert(html.includes('"@type": "TechArticle"'));
  assert(html.includes('"potentialAction"'));
  assert(html.includes('"@type": "SearchAction"'));
});

test("index.html interactive buttons and modals satisfy accessibility semantics", () => {
  const htmlPath = path.resolve(__dirname, "../index.html");
  const html = fs.readFileSync(htmlPath, "utf8");

  // Buttons have explicit type="button"
  assert(html.includes('id="mobileMenuToggle" class="mobile-menu-toggle" type="button"'));
  assert(html.includes('id="headerSearchBtn" class="header-search-btn" type="button"'));
  assert(html.includes('id="fontSizeToggleBtn" class="font-size-toggle-btn" type="button"'));
  assert(html.includes('id="shortcutsHelpBtn" class="font-size-toggle-btn" type="button"'));
  assert(html.includes('id="themeToggleBtn" class="theme-toggle-btn" type="button"'));
  assert(html.includes('id="backToTopBtn" class="toc-back-top" type="button"'));

  // Search dialog accessibility
  assert(html.includes('id="searchModalOverlay" class="search-modal-overlay hidden" role="dialog" aria-modal="true" aria-labelledby="searchModalTitle"'));
  assert(html.includes('id="searchModalTitle" class="sr-only"'));
});
