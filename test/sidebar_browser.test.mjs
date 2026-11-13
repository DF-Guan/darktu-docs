/**
 * Optional real-browser pilot check. CI installs Playwright only for this job.
 * Run against the local Vite server at http://127.0.0.1:4173/.
 */
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 850 } });
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });

  const button = page.locator(".sidebar-category-header").first();
  const category = page.locator(".sidebar-category").first();
  const items = page.locator(".sidebar-items-list").first();
  assert.equal(await button.count(), 1);
  assert.equal(await button.getAttribute("aria-expanded"), "true");

  mkdirSync("evidence", { recursive: true });
  await button.focus();
  await page.screenshot({ path: "evidence/desktop-keyboard-focus.png", animations: "disabled" });

  await page.keyboard.press("Enter");
  assert.equal(await button.getAttribute("aria-expanded"), "false");
  assert.equal(await category.evaluate((el) => el.classList.contains("collapsed")), true);
  assert.equal(await items.isVisible(), false);
  await page.screenshot({ path: "evidence/desktop-collapsed.png", animations: "disabled" });

  await page.keyboard.press("Space");
  assert.equal(await button.getAttribute("aria-expanded"), "true");
  assert.equal(await items.isVisible(), true);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("#mobileMenuToggle").click();
  const mobileButton = page.locator(".sidebar-category-header").first();
  await mobileButton.focus();
  await page.keyboard.press("Enter");
  assert.equal(await mobileButton.getAttribute("aria-expanded"), "false");
  await page.screenshot({ path: "evidence/mobile-collapsed.png", animations: "disabled" });

  console.log("✅ Chromium desktop/mobile keyboard, disclosure state and visibility verified.");
} finally {
  await browser.close();
}
