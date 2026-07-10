---
title: 'Carving a Glowing 3D Army from Single Images: Hugging Face + Blender, driven by Copilot CLI Autopilot'
published: true
description: 'One AI concept image per piece → a free Hugging Face Space for image-to-3D → headless Blender for texture → a game-ready glowing GLB. No local GPU. The honest journey: the tools that failed, Blender''s real limits, rotating hero renders — and how GitHub Copilot CLI autopilot drove the whole thing.'
tags: 'huggingface, blender, ai, 3d'
cover_image: 'https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-07-10-image-to-3d/hero.jpg'
canonical_url: 'https://naveenneog.github.io/AI4Good/2026/07/10/image-to-3d-huggingface-blender-copilot/'
id: 4110965
date: '2026-07-10T07:54:18Z'
---

> **TL;DR** — One `gpt-image-2` concept image per piece → a **free Hugging Face Space** (`tencent/Hunyuan3D-2`) turns it into a raw 3D mesh → **headless Blender** projects the concept back on as texture → a web-ready **GLB** that glows in Three.js. No local GPU. All of it — the research, the scripts, the Hugging Face calls, the Blender runs, and *this very post and its auto-publish to DEV* — was orchestrated by **GitHub Copilot CLI in autopilot mode**.

![Glowing gold-vs-purple Chaturanga board](https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-07-10-image-to-3d/hero.jpg)

I've been building **[Chaturanga](https://naveenneog.github.io/Chaturanga)** — the ancient Indian "game of the four divisions," played with modern chess moves but authentic piece identities (*Raja, Mantri, Gaja, Ashva, Ratha, Padati*). The board above is the payoff. The hard part was the **pieces**: carved-ivory war figures with real silhouettes, in four themed armies, that spin in a WebGL inspector — built for **free, on a laptop with no GPU**, in a **fully scriptable** way.

Here's how that pipeline came together, including the parts that didn't work.

## The pipeline at a glance

![Image-to-3D pipeline diagram](https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-07-10-image-to-3d/pipeline.png)

Four stages, each free and headless:

1. **Concept** — Azure `gpt-image-2` renders a carved-ivory concept per piece (front 3/4, plain background).
2. **Image → 3D** — the concept goes to a **Hugging Face Space** that runs image-to-3D on donated GPU and returns a mesh.
3. **Texture** — **Blender 5.1**, headless on CPU, projects the concept image onto the mesh.
4. **Ship** — export a decimated, textured **GLB** and load it in Three.js with a little emissive glow.

## Step 2 is the heart: image → 3D on a free Hugging Face Space

Instead of buying GPU time, I call **[`tencent/Hunyuan3D-2`](https://huggingface.co/spaces/tencent/Hunyuan3D-2)** through its Gradio API. The Space runs the heavy diffusion-to-mesh step on **free ZeroGPU**; I just pull back a `.glb`:

```python
from gradio_client import Client, handle_file

client = Client("tencent/Hunyuan3D-2", hf_token=HF_TOKEN)   # token optional; helps rate limits
result = client.predict(
    image=handle_file("refs/raja.jpg"),
    steps=30, guidance_scale=5.0, seed=1234,
    octree_resolution=256, check_box_rembg=True,
    num_chunks=8000, randomize_seed=False,
    api_name="/shape_generation",     # geometry only — fast; texture done later in Blender
)
# result -> a raw .glb mesh, generated on someone else's GPU, for free
```

**No-signup fallback:** for a path that needs *zero* accounts, I keep **[`stabilityai/TripoSR`](https://huggingface.co/stabilityai/TripoSR)** (MIT) running **locally on CPU** — the only open image-to-3D model I found that's genuinely CPU-feasible on Windows.

### Discovering Spaces from the terminal

Copilot CLI has the **Hugging Face MCP server** wired in, so I search the Hub without leaving my shell. Asking for image-to-3D Spaces returns the exact shortlist this project lives on: `microsoft/TRELLIS.2` (⭐1.7k), `tencent/Hunyuan3D-2` (⭐3.3k, what I use), `TencentARC/InstantMesh` (⭐1.6k).

## From flat concept to spinning figure

The `gpt-image-2` concept on the left, the Hugging Face + Blender result on the right:

![Raja: concept vs 3D](https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-07-10-image-to-3d/concept-vs-3d-raja.png)
![Ashva: concept vs 3D](https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-07-10-image-to-3d/concept-vs-3d-ashva.png)

And on the turntable (Raja · Ashva · Gaja):

![Raja turntable](https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-07-10-image-to-3d/turntable-raja.gif)
![Ashva turntable](https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-07-10-image-to-3d/turntable-ashva.gif)
![Gaja turntable](https://raw.githubusercontent.com/naveenneog/AI4Good/main/assets/img/2026-07-10-image-to-3d/turntable-gaja.gif)

## Step 3 — Where Blender earns its keep (and where it fights back)

The Hugging Face mesh has a **correct silhouette but a soft surface**. The crisp carving detail lives in the concept image. So Blender's job is **concept-texture projection**: orient the mesh, frame an orthographic camera on its front, and set each vertex's UV to that camera's projection — so the concept *becomes* the surface.

```bash
blender -b --python tooling/blender/texture_project.py -- \
    raw/raja_hunyuan.glb refs/raja.jpg web/raja.glb preview.png
# headless CPU: orient -> project concept as texture -> decimate to ~28k faces -> export GLB
```

The honest limitations I hit:

- **Back faces get a mirrored projection.** Single-camera projection is perfect head-on; the reverse is a mirror. For board pieces seen from above, an acceptable trade — but a trade.
- **Blender 4 → 5 broke my material scripts.** Principled BSDF sockets were renamed: `Subsurface Weight` not `Subsurface`, `Specular IOR Level` not `Specular`. `KeyError` until I re-bound each one.
- **Eevee Next won't render headless on Windows.** `blender -b` with new Eevee crashes with an access violation — it wants a GPU context a background process lacks. **Cycles on CPU** renders fine; every image here is Cycles-CPU.
- **No native build allowed.** Marching cubes runs via **PyMCubes**, not a compiled extension, to stay laptop-reproducible.

**The detour:** I first tried **Blender-only** procedural modeling (skin modifier, geometry nodes, baked PBR). Fully scriptable, GPU-free… and it produced **primitive blobs after hours**. Great for *finishing*, wrong tool for *creating* organic figures. That failure is why the Hugging Face step exists.

## The tools I tried — and where they hit a wall

Constraints on purpose: **free, Windows, no GPU, scriptable.**

| Tool | Route | Verdict under my constraints |
|------|-------|------------------------------|
| **Hunyuan3D-2 (HF Space)** | image→mesh, free ZeroGPU | ✅ **Winner** — GPU-quality geometry, no local GPU |
| **TripoSR** (local) | image→mesh, CPU | ✅ Fallback — only CPU-feasible local model |
| Meshy AI | REST API, 200 credits/mo | ⚠️ Great, but ~6 textured pieces/mo, CC-BY |
| Tripo AI | REST API, 300 credits/mo | ⚠️ Good, but 15 downloads/mo |
| Rodin (Hyper3D) | REST API, pay-on-export | ⚠️ Best detail, but credits burn on download |
| InstantMesh / TRELLIS / Wonder3D | local | ❌ **Not CPU-feasible** — CUDA-only |

The pattern: hosted APIs are excellent but **metered**; the best local models need a **GPU I don't have**. The escape hatch is a **community-hosted Hugging Face Space** — the model runs on donated GPU and I pay nothing but a queue wait.

## The meta-story: built in Copilot CLI autopilot mode

I didn't hand-write most of this. I drove **GitHub Copilot CLI in autopilot mode** — where the agent runs shell commands, scripts, and tools **autonomously**, multi-step, without stopping for approval each move:

- a **research sub-agent** fanned out across 13 image-to-3D tools and returned a sourced comparison;
- the agent **wrote and ran** the batch driver, called the Hunyuan3D-2 Space, and retried on ZeroGPU hiccups;
- **headless Blender** runs for texture and the turntables above — it caught the Eevee-headless crash and switched to Cycles itself;
- and **this post** — rendered GIFs, diagram, prose — plus the **GitHub Actions workflow that auto-published it to DEV** on push.

## Results & what's next

A full **four-world** army — Kurukshetra, Ramayana, Kalinga, Devasura — each piece a real 3D figure with a themed material and emissive bloom.

**Try it:** the game is live at **[naveenneog.github.io/Chaturanga](https://naveenneog.github.io/Chaturanga)**.

{% embed https://github.com/naveenneog/Chaturanga %}

**Steal the pipeline:** `gpt-image-2` → `tencent/Hunyuan3D-2` Space → Blender projection → GLB. Free, no GPU, every step a script. For game assets, product mockups, or avatars, a free Hugging Face Space is the cheat code — and Copilot CLI autopilot stitches it all together.

*Built one day at a time. — [@naveenneog](https://github.com/naveenneog)*
