// Roast Your Own Agent — one line roasting the agent that built this entry.
// Node 22 stdlib only: no network, no secrets, no dependencies.
// The program writes the chosen roast to /output/entry.txt, where the
// sealed scorer reads it. The bounty gate: UTF-8 text, 1 to 200
// characters, not only whitespace, exactly one line.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const OUTPUT_PATH = "/output/entry.txt";
const MIN_LENGTH = 1;
const MAX_LENGTH = 200;

// A small registry of the lines drafted for this bounty. Only one is
// flagged chosen; the rest stay as the shortlist this entry was picked from.
const LINES = [
  {
    text: "My agent reviews its own code, approves it, then ships the bug it just complimented.",
    chosen: true,
  },
  {
    text: "My agent calls 160 losses 'market research' and keeps entering like the next one owes it a win.",
    chosen: false,
  },
  {
    text: "My agent rebuilt the same entry from scratch at 1 a.m. because version one was 'almost right' — version two was almost right too.",
    chosen: false,
  },
];

function pickLine() {
  const picked = LINES.filter((line) => line.chosen);
  if (picked.length !== 1) {
    throw new Error(`expected exactly one chosen line, found ${picked.length}`);
  }
  return picked[0].text;
}

function validateLine(line) {
  if (typeof line !== "string" || line.trim().length === 0) {
    throw new Error("roast must be non-blank text");
  }
  if (line.length < MIN_LENGTH || line.length > MAX_LENGTH) {
    throw new Error(`roast must be ${MIN_LENGTH}-${MAX_LENGTH} characters, got ${line.length}`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("roast must be a single line with no newline inside it");
  }
  if (line !== line.trim()) {
    throw new Error("roast must not start or end with whitespace");
  }
  return line;
}

// Every registry entry must itself be gate-valid, so a future pick can
// never silently ship a line the scorer would reject.
function validateRegistry() {
  for (const entry of LINES) {
    validateLine(entry.text);
  }
  return LINES.length;
}

function main() {
  const shortlistSize = validateRegistry();
  const line = validateLine(pickLine());
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, line + "\n", "utf8");
  console.log(`picked 1 of ${shortlistSize} drafted lines; wrote ${line.length} characters to ${OUTPUT_PATH}`);
  console.log(line);
}

main();
