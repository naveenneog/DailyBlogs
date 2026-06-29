# DailyBlogs

A general-topic GitHub Pages blog (Jekyll + minima) on cloud, AI, and engineering.

## Contents
- **Flagship post:** `_posts/2026-06-29-onboarding-oss-models-azure-ai-foundry.md` — onboarding open-source models into Azure AI Foundry.
- **Side quest:** [`sidequest.md`](sidequest.md) — feasibility check of 5 OSS models (✅/⚠️/❌, compute, blockers, paths).

## Run locally
```bash
bundle install
bundle exec jekyll serve   # http://127.0.0.1:4000/DailyBlogs
```

## Publish to GitHub Pages
1. Create repo `naveenneog/DailyBlogs`, push `main`.
2. Settings → Pages → Source: **Deploy from branch** → `main` / root.
3. Site: `https://naveenneog.github.io/DailyBlogs`.
