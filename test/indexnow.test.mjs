import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  INDEXNOW_CONFIG,
  buildIndexNowPayload,
  extractUrlsFromSitemap,
  submitToIndexNow
} from "../scripts/submit-indexnow.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

test("IndexNow key verification file exists in public/ and matches key", () => {
  const keyFilePath = path.join(projectRoot, "public", `${INDEXNOW_CONFIG.key}.txt`);
  assert.ok(fs.existsSync(keyFilePath), `Verification file must exist: ${keyFilePath}`);
  const content = fs.readFileSync(keyFilePath, "utf8").trim();
  assert.equal(content, INDEXNOW_CONFIG.key);
});

test("buildIndexNowPayload creates standard RFC compliant IndexNow JSON structure", () => {
  const dummyUrls = [
    "https://docs.darktu.com/",
    "https://docs.darktu.com/#/overview",
    "https://docs.darktu.com/#/global-search-indexing-and-indexnow"
  ];

  const payload = buildIndexNowPayload({
    host: "docs.darktu.com",
    key: INDEXNOW_CONFIG.key,
    keyLocation: INDEXNOW_CONFIG.keyLocation,
    urlList: dummyUrls
  });

  assert.equal(payload.host, "docs.darktu.com");
  assert.equal(payload.key, INDEXNOW_CONFIG.key);
  assert.equal(payload.keyLocation, INDEXNOW_CONFIG.keyLocation);
  assert.deepEqual(payload.urlList, dummyUrls);

  // Throws on empty params
  assert.throws(() => buildIndexNowPayload({ host: "", key: "", urlList: [] }));
});

test("extractUrlsFromSitemap parses URLs accurately from public/sitemap.xml", () => {
  const sitemapPath = path.join(projectRoot, "public", "sitemap.xml");
  const urls = extractUrlsFromSitemap(sitemapPath);
  assert.ok(Array.isArray(urls));
  assert.ok(urls.length >= 47);
  assert.ok(urls.includes("https://docs.darktu.com/"));
  assert.ok(urls.includes("https://docs.darktu.com/#/overview"));
});

test("submitToIndexNow handles dryRun mode without making network requests", async () => {
  const testUrls = ["https://docs.darktu.com/#/syntax"];
  const res = await submitToIndexNow({
    urls: testUrls,
    dryRun: true
  });

  assert.equal(res.success, true);
  assert.equal(res.dryRun, true);
  assert.equal(res.count, 1);
  assert.equal(res.payload.host, "docs.darktu.com");
  assert.deepEqual(res.payload.urlList, testUrls);
});
