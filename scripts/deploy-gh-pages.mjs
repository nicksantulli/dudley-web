#!/usr/bin/env node
// Build the Astro site and publish dist/ to the `gh-pages` branch.
//
// Why this exists: GitHub Pages for this repo serves *legacy-style* from the
// `gh-pages` branch root (Settings → Pages → Source: gh-pages /). That means we
// can deploy by pushing built static files to that branch — no GitHub Actions
// workflow and no `pages`/`workflow` token scope required. Run any time content
// changes:  npm run deploy
//
// It uses a temporary git worktree so your working tree is never touched.

import { execSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';

const run = (cmd, opts = {}) => execSync(cmd, { stdio: 'inherit', ...opts });
const out = (cmd) => execSync(cmd, { encoding: 'utf8' }).trim();

const BRANCH = 'gh-pages';
const WORKTREE = '.gh-pages-worktree';
const DIST = 'dist';

// 1. Build
run('npm run build');
if (!existsSync(DIST)) throw new Error('dist/ not found after build');

// 2. Fresh worktree on gh-pages
run('git fetch origin gh-pages');
if (existsSync(WORKTREE)) run(`git worktree remove --force ${WORKTREE}`);
run(`git worktree add -B ${BRANCH} ${WORKTREE} origin/${BRANCH}`);

try {
  // 3. Replace branch contents with dist/ (preserve .git)
  run(`find ${WORKTREE} -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +`);
  run(`cp -R ${DIST}/. ${WORKTREE}/`);

  // 4. Commit + push if there are changes
  const status = out(`git -C ${WORKTREE} status --porcelain`);
  if (!status) {
    console.log('No changes to deploy.');
  } else {
    run(`git -C ${WORKTREE} add -A`);
    const sha = out('git rev-parse --short HEAD');
    run(`git -C ${WORKTREE} commit -m "deploy: build from ${sha}"`);
    run(`git -C ${WORKTREE} push origin ${BRANCH}`);
    console.log('\nDeployed to https://nicksantulli.github.io/dudley-web/');
  }
} finally {
  run(`git worktree remove --force ${WORKTREE}`);
  if (existsSync(WORKTREE)) rmSync(WORKTREE, { recursive: true, force: true });
}
