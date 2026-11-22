import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ALL_DOCS } from "../src/data/navigation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = "https://docs.darktu.com";
const today = new Date().toISOString().split("T")[0];
const outPath = path.resolve(__dirname, "../public/sitemap.xml");

// 读取已有 sitemap 中的 lastmod 映射，避免无变更构建时产生 Git 脏文件
const existingDates = new Map();
if (fs.existsSync(outPath)) {
  const existingXml = fs.readFileSync(outPath, "utf8");
  const regex = /<loc>(.*?)<\/loc>\s*<lastmod>(.*?)<\/lastmod>/g;
  let match;
  while ((match = regex.exec(existingXml)) !== null) {
    existingDates.set(match[1], match[2]);
  }
}

const homeUrl = `${baseUrl}/`;
const homeDate = process.env.UPDATE_ALL_DATES ? today : (existingDates.get(homeUrl) || today);

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${homeUrl}</loc>
    <lastmod>${homeDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
`;

ALL_DOCS.forEach((doc) => {
  const url = `${baseUrl}/#/${doc.slug}`;
  const docDate = process.env.UPDATE_ALL_DATES ? today : (existingDates.get(url) || today);
  const priority = doc.slug === "overview" ? "1.0" : (doc.slug === "syntax" ? "0.9" : "0.8");
  xml += `  <url>
    <loc>${url}</loc>
    <lastmod>${docDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>\n`;
});

xml += `</urlset>\n`;

const normalizedNew = xml.replace(/\r\n/g, "\n");
const normalizedOld = fs.existsSync(outPath) ? fs.readFileSync(outPath, "utf8").replace(/\r\n/g, "\n") : "";

if (normalizedNew !== normalizedOld) {
  fs.writeFileSync(outPath, xml, "utf8");
  console.log(`✅ Updated sitemap.xml with ${ALL_DOCS.length + 1} URLs at ${outPath}`);
} else {
  console.log(`✅ sitemap.xml is up to date (${ALL_DOCS.length + 1} URLs, no date churn)`);
}
