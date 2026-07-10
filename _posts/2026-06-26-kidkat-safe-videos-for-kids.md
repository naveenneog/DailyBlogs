---
layout: post
title: "KidKat: Safe, Finite, Educational Screen Time for Kids"
date: 2026-06-26 10:00:00 +0530
categories: ai4good showcase
tags: [ai4good, flutter, android, ios, kids, education]
image: /assets/img/2026-07-10-ai4good-app-a-day/shot-kidkat.png
excerpt: "The app that named the campaign. KidKat plays a finite, parent-approved stream of short educational videos in the official YouTube player — ToS-compliant, no infinite feed, no algorithmic rabbit holes, no doomscroll."
---

{% assign shot = '/assets/img/2026-07-10-ai4good-app-a-day' %}

> Part of the **[#AI4Good](/AI4Good/2026/07/10/ai4good-an-app-a-day/)** series. If any single build explains what "AI for good" means to me, it's this one.

[![KidKat — only the good stuff, for curious kids]({{ shot | append: '/shot-kidkat.png' | relative_url }})](https://naveenneog.github.io/KidKat/)

Every parent knows the feeling: you hand a child a phone for five minutes of a learning video, and twenty minutes later an algorithm has walked them somewhere you never chose. I wanted the opposite of that feeling.

## What it is

[**KidKat**](https://naveenneog.github.io/KidKat/) gives children a safe, **finite** stream of short *educational* videos chosen by their parents — a curated front-end built entirely on official, permitted YouTube building blocks. Everything on the live site is shipping:

- **Finite sessions** — a set number of videos, then a friendly **break screen**. No infinite feed.
- **Daily time limit** — when time's up, the app locks until tomorrow (a parent can extend).
- **Swipe up/down player** — swipe **up = next**, **down = previous**, tap to pause; related suggestions are restricted to the **same channel**.
- **Save favorites**, **no repeats** (already-watched videos are skipped), **strict Safe Search** (embeddable-only, short-only ≤1/≤4 min).
- **Parent PIN gate** on all settings, with a dashboard for the API key, interests, the **approved-channel allowlist**, daily limit, videos-per-session, and video length.
- **Age bands** (3–5 / 6–8 / 9–12) pre-load trusted channels, plus **12 learning topics** and **5 colorful themes**.

## How it was built

The whole app is a lesson in **building within the rules**. The original idea — *"log into a YouTube Kids account and override the algorithm"* — turned out to be impossible **and** against the rules, and confronting that honestly shaped everything:

- ❌ There is **no public YouTube Kids API** (Kids accounts are COPPA-restricted).
- ❌ The YouTube API ToS **forbid** interfering with recommendations or building a substitute client.
- ❌ Apps **must** use the official embedded player — no stream extraction.

So KidKat takes the **compliant path that reaches the same goal**: **discovery** via the official **YouTube Data API v3** (search + metadata only), **playback** via the official **IFrame player** (`youtube_player_iframe`, so creators keep their views and monetization), and **its own curation** — a parent allowlist plus an education filter — layered *on top of*, never altering, YouTube's algorithm. **No Kids-account login, no analytics/ads SDKs, no child PII**; the parent's API key and PIN live **on-device only**.

Under the hood it's a single **Flutter** codebase for **Android and iOS**: **Riverpod** for state and **go_router** (with an onboarding redirect and the parent gate). `YouTubeApi` searches then hydrates videos (embeddable-only); `CurationService.buildSession` produces the **finite, filtered, de-duplicated** queue that is the heart of the anti-doomscroll design. The test suite covers ISO-8601 duration parsing, the curation filter, the Data API client (mocked, including quota/invalid-key handling), daily watch-time accounting, and end-to-end session building.

## The good

This is the heart of **#AI4Good**: the most powerful thing technology can do for the youngest users is often to **do less** — to be calm, bounded, and intentional. KidKat turns the scariest part of modern parenting into something a parent fully controls, without collecting a byte of a child's data. **AI for good starts with protecting kids.**

## Try it

- ▶️ **Live site:** [naveenneog.github.io/KidKat](https://naveenneog.github.io/KidKat/)
- 📦 **Download the APK:** [latest release](https://github.com/naveenneog/KidKat/releases/latest)
- 💻 **Source:** [github.com/naveenneog/KidKat](https://github.com/naveenneog/KidKat)

*Previous → [ActionCut](/AI4Good/2026/06/23/actioncut-free-pro-video-editor/) · Next → [NeoFit](/AI4Good/2026/06/27/neofit-indian-health-22-languages/). #AI4Good*
