# Indo-Pacific Terminal — Conflict × Climate

A minimal OSINT-style dashboard monitoring **armed conflict** and **climate change** across the
**South and Southeast Asia** — 19 countries from Afghanistan to Timor-Leste, with China-based
outlets, wires, specialist and alert feeds region-gated. Maritime flashpoints remain fully covered
via shared vocabulary (South China Sea, Malacca, Bay of Bengal). Feeds from ~115 international, regional, local, specialist and alert sources are
fetched **server-side by GitHub Actions** every hour (no CORS, no proxies), classified, and
written to `data.json`. The dashboard (`index.html`) is a static page that reads that file.

## Setup (once, ~5 minutes)

1. Create a **public** GitHub repository (public = free unlimited Actions minutes + free Pages).
2. Upload everything in this folder to the repo root (keep the `.github/workflows/` path intact).
3. **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)` → Save.
4. **Actions tab** → select **update-feeds** → *Run workflow* (this generates the first `data.json`).
5. Open `https://<your-username>.github.io/<repo-name>/` — bookmark it. Done.

The cron then refreshes data hourly, on the hour (GitHub may delay scheduled runs by a few minutes).

## Things to know

- **Scheduled workflows pause after 60 days of repo inactivity.** Any commit (or clicking
  *Enable* in the Actions tab) revives them. Your own tweaks will usually keep it alive.
- **Bookmarks** are stored in your browser (localStorage), not in the repo. Use export/import in
  the Bookmarks view to back them up or move machines. They are designed to migrate into the
  planned desktop app.
- **Diagnostics**: the Sources drawer shows, per source, whether the native RSS worked
  (`native`) or it fell back to Google News (`gnews`), plus item counts — use it to spot dead
  native feed URLs, then fix them in `registry.mjs`.
- **Tuning**: sources live in `registry.mjs` (`SOURCES`), classification keywords in the same
  file (`AXES`, `THEATERS`). Edit, commit — the push itself triggers a fresh fetch.

## Roadmap

- Desktop app (fetch-on-launch) reusing `registry.mjs` + the classifiers + this UI unchanged.
- BenarNews / RFA re-added if their English services rebuild post-2025 funding cuts.
