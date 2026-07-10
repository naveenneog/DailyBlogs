---
layout: post
title: "Chaturanga: Ancient Indian Chess, Reborn in Glowing 3D"
date: 2026-07-09 10:00:00 +0530
categories: ai4good showcase
tags: [ai4good, chess, threejs, huggingface, teaching-ai, heritage]
image: /assets/img/2026-07-10-ai4good-app-a-day/shot-chaturanga.png
excerpt: "Chaturanga is the ancient Indian game of the four divisions — played with modern chess rules but authentic piece identities, carved in real-time glowing 3D. A free, offline chess tutor with a five-level teaching AI, a coach, and an openings trainer."
---

{% assign shot = '/assets/img/2026-07-10-ai4good-app-a-day' %}

> Part of the **[#AI4Good](/AI4Good/2026/07/10/ai4good-an-app-a-day/)** series — one app a day, each built for good.

[![Chaturanga — ancient Indian chess, reborn in glowing 3D]({{ shot | append: '/shot-chaturanga.png' | relative_url }})](https://naveenneog.github.io/Chaturanga/)

Chess was born in India as **Chaturanga** — the "game of the four divisions." Chaturanga the app plays by modern chess rules but keeps the ancient identities — *Raja, Mantri, Gaja, Ashva, Ratha, Padati* — and lets you actually **learn** the game instead of just losing it.

## What it is

[**Chaturanga**](https://naveenneog.github.io/Chaturanga/) is ancient chess in **real-time glowing 3D**, with a full teach-and-play layer:

- **Play the Guru** — an alpha-beta chess AI with **five difficulty levels** (Padati → Mantri), running in a **Web Worker** so the board stays smooth on phones.
- **A coach** — a **Hint** that names the best move *and why*, plus a **blunder review** that gently flags mistakes and shows the stronger move.
- **Openings trainer** — six classic openings (Italian, Ruy López, Sicilian, French, Queen's Gambit, King's Indian) walked **move-by-move** with a narrated lesson.
- **Piece inspector** — tap a piece for a **rotating 3D render** and a diagram of how it moves and captures; a **Warrior's Eye** camera looks across the board from a piece's point of view.
- **Four themed worlds**, each with its own army, board art, teachings and a portrait cinematic intro. Local hotseat, undo, captured-pieces tray, under-promotion, read-aloud narration — **no backend, works offline**.

## How it was built

The web app is deliberately **buildless** — **vanilla ES modules**, [chess.js](https://github.com/jhlywa/chess.js) for the rules, [three.js](https://threejs.org/) for rendering, Capacitor for Android. The interesting parts:

- **A real chess engine, in the browser.** The AI is **alpha-beta negamax with quiescence search, MVV-LVA move ordering, and piece-square evaluation** over chess.js, exposed as `analyze()` / `bestMove()` / `classifyMove()`. It runs in a **Web Worker** (with a main-thread fallback) so search never janks the render loop, and the five levels scale depth, blunder-rate and time cap. Root moves are searched **full-window** so every move gets an exact score — which is what makes the coach's **blunder detection** possible.
- **The pieces are AI-reconstructed, not hand-modelled.** Each one starts as a themed **`gpt-image-2`** concept, becomes a mesh via the **free Hunyuan3D-2 Hugging Face Space**, gets its concept **projected back on as texture in headless Blender**, and ships as a small web GLB. Portrait intros are generated with **Azure Sora-2**. [The full image-to-3D pipeline is its own post here]({{ '/2026/07/10/image-to-3d-huggingface-blender-copilot/' | relative_url }}).
- Tested with `node:test` (rules + engine + coach/openings + all-worlds validation) and shipped as a debug-signed **Capacitor APK** (`npm run apk`, JDK 21).

## The good

A patient, free, offline chess tutor — no sign-in, no subscription — that also carries **heritage** in every piece. Learning and culture on one board. That's #AI4Good.

## Play it

- ▶️ **Play in your browser:** [naveenneog.github.io/Chaturanga](https://naveenneog.github.io/Chaturanga/)
- 📦 **Download the APK:** [latest release](https://github.com/naveenneog/Chaturanga/releases/latest)
- 💻 **Source:** [github.com/naveenneog/Chaturanga](https://github.com/naveenneog/Chaturanga)

*Previous → [Sopāna](/AI4Good/2026/07/06/sopana-snakes-and-ladders-that-teaches/) · Read the whole journey → [#AI4Good build story](/AI4Good/2026/07/10/ai4good-an-app-a-day/). #AI4Good*
