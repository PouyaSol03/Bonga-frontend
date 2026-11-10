import { readdirSync, readFileSync } from "node:fs";
import { dirname, extname, relative, resolve, sep } from "node:path";
import ts from "typescript";

const root = resolve("src");
const files = [];
function visit(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) visit(path);
    else if (/\.tsx?$/.test(entry.name)) files.push(path);
  }
}
visit(root);
const known = new Set(files);
const graph = new Map();
const violations = [];
const display = (path) => relative(process.cwd(), path).split(sep).join("/");

for (const path of files) {
  const source = ts.createSourceFile(
    path,
    readFileSync(path, "utf8"),
    ts.ScriptTarget.Latest,
    true,
  );
  const edges = new Set();
  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement) && !ts.isExportDeclaration(statement)) continue;
    if (!statement.moduleSpecifier || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
    const specifier = statement.moduleSpecifier.text;
    if (!specifier.startsWith(".")) continue;
    const base = resolve(dirname(path), specifier);
    const target = [
      base,
      `${base}.ts`,
      `${base}.tsx`,
      resolve(base, "index.ts"),
      resolve(base, "index.tsx"),
    ].find((candidate) => known.has(candidate));
    if (!target) continue;
    if (display(path).startsWith("src/shared/") && /^src\/(features|app)\//.test(display(target))) {
      violations.push(`${display(path)} imports ${display(target)}`);
    }
    if (ts.isImportDeclaration(statement)) {
      const clause = statement.importClause;
      if (clause?.isTypeOnly) continue;
      if (
        clause &&
        !clause.name &&
        clause.namedBindings &&
        ts.isNamedImports(clause.namedBindings) &&
        clause.namedBindings.elements.length &&
        clause.namedBindings.elements.every((item) => item.isTypeOnly)
      )
        continue;
    } else {
      if (statement.isTypeOnly) continue;
      if (
        statement.exportClause &&
        ts.isNamedExports(statement.exportClause) &&
        statement.exportClause.elements.length &&
        statement.exportClause.elements.every((item) => item.isTypeOnly)
      )
        continue;
    }
    edges.add(target);
  }
  graph.set(path, edges);
}

let index = 0;
const indices = new Map();
const low = new Map();
const stack = [];
const active = new Set();
const cycles = [];
function connect(path) {
  indices.set(path, index);
  low.set(path, index++);
  stack.push(path);
  active.add(path);
  for (const target of graph.get(path)) {
    if (!indices.has(target)) {
      connect(target);
      low.set(path, Math.min(low.get(path), low.get(target)));
    } else if (active.has(target)) low.set(path, Math.min(low.get(path), indices.get(target)));
  }
  if (indices.get(path) !== low.get(path)) return;
  const group = [];
  let target;
  do {
    target = stack.pop();
    active.delete(target);
    group.push(target);
  } while (target !== path);
  if (group.length > 1 || graph.get(path).has(path)) cycles.push(group.map(display).sort());
}
for (const path of files) if (!indices.has(path)) connect(path);
for (const violation of violations) process.stderr.write(`${violation}\n`);
for (const cycle of cycles) process.stderr.write(`Runtime cycle: ${cycle.join(", ")}\n`);
process.stdout.write(
  `${files.length} modules checked; ${cycles.length} runtime cycle groups; ${violations.length} shared-layer violations.\n`,
);
process.exitCode = cycles.length || violations.length ? 1 : 0;
