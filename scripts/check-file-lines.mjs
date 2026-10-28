import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const extensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".css"]);

export function countPhysicalLines(text) {
  if (!text) return 0;
  const lines = text.split(/\r\n|\n|\r/);
  return lines.length - (lines.at(-1) === "" ? 1 : 0);
}

export function collectOversizedFiles(paths, maximum = 200) {
  const oversized = [];
  function visit(path) {
    if (statSync(path).isDirectory()) {
      for (const entry of readdirSync(path)) visit(resolve(path, entry));
    } else if (extensions.has(extname(path))) {
      const lines = countPhysicalLines(readFileSync(path, "utf8"));
      if (lines > maximum) oversized.push({ path, lines });
    }
  }
  paths.forEach(visit);
  return oversized.sort(
    (left, right) => right.lines - left.lines || left.path.localeCompare(right.path),
  );
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const paths = process.argv.slice(2);
  const oversized = collectOversizedFiles(paths.length ? paths : ["src", "tests", "scripts"]);
  for (const file of oversized) process.stdout.write(`${file.lines}\t${file.path}\n`);
  process.stdout.write(`${oversized.length} files exceed 200 physical lines.\n`);
  process.exitCode = oversized.length ? 1 : 0;
}
