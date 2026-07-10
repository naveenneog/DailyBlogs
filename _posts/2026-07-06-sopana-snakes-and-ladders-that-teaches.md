---
layout: post
title: "Sopāna: The Snakes & Ladders That Teaches (Moksha Patam, Reborn)"
date: 2026-07-06 10:00:00 +0530
categories: ai4good showcase
tags: [ai4good, game, pwa, heritage, moksha-patam, threejs]
image: /assets/img/2026-07-10-ai4good-app-a-day/shot-sopana.png
excerpt: "Sopāna reclaims Snakes & Ladders and restores its origin — the ancient Indian Moksha Patam, where every snake is a vice and every ladder a virtue. Land on one and it animates and reads its meaning aloud. Play across four worlds, in 2D, 2.5D, and 3D."
---

{% assign shot = '/assets/img/2026-07-10-ai4good-app-a-day' %}

> Part of the **[#AI4Good](/AI4Good/2026/07/10/ai4good-an-app-a-day/)** series — one app a day, each built for good.

[![Sopana — a Snakes & Ladders that teaches]({{ shot | append: '/shot-sopana.png' | relative_url }})](https://naveenneog.github.io/Sopana/)

Before it was a plastic race to 100, *Snakes & Ladders* was **Moksha Patam** — an Indian teaching game where the board was a map of the soul. Somewhere along the way we kept the dice and threw away the meaning. Sopāna puts it back.

## What it is

[**Sopāna**](https://naveenneog.github.io/Sopana/) is *a Snakes & Ladders that teaches*. Open it and you land in a **lobby** — pick a **theme**, a **mode**, **1–4 players** and a **character** for each, then play local **pass-and-play multiplayer**. The same game is drawn **three ways**:

- **Board** — a crisp 2D board with a live turn roster, animated themed snakes & ladders, and coloured tokens.
- **Cinematic** — a **2.5D backlit shadow-puppet ascent** with a per-theme **Sora-2 intro** film and an adaptive procedural score.
- **3D** — a real 3D board with an **orbit camera** (drag to spin, scroll to zoom), a themed environment and player-coloured pawns.

The signature is the **Meaning Reveal**: land on a snake or ladder and the board dims, the connector highlights, a themed card shows the **name + one-line teaching**, and a narrator **reads it aloud** with word-by-word highlight before your token travels. **Four worlds** ship — Moksha Path (vices vs virtues), Founder's Climb (startup pitfalls vs wins), Panchatantra Trail (fables), and Habit Heroes (kids' habits).

## How it was built

Sopāna is **radically data-driven**: a new world is essentially **one JSON file** in `web/worlds/*.json` over a single **pure rules engine** (`web/js/logic.js`). Every snake/ladder is just `{ from, to, name, en, meaning }`, and `meaning` is the line read aloud. The **three renderers** — Board, Cinematic (PixiJS), and 3D (Three.js) — all draw the *same* manifest, so content never lives in a renderer.

- **Every asset is generated, per theme.** Azure (AAD-only via `az login`) drives it: **`gpt-image-2`** renders the board backdrop, the player figurine, and one illustration per snake/ladder in each world's art style (Moksha = authentic **Togalu Gombe** leather shadow-puppet); **Azure Neural TTS** narrates each meaning (Moksha = `en-IN-Arjun:DragonHDLatestNeural`). Files follow a `<type>-<from>.{png,mp3}` convention the app loads automatically, **falling back to the browser's SpeechSynthesis** when a clip is missing — and `npm test` includes an **asset-sync check** that every entry has matching art + narration.
- **The Cinematic mode is a little engine of its own** (PixiJS + Web Audio): the pilgrim walks a winding staircase step-by-step (each step ignites), landing on a vice/virtue triggers an animated **light-sweep** or a **serpent strike with screen-shake**, the 100 steps span **five lokas** with curtain-wipe realm transitions, and a **procedural raga (Bhūpāli)** plays an ascending melody as you climb, over an adaptive drone that brightens per realm.
- **Zero-dependency tests** (`node:test`) plus **Playwright** visual QA (`tooling/shoot.mjs`); shipped to GitHub Pages and an **Android Capacitor APK** (CI, JDK 21). Licensed PolyForm Noncommercial.

## The good

Kids absorb values through play, not lectures. By restoring the *why* to every square — narrated, animated, and beautiful — Sopāna turns a car-trip game into a gentle lesson in ethics and consequence, and keeps a piece of **cultural heritage** alive. That's #AI4Good.

## Play it

- ▶️ **Play in your browser:** [naveenneog.github.io/Sopana](https://naveenneog.github.io/Sopana/)
- 📦 **Download the APK:** [latest release](https://github.com/naveenneog/Sopana/releases/latest)
- 💻 **Source:** [github.com/naveenneog/Sopana](https://github.com/naveenneog/Sopana)

*Previous → [The Lamp & the Machine](/AI4Good/2026/07/05/lamp-and-the-machine-shadow-puppet-ai-studio/) · Next → [Chaturanga](/AI4Good/2026/07/09/chaturanga-ancient-chess-in-3d/). #AI4Good*
