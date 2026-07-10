---
layout: post
title: "GpsCamera: Geotag Every Photo, Exactly — a Native Android GPS Camera"
date: 2026-07-04 10:00:00 +0530
categories: ai4good showcase
tags: [ai4good, android, kotlin, camerax, gps, exif]
image: /assets/img/2026-07-10-ai4good-app-a-day/shot-gpscamera.png
excerpt: "A fast, native Android camera that burns your exact location and a live mini-map onto every photo, writes standards-compliant GPS EXIF, and files each shot into its own album. Trustworthy documentation as a tool for good."
---

{% assign shot = '/assets/img/2026-07-10-ai4good-app-a-day' %}

> Part of the **[#AI4Good](/AI4Good/2026/07/10/ai4good-an-app-a-day/)** series — one app a day, each built for good.

[![GpsCamera — geotag every photo, exactly]({{ shot | append: '/shot-gpscamera.png' | relative_url }})](https://naveenneog.github.io/GpsCamera/)

Not everything that does good is glamorous. Sometimes it's a field engineer proving they inspected a transformer, a surveyor documenting flood damage, or a community reporter capturing a pothole with a location no one can dispute. They all need the same thing: **a photo you can trust.**

## What it is

[**GpsCamera**](https://naveenneog.github.io/GpsCamera/) is a fast, native Android camera that makes every shot **verifiable**. Straight from the live site:

- **Geotagged capture** — every photo is stamped with the **reverse-geocoded address**, decimal coordinates, **altitude, accuracy** and a timestamp.
- **Live mini-map** — a real **OpenStreetMap** thumbnail of your exact spot, shown live on the viewfinder *and* burned onto the shot.
- **Open in Maps** — tap the map (or the link embedded in the photo) to jump straight to the coordinates in Google Maps.
- **Photo & video**, pinch-to-zoom, and a **full-screen gallery** (swipe, pinch-zoom, open-in-Maps from EXIF, share).
- **Move & resize the stamp** — drag the info block anywhere and pinch to resize *before* you shoot; it's burned exactly as arranged.
- **Standards-compliant EXIF** — GPS lat/lon/alt/timestamp + a clickable Maps URL written into the JPEG, so Google Photos and Lightroom place it on a map automatically.
- **Day & night** themes, portrait **and** landscape reflow, and a dedicated `Pictures/GPSCamera` album.

## How it was built

GpsCamera is deliberately **native and dependency-light** — **Kotlin + Jetpack Compose (Material 3) + CameraX**, min/target SDK 26/35, no heavyweight frameworks. The engineering value is in a few careful choices:

- **Resilient location.** It merges Google Play Services **fused** location *and* the platform **GPS/network providers**, so it still works on devices **without Google Play Services** — exactly the rural/field scenarios it's built for.
- **No-API-key maps.** The mini-map is stitched from **OpenStreetMap raster tiles** with pure **web-mercator ("slippy map") tile math** — no Maps SDK, no key, no quota. `StaticMapProvider` fetches and stitches the tiles and draws the pin; `PhotoStamper` burns the info panel + map onto the bitmap.
- **Testable core.** The tricky bits are pure, unit-tested Kotlin — `GpsFormat` (DMS / **EXIF-rational** / stamp text) and `SlippyMap` (tile math + Maps URLs) — plus on-device **instrumented** tests for what can only be verified for real: `ExifWriter` (EXIF read-back), `PhotoStamper`, and `PhotoSaver` (MediaStore storage).
- Clean module split: `model/GeoFix` · `location/LocationRepository` (fused + platform + reverse geocoding) · `map/StaticMapProvider` · `camera/{PhotoStamper, ExifWriter, PhotoSaver, GalleryRepository}` · Compose `ui/`. The app icon itself was generated with **Azure AI Foundry `gpt-image-2`**.

## The good

A timestamped, geotagged, tamper-evident photo is a small piece of **infrastructure for accountability** — for insurance, field work, journalism, and public services. That it works **without Google Play Services** or a Maps API key means it reaches exactly the low-connectivity places that need proof the most. Trust is a public good, and GpsCamera hands it to anyone, free.

## Try it

- ▶️ **Live site:** [naveenneog.github.io/GpsCamera](https://naveenneog.github.io/GpsCamera/)
- 📦 **Download the APK:** [latest release](https://github.com/naveenneog/GpsCamera/releases/latest)
- 💻 **Source:** [github.com/naveenneog/GpsCamera](https://github.com/naveenneog/GpsCamera)

*Previous → [NeoFit](/AI4Good/2026/06/27/neofit-indian-health-22-languages/) · Next → [The Lamp & the Machine](/AI4Good/2026/07/05/lamp-and-the-machine-shadow-puppet-ai-studio/). #AI4Good*
