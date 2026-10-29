# Capture and Attach Visuals

Screenshots and videos for a pull request's visuals. Capture the before state on the target branch and the after state on the head branch, with the same viewport, data, and journey.

Run the target branch from a worktree beside the repository, so the working tree stays untouched: `git fetch origin`, then `git worktree add ../<repo>-before origin/<target branch>`. Install its dependencies and start it the way the repository's docs say. Remove it afterwards with `git worktree remove ../<repo>-before`.

Save every file in a temporary directory outside the repository, so nothing lands in the diff, and run the capture commands from there.

## Screenshots

Take each pair at the same viewport with the browser tool you have. Name files by state, screen, and width: `before-dashboard-375.png`, `after-dashboard-375.png`.

- **Theme rows:** switch the theme with the app's own theme control, or emulate the system setting when the app follows it, for example `playwright-cli -s=<session> set-color-scheme dark`.
- **Design comparison:** export the design frame at its own width and screenshot the built screen at that width: `design-checkout-375.png`, `built-checkout-375.png`.

## Videos

`scripts/record-video.mjs` records the whole video in one run: a "Before" card, the journey on the target branch, an "After" card, the same journey on the head branch, and a badge naming the side throughout. Each card covers the page while the next app loads, so no loading screen shows. The script sits in the folder that holds this skill's `SKILL.md`, usually `~/.agents/skills/git-workflow` or `~/.claude/skills/git-workflow`. It needs Node and runs `playwright-cli`, or `npx --yes @playwright/cli` when that is not installed.

1. Start both versions at once: the target branch from its worktree on one port, the head branch on another. Give one URL the host `127.0.0.1` and the other `localhost`: the browser keeps cookies per host name, not per port, so this keeps the two sign-ins apart. The script loads each URL once before recording, so a dev server compiles before the camera runs.
2. Write the journey, the steps a user takes, to a file such as `journey.js`:

   ```js
   async (page, { say, slowMotion }) => {
     await say('Enter the email');
     await page.getByRole('textbox', { name: 'Email' }).fill('reviewer@example.com');
     await page.getByRole('button', { name: 'Continue' }).click();
     await say('Pay with the saved card');
     await page.getByRole('radio', { name: 'Visa ending 4242' }).check();
     await page.getByRole('button', { name: 'Pay' }).click();
   }
   ```

   - `page` is a Playwright page. Each action shows an animated cursor and waits for it, so the journey needs no pauses.
   - `say(text)` shows a caption at the bottom until the next `say`; `say(null)` removes it. One short caption per step reads best. `say(text, { at: 'top' })` moves it up when it would cover a button the journey uses.
   - Type test accounts and test data only; the video shows everything typed.
3. Record:

   ```bash
   node "<skill folder>/scripts/record-video.mjs" --journey journey.js \
     --before-url http://127.0.0.1:3001/checkout --before-label main \
     --after-url http://localhost:3000/checkout --after-label feat/FD-127-saved-cards \
     --caption "Checkout with a saved card"
   ```

   The script writes `pr-video.webm` at 1280x720 and prints its path; `--out` and `--viewport` change both. When any step fails, it prints the error and writes no video: fix the journey and run it again.

- `--setup setup.js` runs `async page => { ... }` under each card, out of view, for example to sign in with a test account; the script then reloads the recorded URL.
- `--corner top-left`, `bottom-right`, or `bottom-left` moves the side badge when it covers something the reviewer must see. It starts top-right.
- A flow that has no before gets only `--after-url` and `--after-label`.
- When the two versions cannot run at the same time, for example because they share a database with different migrations, record each side alone into `before.webm` and `after.webm`.

### Motion

For an animation or transition change, slow only the step that starts the motion. Move the cursor to the element first, then run the step inside `slowMotion`. It plays every CSS transition, CSS animation, and Web Animation at quarter speed, shows a "0.25× speed" chip, and returns to normal speed once the motion ends:

```js
const open = page.getByRole('button', { name: 'Open filters' });
await open.hover();
await slowMotion(() => open.click());
```

`slowMotion(step, 0.5)` picks another rate. An animation that a script moves frame by frame keeps its speed. For the reduced-motion video, record the head branch alone with `--reduced-motion --caption "Reduced motion on"`.

### Format

GitHub recommends H.264 for playback in every browser. When `ffmpeg` is on PATH, convert each video: `ffmpeg -i pr-video.webm -c:v libx264 -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -movflags +faststart pr-video.mp4`. Otherwise attach the WebM.

## Attach

Run `gh` from the capture directory so relative references resolve, and name the repository and branch, which `gh` cannot read outside a checkout: `gh pr create --repo <owner>/<repo> --head <branch> …` or `gh pr edit <number> --repo <owner>/<repo> …`. Reference each file in the body by its relative path and pass one `--attach` per file; `gh` uploads the files and rewrites the references.

- An image may sit in a table cell: `![after: dashboard at 375px](./after-dashboard-375.png)`.
- A video renders as a player only when its reference is alone in its paragraph: `![](./pr-video.webm)`. Two separate videos each get a bold label line, **Before** and **After**, in its own paragraph above the video.
- GitHub takes images up to 10 MB, and videos up to 10 MB, or 100 MB in a repository on a paid plan.
- When some uploads fail, `gh` still creates or updates the pull request and exits non-zero; attach the files that failed again with `gh pr edit`.
- A `gh` older than 2.99.0 has no `--attach`: mark each place with its file name as an HTML comment instead and list the absolute paths in your reply so the user can drag each file in on GitHub.
