---
layout: page
title: "Side Quest"
permalink: /sidequest/
---

# Side Quest — OSS Model Feasibility on Azure AI Foundry

**Challenge:** validate whether five open-source models can be onboarded to Azure AI
Foundry, the recommended path, the compute, blockers, and a status label. Findings
are grounded in verified sources; anything unconfirmed is flagged. Verified June 2026.

**Legend:** ✅ Supported · ⚠️ Conditional · ❌ Not directly supported

## Feasibility Table

| Model | Catalog | HF | Recommended Path | Compute (approx) | Status | Notes |
|---|---|---|---|---|---|---|
| Qwen3-4B-Instruct-2507 | ✅ | ✅ | Catalog (serverless / managed) | 1× L4 / A10 24GB | ✅ Supported | 4B, Apache-2.0, 256K ctx, vLLM. In Foundry catalog. |
| mistralai/Devstral-Small-2507 | ⚠️ | ✅ | Catalog or HF → managed endpoint | 1× A100-80GB (or 4090 quant) | ✅ Supported | 24B coding agent, Apache-2.0, 128K ctx, text-only. |
| Qwen3-VL-8B-Instruct | ⚠️ | ✅ | HF → managed endpoint (VLM serving) | 1× A100-40/80GB | ⚠️ Conditional | 8B vision-language; needs multimodal stack, not serverless. |
| Qwen3.6-35B-A3B-NVFP4 | ❌ | ⚠️ | BYOM (vLLM, FP4 GPU) | H100 / B200 (FP4) ~23GB | ⚠️ Conditional | Unverified naming; MoE + NVFP4 needs Hopper/Blackwell. |
| datalab-to/chandr | ❌ | ⚠️ | BYOM (custom container) | Unknown | ❌ Not supported | HF returns 401 (gated/unconfirmed); not in catalog. |

## Per-Model Detail

### ✅ Qwen3-4B-Instruct-2507
- **Catalog:** Yes — `ai.azure.com/catalog/models/qwen-qwen3-4b-instruct-2507`. **HF:** Yes.
- **Path:** Catalog serverless or managed endpoint. **Compute:** 1× L4/A10 fits 4B.
- **Blockers:** none. Apache-2.0, 256K context. **Status: ✅ Supported.**

### ✅ mistralai/Devstral-Small-2507
- **Catalog:** Mistral collection present; verify exact 2507 SKU. **HF:** Yes.
- **Path:** Catalog if listed, else HF → managed. **Compute:** 24B → A100-80GB fp16; runs on RTX 4090 quantized.
- **Blockers:** none material; Apache-2.0, text-only. **Status: ✅ Supported.**

### ⚠️ Qwen3-VL-8B-Instruct
- **Catalog:** not confirmed. **HF:** Yes (`Qwen/Qwen3-VL-8B-Instruct`).
- **Path:** HF → managed endpoint with VLM serving. **Compute:** A100-40/80GB.
- **Blockers:** multimodal image+text; no serverless path confirmed. **Status: ⚠️ Conditional.**

### ⚠️ Qwen3.6-35B-A3B-NVFP4
- **Catalog:** No. **HF:** unverified (NVFP4 quant; naming not confirmed by Qwen/Microsoft docs).
- **Path:** BYOM via vLLM. **Compute:** NVFP4 needs FP4 path → H100/B200, not A100/4090.
- **Blockers:** MoE + FP4 SKU scarcity; **docs do not confirm catalog support.** **Status: ⚠️ Conditional.**

### ❌ datalab-to/chandr
- **Catalog:** No. **HF:** 401 — gated or nonexistent; cannot verify size/arch/license.
- **Path:** BYOM custom container if access granted. **Compute:** unknown. **Status: ❌ Not directly supported.**

## Recommendation
Start with the two ✅ models via catalog. Pilot Qwen3-VL on a managed endpoint. Treat
Qwen3.6-NVFP4 and chandr as BYOM only — confirm access, license, and GPU SKU first.
