# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"赛博除怨局" (Cyber Grudge) — a full-stack interactive web app built with Next.js (App Router), React, Tailwind CSS, and GSAP. Users type a complaint, lock it as evidence, click body parts on an SVG doll to "stab" them, triggering GSAP physics animations and receiving AI-generated sarcastic curses (via DeepSeek API or local mock fallback).

## Commands

```bash
npm run dev     # Start dev server (default port 3000)
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

## Architecture

```
app/
  page.tsx              # All state: eventText, isTargetLocked, deepMode, apiKey (localStorage), curse, loading
  layout.tsx            # Root layout with dark mode HTML
  globals.css           # Tailwind + custom CSS variables, marquee keyframes, grid background
  api/curse/route.ts    # POST — accepts {event, part, deepMode} + x-api-key header
                        # Returns 401 if deepMode on but no key; calls DeepSeek API or falls back to mock pool
components/
  Doll.tsx              # Inline SVG stick figure with clickable <g id="head|mouth|arm-left|arm-right|legs">
                        # playStrikeAnimation(partId): gsap.fromTo screen shake + red flash + scale 1.2 + elastic.out recovery
                        # Dimmed when isTargetLocked=false; crosshair cursor when locked
  CurseBubble.tsx       # Speech bubble above doll, GSAP entrance animation, disappears after 5s
  Marquee.tsx           # Scrolling marquee of simulated battle reports, shuffles every 5s
  InputArea.tsx         # Left sidebar: textarea (100 chars), lock button, deepMode toggle, API key password input (slide-down)
  StatsHeader.tsx       # Title + animated hit counter (eased count-up via requestAnimationFrame)
```

## Key design decisions

- **Lock ceremony**: User must click "🔒 锁定罪证" before the doll becomes interactive. Textarea turns readonly with red glow. Without lock, doll shows `cursor-not-allowed` and dimmed neon.
- **BYOK (localStorage)**: API key loaded from `localStorage.getItem('cyber_grudge_api_key')` on mount, saved on every change. Password input slides down via GSAP when deepMode toggle is ON. Key sent as `x-api-key` header.
- **API route**: Deep mode + key → calls DeepSeek `/chat/completions` with model `deepseek-chat` and a system prompt in Chinese. On network error or non-OK response → falls back to hardcoded curse pool. Deep mode + no key → 401. Normal mode → mock pool with simulated delay.
- **Hit counter** is an in-memory module-level variable (resets on server restart).
- **GSAP** only in client components (`"use client"`) — `Doll.tsx`, `CurseBubble.tsx`, `InputArea.tsx`.
- **GSAP `fromTo`** used for screen shake per the spec (not `to`), with `x` axis.
- **Marquee**: CSS `@keyframes marquee` with duplicated content for seamless infinite scroll.
- **Concurrency guard**: `loading` state blocks overlapping strikes; page shows `cursor-wait`.
