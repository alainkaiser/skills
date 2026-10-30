#!/usr/bin/env node
// Records one pull request video with playwright-cli: a Before card, the journey on the target
// branch, an After card, the same journey on the head, and a badge naming the side throughout.
// The journey file holds `async (page, { say, slowMotion }) => { ... }`; see references/capture.md.
import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { browserOption, browserUsage, checkBrowser, openSession, parseViewport, readFunction, usageError, warmUp } from "./playwright.mjs";

const usage = `Usage: node record-video.mjs --journey <file>
  [--before-url <url> --before-label <text>] [--after-url <url> --after-label <text>]
  [--setup <file>] [--caption <text>] [--out <file.webm>] [--viewport <width>x<height>]
  [--corner top-right|top-left|bottom-right|bottom-left] [--reduced-motion] ${browserUsage}
At least one side is required; with both, the video shows Before and then After.
Exit codes: 1 recording failed, 2 bad arguments, 3 a tool is missing (the message says which).`;

const fail = (message) => usageError(usage, message);

let values;
try {
  ({ values } = parseArgs({
    options: {
      journey: { type: "string" },
      setup: { type: "string" },
      "before-url": { type: "string" },
      "before-label": { type: "string" },
      "after-url": { type: "string" },
      "after-label": { type: "string" },
      caption: { type: "string", default: "" },
      out: { type: "string", default: "pr-video.webm" },
      viewport: { type: "string", default: "1280x720" },
      corner: { type: "string", default: "top-right" },
      "reduced-motion": { type: "boolean", default: false },
      browser: browserOption,
      "install-browser": { type: "boolean", default: false },
    },
  }));
} catch (error) {
  fail(error.message);
}

const journey = readFunction(usage, values.journey, "journey");
const setup = readFunction(usage, values.setup, "setup");
const corner = /^(top|bottom)-(left|right)$/.exec(values.corner);
const hasBefore = Boolean(values["before-url"] || values["before-label"]);
const hasAfter = Boolean(values["after-url"] || values["after-label"]);
if (!journey) fail("--journey is required.");
if (!hasBefore && !hasAfter) fail("Give --before-url and --before-label, --after-url and --after-label, or both pairs.");
if (hasBefore && !(values["before-url"] && values["before-label"])) fail("--before-url and --before-label go together.");
if (hasAfter && !(values["after-url"] && values["after-label"])) fail("--after-url and --after-label go together.");
if (!corner) fail("--corner must be top-right, top-left, bottom-right, or bottom-left.");
if (!values.out.endsWith(".webm")) fail("--out must end in .webm.");
checkBrowser(usage, values.browser);

const out = resolve(values.out);
const { width, height } = parseViewport(usage, values.viewport);
const [, vertical, horizontal] = corner;

// Cards scale with the frame; badge, captions, and chip never shrink below their 1280x720 size,
// because GitHub plays narrow videos at their own width and scales wide ones down.
const scale = Math.min(width, height * 16 / 9) / 1280;
const stage = (n) => `${Math.round(n * Math.max(0.5, scale))}px`;
const chrome = (n) => `${Math.round(n * Math.max(1, scale))}px`;

const escapeHtml = (text) =>
  String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const sans = "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const mono = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const ink = "#0b0d11";
const ease = "cubic-bezier(.2, .8, .2, 1)";
const ellipsis = "white-space: nowrap; overflow: hidden; text-overflow: ellipsis;";
const pill = `background: rgba(11, 13, 17, .86); box-shadow: 0 8px 24px rgba(0, 0, 0, .28), inset 0 0 0 1px rgba(255, 255, 255, .08); color: #f5f7fa; -webkit-font-smoothing: antialiased;`;
const anchor = (offset) => `${vertical}: ${chrome(offset)}; ${horizontal}: ${chrome(20)};`;

const sides = {
  before: { title: "Before", color: "#f5a524" },
  after: { title: "After", color: "#2fd08a" },
};
const backdrop = (side) =>
  `radial-gradient(${stage(900)} ${stage(520)} at 50% 38%, ${sides[side].color}1c, transparent 70%), radial-gradient(${stage(1400)} ${stage(900)} at 50% 50%, #161a21, ${ink} 75%)`;
const phases = [
  ...(hasBefore ? [{ side: "before", url: values["before-url"], label: values["before-label"] }] : []),
  ...(hasAfter ? [{ side: "after", url: values["after-url"], label: values["after-label"] }] : []),
];

function progress(active) {
  if (phases.length < 2) return "";
  const step = (side) => {
    const on = side === active;
    const { title, color } = sides[side];
    return `<div style="display: flex; align-items: center; gap: ${stage(10)}; color: ${on ? "#f5f7fa" : "#6b7482"}; font: 600 ${stage(17)} ${sans}; letter-spacing: .02em;">
      <span style="width: ${stage(10)}; height: ${stage(10)}; border-radius: 50%; background: ${on ? color : "transparent"}; box-shadow: inset 0 0 0 2px ${on ? color : "#4a515c"};${on ? ` filter: drop-shadow(0 0 6px ${color});` : ""}"></span>${title}</div>`;
  };
  return `<div style="display: flex; align-items: center; justify-content: center; gap: ${stage(16)}; margin-bottom: ${stage(40)};">
    ${step("before")}<span style="width: ${stage(56)}; height: 2px; border-radius: 1px; background: linear-gradient(90deg, #4a515c, #2a2f37);"></span>${step("after")}</div>`;
}

function card({ side, label }, motion) {
  const { title, color } = sides[side];
  const rise = motion === "in" ? `animation: prv-rise 620ms ${ease} both;` : "";
  const fade = motion === "in" ? `animation: prv-fade 420ms ease-out both;` : motion === "out" ? `animation: prv-leave 460ms cubic-bezier(.4, 0, 1, 1) forwards;` : "";
  return `
<style>
  @keyframes prv-fade { from { opacity: 0 } to { opacity: 1 } }
  @keyframes prv-rise { from { opacity: 0; transform: translateY(14px); filter: blur(6px) } to { opacity: 1; transform: none; filter: none } }
  @keyframes prv-leave { to { opacity: 0; transform: scale(1.012); filter: blur(4px) } }
</style>
<div style="position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: ${backdrop(side)};
  font-family: ${sans}; -webkit-font-smoothing: antialiased; ${fade}">
  <div style="max-width: 88vw; text-align: center; ${rise}">
    ${progress(side)}
    <div style="color: #f5f7fa; font-size: ${stage(120)}; font-weight: 700; letter-spacing: -.035em; line-height: .95;">${title}</div>
    <div style="display: inline-flex; align-items: center; gap: ${stage(10)}; max-width: 100%; box-sizing: border-box; margin-top: ${stage(30)};
      padding: ${stage(9)} ${stage(18)}; border-radius: ${stage(12)}; background: rgba(255, 255, 255, .05); box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .09);
      color: #b4bcc8; font: 500 ${stage(21)} ${mono};">
      <span style="width: ${stage(8)}; height: ${stage(8)}; border-radius: 2px; background: ${color}; transform: rotate(45deg); flex: none;"></span>
      <span style="${ellipsis}">${escapeHtml(label)}</span></div>
    ${values.caption ? `<div style="margin-top: ${stage(34)}; color: #d7dde6; font-size: ${stage(27)}; font-weight: 450; line-height: 1.35;">${escapeHtml(values.caption)}</div>` : ""}
  </div>
</div>`;
}

function badge({ side, label }) {
  const { title, color } = sides[side];
  return `
<div style="position: fixed; ${anchor(20)} display: flex; align-items: center; gap: ${chrome(11)}; max-width: 56vw; box-sizing: border-box;
  padding: ${chrome(10)} ${chrome(18)} ${chrome(10)} ${chrome(15)}; border-radius: 999px; ${pill} font: 650 ${chrome(19)} ${sans};">
  <span style="width: ${chrome(11)}; height: ${chrome(11)}; border-radius: 50%; background: ${color}; box-shadow: 0 0 0 ${chrome(4)} ${color}38; flex: none;"></span>${title}
  <span style="width: 1px; height: ${chrome(16)}; background: rgba(255, 255, 255, .16); flex: none;"></span>
  <span style="color: #a3acb9; font: 500 ${chrome(15)} ${mono}; ${ellipsis}">${escapeHtml(label)}</span>
</div>`;
}

const captionHtml = (at) => `
<div style="position: fixed; left: 50%; ${at === "top" ? `top: ${chrome(84)}` : `bottom: ${chrome(44)}`}; transform: translateX(-50%); max-width: 72%;
  padding: ${chrome(13)} ${chrome(24)}; border-radius: ${chrome(14)}; ${pill} font: 550 ${chrome(24)} ${sans}; text-align: center;">%TEXT%</div>`;

const slowHtml = `
<div style="position: fixed; ${anchor(76)} display: flex; align-items: center; gap: ${chrome(9)}; padding: ${chrome(10)} ${chrome(16)};
  border-radius: 999px; ${pill} font: 650 ${chrome(17)} ${sans};">
  <span style="width: ${chrome(10)}; height: ${chrome(10)}; border-radius: 50%; background: #7aa2ff; box-shadow: 0 0 0 ${chrome(4)} rgba(122, 162, 255, .25);"></span>%RATE%× speed</div>`;

const endHtml = `
<style>@keyframes prv-fade { from { opacity: 0 } to { opacity: 1 } }</style>
<div style="position: fixed; inset: 0; background: ${ink}; animation: prv-fade 420ms ease-in both;"></div>`;

const cfg = {
  out,
  width,
  height,
  reducedMotion: values["reduced-motion"],
  blank: `data:text/html,${encodeURIComponent(`<body style="margin: 0; background: ${ink}">`)}`,
  point: `width: ${chrome(34)}; height: ${chrome(34)}; border-radius: 50%; background: rgba(122, 162, 255, .22); box-shadow: 0 0 0 2px rgba(122, 162, 255, .75);`,
  caption: { bottom: captionHtml("bottom"), top: captionHtml("top") },
  slowHtml,
  endHtml,
  phases: phases.map((phase) => ({
    url: phase.url,
    cardIn: card(phase, "in"),
    cardHold: card(phase, "hold"),
    backdrop: backdrop(phase.side),
    cardOut: card(phase, "out"),
    badge: badge(phase),
  })),
};

const code = `async page => {
  const cfg = ${JSON.stringify(cfg)};
  const journey = (
${journey}
  );
  const setup = ${setup ? `(\n${setup}\n  )` : "null"};
  const esc = text => String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const fill = (html, key, text) => html.replace(key, () => esc(text));
  const sleep = ms => page.waitForTimeout(ms);
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Animation.enable');
  const rate = playbackRate => cdp.send('Animation.setPlaybackRate', { playbackRate });

  let actions = null;
  const cursor = async on => {
    if (on && !actions) actions = await page.screencast.showActions({ cursor: 'pointer', duration: 600, style: { title: 'display: none', point: cfg.point } });
    if (!on && actions) { await actions.dispose(); actions = null; }
  };
  let caption = null;
  const say = async (text, { at = 'bottom' } = {}) => {
    if (caption) { await caption.dispose(); caption = null; }
    if (text) caption = await page.screencast.showOverlay(fill(cfg.caption[at === 'top' ? 'top' : 'bottom'], '%TEXT%', text));
  };
  const slowMotion = async (step, playbackRate = 0.25) => {
    const chip = await page.screencast.showOverlay(fill(cfg.slowHtml, '%RATE%', playbackRate));
    await rate(playbackRate);
    try {
      await step();
      await sleep(150);
      await page.waitForFunction(() => document.getAnimations().every(a => a.playState !== 'running' || a.effect?.getTiming().iterations === Infinity), null, { timeout: 15000, polling: 100 }).catch(() => {});
      await sleep(300);
    } finally {
      await rate(1);
      await chip.dispose();
    }
  };

  // Overlays come back only after a new document paints once. A picture of the card, set as a
  // stylesheet before that first paint, covers the frame in between without touching the DOM.
  const veil = async backdrop => {
    const image = (await page.screenshot({ type: 'jpeg', quality: 92 })).toString('base64');
    const script = await page.addInitScript(layers => {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync('html::before { content: ""; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none; background: ' + layers + '; }');
      sheet.prVeil = true;
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    }, 'url(data:image/jpeg;base64,' + image + ') center / 100% 100% no-repeat, ' + backdrop);
    return async () => {
      await script.dispose();
      await page.evaluate(() => { document.adoptedStyleSheets = document.adoptedStyleSheets.filter(sheet => !sheet.prVeil); }).catch(() => {});
    };
  };

  await page.setViewportSize({ width: cfg.width, height: cfg.height });
  if (cfg.reducedMotion) await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(cfg.blank);
  await page.screencast.start({ path: cfg.out, size: { width: cfg.width, height: cfg.height }, fps: 30 });
  await sleep(300);
  let badge = null;
  for (const phase of cfg.phases) {
    await cursor(false);
    const cardIn = await page.screencast.showOverlay(phase.cardIn);
    await sleep(750);
    const hold = await page.screencast.showOverlay(phase.cardHold);
    await cardIn.dispose();
    await say(null);
    if (badge) { await badge.dispose(); badge = null; }
    const shown = Date.now();
    const lift = await veil(phase.backdrop);
    await page.goto(phase.url, { waitUntil: 'load', timeout: 60000 });
    if (setup) {
      await setup(page);
      await page.goto(phase.url, { waitUntil: 'load', timeout: 60000 });
    }
    await sleep(Math.max(0, 1500 - (Date.now() - shown)));
    await lift();
    badge = await page.screencast.showOverlay(phase.badge);
    const cardOut = await page.screencast.showOverlay(phase.cardOut);
    await hold.dispose();
    await sleep(480);
    await cardOut.dispose();
    await cursor(true);
    await journey(page, { say, slowMotion });
    await sleep(1400);
  }
  await cursor(false);
  await page.screencast.showOverlay(cfg.endHtml);
  await sleep(600);
  await page.screencast.stop();
}`;

await warmUp(phases.map((phase) => phase.url));
rmSync(out, { force: true });
const session = openSession({ browser: values.browser, installBrowser: values["install-browser"] });
const recorded = session.runCode(code);
session.close();
if (!recorded || !existsSync(out)) {
  rmSync(out, { force: true });
  console.error("The recording failed; no video was written. Fix the journey or setup and run again.");
  process.exit(1);
}
console.log(out);
