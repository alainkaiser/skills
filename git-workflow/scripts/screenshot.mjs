#!/usr/bin/env node
// Takes one pull request screenshot with playwright-cli at a given viewport and color scheme.
// --steps holds `async page => { ... }` that brings the page into the state to capture.
import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { browserOption, browserUsage, checkBrowser, openSession, parseViewport, readFunction, usageError, warmUp } from "./playwright.mjs";

const usage = `Usage: node screenshot.mjs --url <url> --out <file.png>
  [--viewport <width>x<height>] [--color-scheme light|dark] [--setup <file>] [--steps <file>] [--full-page] ${browserUsage}
Exit codes: 1 capture failed, 2 bad arguments, 3 a tool is missing (the message says which).`;

const fail = (message) => usageError(usage, message);

let values;
try {
  ({ values } = parseArgs({
    options: {
      url: { type: "string" },
      out: { type: "string" },
      viewport: { type: "string", default: "1280x720" },
      "color-scheme": { type: "string", default: "light" },
      setup: { type: "string" },
      steps: { type: "string" },
      "full-page": { type: "boolean", default: false },
      browser: browserOption,
      "install-browser": { type: "boolean", default: false },
    },
  }));
} catch (error) {
  fail(error.message);
}

if (!values.url) fail("--url is required.");
if (!values.out?.endsWith(".png")) fail("--out is required and must end in .png.");
if (values["color-scheme"] !== "light" && values["color-scheme"] !== "dark") fail("--color-scheme must be light or dark.");
checkBrowser(usage, values.browser);
const { width, height } = parseViewport(usage, values.viewport);
const setup = readFunction(usage, values.setup, "setup");
const steps = readFunction(usage, values.steps, "steps");
const out = resolve(values.out);

const cfg = { url: values.url, out, width, height, colorScheme: values["color-scheme"], fullPage: values["full-page"] };
const code = `async page => {
  const cfg = ${JSON.stringify(cfg)};
  const setup = ${setup ? `(\n${setup}\n  )` : "null"};
  const steps = ${steps ? `(\n${steps}\n  )` : "null"};
  await page.setViewportSize({ width: cfg.width, height: cfg.height });
  await page.emulateMedia({ colorScheme: cfg.colorScheme });
  await page.goto(cfg.url, { waitUntil: 'load', timeout: 60000 });
  if (setup) {
    await setup(page);
    await page.goto(cfg.url, { waitUntil: 'load', timeout: 60000 });
  }
  if (steps) await steps(page);
  await page.waitForTimeout(300);
  await page.screenshot({ path: cfg.out, fullPage: cfg.fullPage, animations: 'disabled' });
}`;

await warmUp([values.url]);
rmSync(out, { force: true });
const session = openSession({ browser: values.browser, installBrowser: values["install-browser"] });
const captured = session.runCode(code);
session.close();
if (!captured || !existsSync(out)) {
  rmSync(out, { force: true });
  console.error("The screenshot failed; no file was written. Fix the URL, setup, or steps and run again.");
  process.exit(1);
}
console.log(out);
