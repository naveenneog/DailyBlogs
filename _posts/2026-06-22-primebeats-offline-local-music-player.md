---
layout: post
title: "PrimeBeats: A Beautiful, Offline, Ad-Free Local Music Player for Android"
date: 2026-06-22 10:00:00 +0530
categories: ai4good showcase
tags: [ai4good, android, react-native, expo, music, offline]
image: /assets/img/2026-07-10-ai4good-app-a-day/shot-primebeats.png
excerpt: "Where #AI4Good began: PrimeBeats — an Amazon-Prime-Music-style player for the songs already on your phone. On-device Smart Radio, a real equalizer, lock-screen controls, background playback. No account, no ads, 100% offline."
---

{% assign shot = '/assets/img/2026-07-10-ai4good-app-a-day' %}

> The first build of the **[#AI4Good](/AI4Good/2026/07/10/ai4good-an-app-a-day/)** series — one app a day, each free and built for good.

[![PrimeBeats — your music, beautifully local]({{ shot | append: '/shot-primebeats.png' | relative_url }})](https://naveenneog.github.io/PrimeBeats/)

Streaming turned music into something you rent. But most of us still have songs — actual files — sitting on our phones, and the built-in players that handle them are ugly, ad-riddled, or want an account. So the very first #AI4Good build was a quiet act of ownership.

## What it is

[**PrimeBeats**](https://naveenneog.github.io/PrimeBeats/) is *"your music, beautifully local"* — a polished, **Amazon-Prime-Music-style** player for the audio already on your device. What's shipping:

- **Local library scan** — finds every track and organizes it by **album and folder**, with instant **search** and a **persistent mini-player** on every screen.
- **Background & lock-screen playback** — keeps playing when you switch apps or lock the phone, with full notification and lock-screen controls.
- **Android Auto** — shows up in your car with icon-rich browsing (Made for You, Most Played, Recently Played, Playlists, Songs), **Like / Loop / Smart-Radio** buttons, **two-way phone↔car sync**, and voice ("play a song from PrimeBeats"), backed by a native media-browser service.
- **P2P music sharing** — select songs and **send them to another PrimeBeats user** via the share sheet (Nearby Share, Bluetooth…); received tracks import into *Shared with me* and persist across updates.
- **Smart Radio (on-device ML)** — an **endless, fully-offline** auto-queue that picks similar songs from the current track and your learned taste, with exploration and per-artist variety.
- **Equalizer & bass boost** — a graphic EQ with device presets, per-band dB sliders, and a bass-boost control, all persisted.
- **Gestures & progressive seek** — swipe the artwork to change track; **double-tap and keep tapping** a side to jump progressively further (+2, +2, +3, +4, +5s).
- **Make it yours** — rename a song's title & artist, fetch (iTunes) or upload custom album art, drag-to-reorder playlists and the up-next queue.

## How it was built

PrimeBeats is **Expo SDK 54** (React Native 0.81, React 19, TypeScript) — Expo chosen specifically so it runs in **Expo Go** for fast iteration. The interesting engineering is all in the details:

- **The single-player trick.** Android background audio needs `AudioPlayer.setActiveForLockScreen(...)`, which only exists on a *player*, not a playlist. So PrimeBeats keeps **one app-lifetime `AudioPlayer`** and manages the queue itself in a `zustand` store: `playFrom(tracks, index)` loads via `player.replace({uri})`, each change updates lock-screen metadata, and a `playbackStatusUpdate` listener mirrors position/duration into state and **auto-advances** on `didJustFinish` (respecting repeat mode).
- **On-device recommender, no cloud.** Smart Radio blends **content similarity** (artist / album / folder / title keywords) with a **taste profile** that accumulates affinity from **completed plays (+), early skips (−), and likes (++)**, minus a recency penalty, with per-artist diversity. The same signals derive Most Played / Recently Played / Made-for-You — fully offline, no extra ML runtime.
- **Album art without ID3.** `expo-media-library` on this SDK doesn't expose embedded artwork, so PrimeBeats renders **deterministic gradient tiles** from album/track initials (stable per album), with iTunes web-search and manual upload layered on top. `ArtTile` already accepts a real `uri`, so embedded-art extraction can drop in later.
- **Stack:** `expo-audio` (ExoPlayer under the hood) · `expo-media-library` · React Navigation · **zustand** · **AsyncStorage**. Permissions are scoped tightly — `READ_MEDIA_AUDIO`, `POST_NOTIFICATIONS`, `FOREGROUND_SERVICE_MEDIA_PLAYBACK` — and `RECORD_AUDIO` is **explicitly disabled**; it's playback-only. Pure logic is covered by a **jest-expo** suite.

One deliberate *non*-feature: a YouTube "audio-only + ad-blocking" mode was **intentionally not built** — extracting audio-only streams and blocking ads violates YouTube's Terms of Service. The compliant path (official IFrame Player / Data API) is on the roadmap. **Building for good includes what you refuse to build.**

## The good

Not every "AI for good" story is about a model — some are about **dignity and control**. PrimeBeats works with **zero data, zero tracking, and zero cost**, for people whose music lives on their phone, not in a subscription. It respects both your data plan and your privacy.

## Try it

- ▶️ **Live site:** [naveenneog.github.io/PrimeBeats](https://naveenneog.github.io/PrimeBeats/)
- 📦 **Download the APK:** [latest release](https://github.com/naveenneog/PrimeBeats/releases/latest)
- 💻 **Source:** [github.com/naveenneog/PrimeBeats](https://github.com/naveenneog/PrimeBeats)

*Next in the series → [ActionCut](/AI4Good/2026/06/23/actioncut-free-pro-video-editor/). #AI4Good*
