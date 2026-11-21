import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ALL_DOCS } from "../src/data/navigation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = "https://docs.darktu.com";
const today = new Date().toISOString().split("T")[0];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
`;

ALL_DOCS.forEach((doc) => {
  const priority = doc.slug === "overview" ? "1.0" : (doc.slug === "syntax" ? "0.9" : "0.8");
  xml += `  <url>
    <loc>${baseUrl}/#/${doc.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>\n`;
});

xml += `</urlset>\n`;

const outPath = path.resolve(__dirname, "../public/sitemap.xml");
fs.writeFileSync(outPath, xml, "utf8");
console.log(`✅ Generated sitemap.xml with ${ALL_DOCS.length + 1} URLs at ${outPath}`);
