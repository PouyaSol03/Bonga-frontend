import { expect, test } from "vitest";
import { countPhysicalLines } from "../../scripts/check-file-lines.mjs";

test.each([
  ["", 0],
  ["one", 1],
  ["one\n", 1],
  ["one\n\n", 2],
  ["one\r\ntwo\r\n", 2],
  ["// comment\n\ncode\n", 3],
] as const)("counts physical lines including blanks and comments: %j", (text, lines) => {
  expect(countPhysicalLines(text)).toBe(lines);
});
