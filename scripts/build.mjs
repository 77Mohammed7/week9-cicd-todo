import { readFile, access, cp, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const requiredFiles = [
  "index.html", "src/styles.css", "src/app.js", "src/todo.js"
];

for (const filename of requiredFiles) {
  await access(join(root, filename));
}

const html = await readFile(join(root, "index.html"), "utf8");
if (!html.includes('href="./src/styles.css"') ||
    !html.includes('src="./src/app.js"')) {
  throw new Error("index.html is missing an expected stylesheet or script.");
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(join(root, "index.html"), join(dist, "index.html"));
await cp(join(root, "src"), join(dist, "src"), { recursive: true });

console.log("Build successful: validated source files and generated dist/.");
