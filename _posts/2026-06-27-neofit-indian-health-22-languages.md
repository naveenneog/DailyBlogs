---
layout: post
title: "NeoFit: Science-Informed Indian Health & Fitness in 22 Languages"
date: 2026-06-27 10:00:00 +0530
categories: ai4good showcase
tags: [ai4good, android, kotlin, azure-ai, health, india]
image: /assets/img/2026-07-10-ai4good-app-a-day/shot-neofit.png
excerpt: "Sehat, simple banayi. NeoFit is a science-informed Indian health app in 22 Indian languages — calorie tracking that knows dosa and biryani, on-device food recognition, AI food photos and exercise videos, powered by Azure AI."
---

{% assign shot = '/assets/img/2026-07-10-ai4good-app-a-day' %}

> Part of the **[#AI4Good](/AI4Good/2026/07/10/ai4good-an-app-a-day/)** series — one app a day, each built for good.

[![NeoFit — Sehat, simple banayi]({{ shot | append: '/shot-neofit.png' | relative_url }})](https://naveenneog.github.io/NeoFit/)

Open almost any fitness app and it assumes two things: you eat like the West, and you read English fluently. For most of India, both assumptions are wrong. NeoFit is my answer.

## What it is

[**NeoFit**](https://naveenneog.github.io/NeoFit/) — *"Sehat, simple banayi"* — is a **science-informed** health app tailored to **Indian** dietary habits, **offline-first** and **honest about estimation**. What's shipping (now v1.4):

- **Indian food intelligence** — a seeded knowledge base spanning regions (South, North, North-East, West, Central, East, pan-Indian): home meals, street food, thalis, beverages, snacks and sweets — each with **native names** and per-serving nutrition.
- **Honest calorie estimation** — portion multipliers + cooking-style adjustment + a **confidence score** (High / Medium / *Rough estimate*) and a human-readable basis; approximate values are prefixed with `~` and you can **correct anything**.
- **AI Coach** — a Coach tab that answers questions **grounded in today's calories, macros and goals**, and works **offline**.
- **1,300+ exercise library** with step-by-step form and **demo videos filmed in a consistent NeoFit gym**, plus **build-your-own workouts**, a live timer, **voice (TTS) guidance**, and on-demand **AI-generated pose images**.
- **Health Connect** sync (steps / distance / active-calories) with a graceful **estimate/simulate** fallback, a transparent **wellness score (0–100)** you can see the breakdown of, and smart nudges.
- **Fully localized into 22 Indian languages** — every screen, with native dish names and Hinglish/Kanglish flavour.

## How it was built

NeoFit is the most architecturally serious app in the series — **Kotlin + Jetpack Compose (Material 3)**, **Clean Architecture** with strict unidirectional flow: `UI → ViewModel (StateFlow) → UseCase → Repository`. The **domain is pure Kotlin** (no framework deps), and the parts that must be correct are isolated as **pure, deterministic, unit-tested engines**: `CalorieMath`, `CalorieEstimationEngine`, `RegionClassifier`, `WellnessScoreEngine`, `RecommendationEngine`.

- **Room is the single source of truth** — everything works offline; **network and AI sit behind interfaces with mocks**.
- **Integrations are all pluggable ports:** `HealthConnectManager`, `FoodRecognitionService` (a mock today, swappable for a real recogniser), and the **food-image system** that degrades gracefully **web image → Azure-generated (`gpt-image`) → placeholder** via `FoodImageProvider`. **Azure AI** is wired in behind `ImageGenerationService` / `AzureImageGenerationService`.
- **Stack:** Room · Hilt · Coroutines + Flow · DataStore · Retrofit/OkHttp + kotlinx.serialization · Coil · Health Connect · JUnit + Truth + Compose UI Test. `compileSdk 35`, `minSdk 26`.
- A deliberate call: **one Gradle module with strict package separation** (`core`, `data`, `domain`, `engine`, `integration`, `feature/*`, `di`) — it "compiles in one shot," with the boundaries already drawn so it can split into modules later mechanically.

The theme throughout is **honesty**: the app tells you when a number is a rough estimate, and never pretends an approximation is a fact.

## The good

Health advice only works if you can understand it and see your own food in it. By speaking **22 languages**, knowing the Indian plate, and being **transparent about every estimate**, NeoFit meets more than a billion people where they actually are. **Inclusion is a health outcome** — and that's #AI4Good.

## Try it

- ▶️ **Live site:** [naveenneog.github.io/NeoFit](https://naveenneog.github.io/NeoFit/)
- 📦 **Download the APK:** [latest release](https://github.com/naveenneog/NeoFit/releases/latest)
- 💻 **Source:** [github.com/naveenneog/NeoFit](https://github.com/naveenneog/NeoFit)

*Previous → [KidKat](/AI4Good/2026/06/26/kidkat-safe-videos-for-kids/) · Next → [GpsCamera](/AI4Good/2026/07/04/gpscamera-geotag-every-photo/). #AI4Good*
