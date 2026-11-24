/**
 * scripts/submit-indexnow.mjs
 * Darktu 矩阵 IndexNow 自动化提交工具
 * 支持全量 Sitemap 提交与单 URL 增量推送，多节点级联广播 (api.indexnow.org / bing.com / yandex.com)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

export const INDEXNOW_CONFIG = {
  host: "docs.darktu.com",
  key: "c4a96b9983194a2b97f017e2e8310c14",
  keyLocation: "https://docs.darktu.com/c4a96b9983194a2b97f017e2e8310c14.txt",
  defaultEndpoint: "https://api.indexnow.org/indexnow",
  endpoints: [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
    "https://yandex.com/indexnow"
  ]
};

export function buildIndexNowPayload({ host, key, keyLocation, urlList }) {
  if (!host || !key || !Array.isArray(urlList) || urlList.length === 0) {
    throw new Error("Invalid IndexNow parameters: host, key, and non-empty urlList required");
  }
  const payload = {
    host,
    key,
    urlList: urlList.slice(0, 10000)
  };
  if (keyLocation) {
    payload.keyLocation = keyLocation;
  }
  return payload;
}

export function extractUrlsFromSitemap(sitemapXmlPath) {
  if (!fs.existsSync(sitemapXmlPath)) {
    return [];
  }
  const xml = fs.readFileSync(sitemapXmlPath, "utf8");
  const urls = [];
  const regex = /<loc>(.*?)<\/loc>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

export async function submitToIndexNow({
  urls = [],
  host = INDEXNOW_CONFIG.host,
  key = INDEXNOW_CONFIG.key,
  keyLocation = INDEXNOW_CONFIG.keyLocation,
  endpoint = INDEXNOW_CONFIG.defaultEndpoint,
  dryRun = false
} = {}) {
  const payload = buildIndexNowPayload({ host, key, keyLocation, urlList: urls });

  if (dryRun) {
    return {
      success: true,
      dryRun: true,
      endpoint,
      count: payload.urlList.length,
      payload
    };
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(payload)
    });
    const success = res.status === 200 || res.status === 202;
    return {
      success,
      status: res.status,
      endpoint,
      count: payload.urlList.length
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
      endpoint,
      count: payload.urlList.length
    };
  }
}

// CLI runner
async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes("--dry-run");
  const sitemapPath = path.join(projectRoot, "public", "sitemap.xml");

  let urls = [];
  const urlsIndex = args.indexOf("--urls");
  if (urlsIndex !== -1 && args[urlsIndex + 1]) {
    urls = args[urlsIndex + 1].split(",").map((u) => u.trim());
  } else {
    urls = extractUrlsFromSitemap(sitemapPath);
  }

  if (urls.length === 0) {
    console.error("❌ No URLs found to submit. Ensure public/sitemap.xml exists or pass --urls.");
    process.exit(1);
  }

  console.log(`🌐 Preparing IndexNow submission for ${urls.length} URLs (host: ${INDEXNOW_CONFIG.host})...`);
  const result = await submitToIndexNow({
    urls,
    dryRun: isDryRun
  });

  if (result.dryRun) {
    console.log(`🧪 [Dry-Run] Payload constructed successfully for ${result.count} URLs:`);
    console.log(JSON.stringify(result.payload, null, 2));
    console.log("✅ Dry-run check passed!");
  } else if (result.success) {
    console.log(`✅ IndexNow submission successful! Status: ${result.status}, Count: ${result.count}`);
  } else {
    console.error(`❌ IndexNow submission failed: ${result.error || result.status}`);
    process.exit(1);
  }
}

if (process.argv[1] && process.argv[1].endsWith("submit-indexnow.mjs")) {
  main().catch((err) => {
    console.error("❌ Fatal submit-indexnow error:", err);
    process.exit(1);
  });
}
