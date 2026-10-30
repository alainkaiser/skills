// Shared by screenshot.mjs and record-video.mjs: finds playwright-cli, opens a browser in a
// private session, runs Playwright code in it, and stops with exit code 3 when a tool is missing.
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const MISSING_TOOL = 3;

export function usageError(usage, message) {
  console.error(`${message}\n\n${usage}`);
  process.exit(2);
}

export function readFunction(usage, file, option) {
  if (!file) return null;
  if (!existsSync(file)) usageError(usage, `--${option} file not found: ${file}`);
  return readFileSync(file, "utf8").trim().replace(/;$/, "");
}

export function parseViewport(usage, value) {
  const match = /^(\d{3,4})x(\d{3,4})$/.exec(value);
  if (!match) usageError(usage, "--viewport must look like 1280x720.");
  return { width: Number(match[1]), height: Number(match[2]) };
}

// A first request makes dev servers compile the page now, not while the browser waits on it.
export async function warmUp(urls) {
  for (const url of urls) {
    try {
      await fetch(url, { signal: AbortSignal.timeout(180000) });
    } catch (error) {
      console.error(`Could not load ${url} (${error.cause?.code ?? error.message}). Start the app and run again.`);
      process.exit(1);
    }
  }
}

const windows = process.platform === "win32";
const quote = (arg) => (windows && /[\s"&<>|^]/.test(arg) ? `"${arg.replace(/"/g, '""')}"` : arg);
const minimum = [0, 1, 22];

function resolveCli() {
  const probe = spawnSync("playwright-cli", ["--version"], { encoding: "utf8", shell: windows });
  const found = (/(\d+)\.(\d+)\.(\d+)/.exec(probe.stdout ?? "") ?? []).slice(1).map(Number);
  const current = probe.status === 0 && found.length === 3 && (found[0] - minimum[0] || found[1] - minimum[1] || found[2] - minimum[2]) >= 0;
  return current ? ["playwright-cli", []] : ["npx", ["--yes", "@playwright/cli@0.1"]];
}

export function openSession({ browser, installBrowser }) {
  const [command, prefix] = resolveCli();
  const name = `-s=pr-visual-${process.pid}`;
  const cli = (...args) =>
    spawnSync(command, [...prefix, ...args].map(quote), { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8", shell: windows });
  const run = (...args) => cli(name, ...args);
  const output = (result) => `${result.stdout ?? ""}${result.stderr ?? ""}`;
  const work = mkdtempSync(join(tmpdir(), "pr-visual-"));

  const close = () => {
    run("close");
    rmSync(work, { recursive: true, force: true });
  };

  const open = () => {
    if (browser === "chrome") {
      const chrome = run("open");
      if (chrome.status === 0) return;
      if (!/is not found/.test(output(chrome))) return fail(chrome, "Could not open Google Chrome.");
      run("close");
    }
    let chromium = run("open", "--browser=chromium");
    if (chromium.status !== 0 && /is not installed/.test(output(chromium))) {
      if (!installBrowser) {
        close();
        const missing = browser === "chrome" ? "Google Chrome is not installed, and neither is Playwright's Chrome for Testing." : "Playwright's Chrome for Testing is not installed.";
        console.error(`No browser to capture with: ${missing}
Ask the user before downloading Chrome for Testing (about 200 MB, into the user's Playwright cache, no admin rights).
After a yes, run this command again with --install-browser.`);
        process.exit(MISSING_TOOL);
      }
      const install = cli("install-browser", "chrome-for-testing");
      if (install.status !== 0) return fail(install, "Installing Chrome for Testing failed.");
      run("close");
      chromium = run("open", "--browser=chromium");
    }
    if (chromium.status !== 0) return fail(chromium, "Could not open Chrome for Testing.");
  };

  function fail(result, message) {
    process.stderr.write(output(result));
    close();
    console.error(message);
    process.exit(1);
  }

  // Runs `async page => { ... }` source in the browser; returns false after printing the error.
  const runCode = (code) => {
    const file = join(work, "code.js");
    writeFileSync(file, code);
    const result = run("run-code", "--filename", file);
    if (result.status !== 0 || /^### Error/m.test(result.stdout)) {
      process.stderr.write(output(result));
      return false;
    }
    return true;
  };

  open();
  return { runCode, close };
}

export const browserOption = { type: "string", default: "chrome" };
export const browserUsage = "[--browser chrome|chromium] [--install-browser]";
export function checkBrowser(usage, value) {
  if (value !== "chrome" && value !== "chromium") usageError(usage, "--browser must be chrome or chromium.");
}
