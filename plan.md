# DailyBlogs — GitHub Pages + Side Quest

## Goal
1. GitHub Pages blog (general topic, Jekyll/minima) ready to publish.
2. `sidequest.md` — feasibility validation of 5 OSS models on Azure AI Foundry.

## Deliverables
- `_config.yml`, `Gemfile`, `index.md`, `about.md` — site scaffold
- `_posts/2026-06-29-onboarding-oss-models-azure-ai-foundry.md` — flagship post
- `sidequest.md` — model feasibility (✅/⚠️/❌, compute, blockers, paths)
- `README.md`, `.gitignore`
- `git init`, offer publish to github.com/naveenneog

## Verified facts
- Devstral-Small-2507 = 24B, Apache-2.0, 128k ctx, text-only (finetune of Mistral-Small-3.1-24B)
- Qwen3-4B-Instruct-2507 = 4B, Apache-2.0, in Foundry catalog ✅
- Qwen3-VL-8B-Instruct = 8B VLM on HF, vision+text
- Qwen3.6-35B-A3B-NVFP4 = unverified, FP4/Blackwell-class, not in catalog
- datalab-to/chandr = HF 401 (gated/unconfirmed), not in catalog
