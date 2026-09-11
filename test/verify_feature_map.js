import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const featureMapPath = path.join(projectRoot, 'docs', 'feature_map.md');

if (!fs.existsSync(featureMapPath)) {
    console.error("❌ docs/feature_map.md missing!");
    process.exit(1);
}

const entryUrl = pathToFileURL(path.join(projectRoot, 'src', 'index.js')).href;
const entry = await import(entryUrl);
if (typeof entry.main !== 'function') {
    console.error("❌ src/index.js main export missing!");
    process.exit(1);
}

console.log("✅ Feature Map Verification Passed!");
process.exit(0);
