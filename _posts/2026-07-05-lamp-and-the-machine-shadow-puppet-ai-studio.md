---
layout: post
title: "The Lamp & the Machine: Turning Shadow-Puppet Theatre into an AI Film Studio"
date: 2026-07-05 10:00:00 +0530
categories: ai4good showcase
tags: [ai4good, sora, azure-ai, heritage, togalu-gombeyaata, video]
image: /assets/img/2026-07-10-ai4good-app-a-day/shot-sora.png
excerpt: "How I turned Karnataka's 500-year-old leather shadow-puppet theatre, Togalu Gombeyaata, into an AI film studio — using Sora 2 and Azure AI to retell the story of Kempegowda, the founder of Bengaluru. A build log for keeping a fading folk art alive."
---

{% assign shot = '/assets/img/2026-07-10-ai4good-app-a-day' %}

> Part of the **[#AI4Good](/AI4Good/2026/07/10/ai4good-an-app-a-day/)** series. This one is about heritage — using new machines to keep an old art breathing.

[![The Lamp & the Machine — Togalu Gombeyaata meets generative AI]({{ shot | append: '/shot-sora.png' | relative_url }})](https://naveenneog.github.io/Sora-Azure-MultiPart-Video-Editing/)

Under a banyan tree, a storyteller lights the brass oil lamps and, on a stretched cotton screen backlit by fire, a legend moves. This is **Togalu Gombeyaata** — Karnataka's leather shadow-puppet theatre — and it is quietly disappearing. *The Lamp & the Machine* is my attempt to hand it a new stage: an AI-generated shadow-puppet film that retells the story of **Kempegowda**, the 16th-century chieftain who, in 1537, ploughed the four streets that became **Bengaluru**.

## What it is

[**The Lamp & the Machine**](https://naveenneog.github.io/Sora-Azure-MultiPart-Video-Editing/) is both a **film** and a **build log** — a single themed page that walks through turning a folk theatre into an AI film studio, told in three acts. The film exists in **four different narration cuts** of the same visuals, and the project produced two reusable skills along the way.

## How it was built

This is the richest build story of the series, so here's the honest version — bugs and all.

**Act I — the images (Sora 2 on Azure AI Foundry).** The hard part of a multi-scene film isn't generating a clip, it's stopping every clip from **drifting**. Independent generations wander — the hero's turban changes, the palette shifts, the backlit screen becomes a photoreal sunset. The fix was a **locked "Style Bible"** and a five-beat grammar — *Invocation → Character → Journey → Conflict → Resolution → Moral* — injected verbatim into all ~25 scenes, rendered at 12 seconds a clip and stitched with a shared warm-firelight grade and crossfades. The lesson came from one bug: scene 3 drifted into a photoreal landscape because a single line said *"movement past Indian landscapes, palaces, forests, rivers."* Sora read it as *paint a real location.* Rewording it to "flat cut-leather silhouettes on the same backlit screen" killed the drift.

**Act II — the voice (the editing problem in four words: *keep the music, change the voice*).** The first cut narrated itself beautifully… in **Kannada** — because the Style Bible's `audio` field said "a wise elder Kannada storyteller" (confirmed by transcribing with **gpt-4o-transcribe**). I wanted an English cut *without* losing the veena, mridangam and temple bells Sora had baked into the same track. So I ran the audio through **Demucs (htdemucs)** source separation to split **vocals** from **music + ambience**, dropped the old narration, kept the music bed, laid a fresh **Azure Neural** voice on top with side-chain **ducking**, and remuxed onto the untouched video.

**Act III — the cast.** One narrator became a company: a warm male elder (**en-IN-Prabhat**), a female voice (**en-IN-Neerja**, with *empathetic* and *cheerful* styles), and a **unison** finale. The first multi-voice cut taught two lessons — it sounded robotic (I'd pushed prosody too far, `-8%` rate / `-2st` pitch, adding artifacts) and cut out after 90 seconds (a real offset bug). Softening the prosody and switching to Azure's ultra-natural **DragonHD** voices (en-IN-Arjun, en-IN-Neerja) — so lifelike no time-stretching was needed — produced the **flagship cut**.

**The pipeline**, all on Azure with **Microsoft Entra (AAD) auth — no API keys**, orchestrated from the terminal: **Sora 2** (video) · **gpt-4o-transcribe** (audio QA) · **Azure AI Speech** (en-IN neural + DragonHD) · **Demucs** (separation) · **FFmpeg** (stitch, duck, mix, remux) · **Python 3.14**. It even spun off three reusable **skills** — `togalu-gombe-video`, `voice-dub`, and `togalu-brand-bumpers` (opening jingle + end credits).

## The good

Folk arts don't die because they stop being beautiful — they die because they stop being *seen*. Pointing generative video at a living tradition, respectfully, can put it in front of a generation that would otherwise never meet it. **AI as a preservation tool for culture** — that's #AI4Good.

## Explore it

- ▶️ **Live site / build log:** [naveenneog.github.io/Sora-Azure-MultiPart-Video-Editing](https://naveenneog.github.io/Sora-Azure-MultiPart-Video-Editing/)
- 💻 **Source:** [github.com/naveenneog/Sora-Azure-MultiPart-Video-Editing](https://github.com/naveenneog/Sora-Azure-MultiPart-Video-Editing)

*Previous → [GpsCamera](/AI4Good/2026/07/04/gpscamera-geotag-every-photo/) · Next → [Sopāna](/AI4Good/2026/07/06/sopana-snakes-and-ladders-that-teaches/). #AI4Good*
