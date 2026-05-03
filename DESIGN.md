# DESIGN.md — The Growth Network Matching Platform

> **Project:** The Growth Network AI-Powered Matching Platform
> **Owner:** Exoasia Innovation Hub
> **Prototype:** [cause-azure-43106646.figma.site](https://cause-azure-43106646.figma.site/)
> **Stack:** Figma Make → Tailwind CSS + React
> **Version:** v1.0 — March 2026

---

## Design Philosophy

The Growth Network Matching Platform is a **private deal environment**, not a marketplace or social network. Every design decision must communicate one thing:

> *This room is different from every business community you've been in.*

The platform's four non-negotiable design principles govern all UI/UX decisions:

| Principle | Design Implication |
|---|---|
| **Trust before access** | Gate and verify visually — make verification feel like a privilege, not friction |
| **Consent-based introductions** | Nothing appears without explicit action; no passive discovery |
| **Human judgment over automation** | AI scores are surfaced as signals, not decisions; Advisor actions are prominent |
| **Execution over inspiration** | Dashboards are operational; next steps are always visible |

---

## Brand Positioning

The Growth Network sits between **private equity culture** and **operator pragmatism**. It should feel like the digital equivalent of a members-only deal room — not a startup accelerator, not a networking app. The brand speaks to people who have already built something real.

**Tone:**
- Institutional, not corporate. Warmth is earned through trust, not manufactured in UI.
- Direct, not aggressive. Confident copy with zero hype.
- Exclusive without arrogance. The filter exists to protect quality, not signal status.

---

## Color System

Extracted directly from the Figma prototype HTML.

### Core Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-bg-base` | `#0A0A0A` | Page background; the dominant canvas |
| `--color-bg-surface` | `#111111` | Section backgrounds (alternate dark) |
| `--color-bg-card` | `#1A1A1A` | Cards, form inputs, panels |
| `--color-bg-elevated` | `#222222` | Modals, drawers, tooltips |
| `--color-accent` | `#E8A020` | Primary accent — gold; CTAs, highlights, active states, badges |
| `--color-accent-glow-sm` | `rgba(232,160,32,0.3)` | Small glow on primary buttons |
| `--color-accent-glow-lg` | `rgba(232,160,32,0.4)` | Large glow on hero CTAs |
| `--color-accent-tint-10` | `rgba(232,160,32,0.10)` | Badge backgrounds, subtle highlights |
| `--color-accent-tint-15` | `rgba(232,160,32,0.15)` | Radial gradient overlays on hero |
| `--color-accent-border` | `rgba(232,160,32,0.3)` | Badge borders, focused input rings |
| `--color-border` | `#2A2A2A` | Default borders, card outlines, nav border |
| `--color-border-input` | `#333333` | Form input borders |
| `--color-text-primary` | `#FFFFFF` | Headings and primary body text |
| `--color-text-secondary` | `#CCCCCC` | Body copy, card descriptions |
| `--color-text-muted` | `#888888` | Microcopy, footnotes, privacy lines |
| `--color-text-label` | `#E8A020` | Section labels, overlines, accent text |
| `--color-text-on-accent` | `#0A0A0A` | Text on gold CTA buttons |
| `--color-nav-bg` | `rgba(10,10,10,0.95)` | Fixed nav background with blur |

### Background Atmosphere
The hero and key sections use a layered atmospheric treatment — not flat color:
- **Base:** `background-color: #0A0A0A`
- **Texture:** SVG fractal noise overlay at `opacity: 0.05` (pointer-events: none, z-index: 1)
- **Photo layer:** Unsplash image at `filter: brightness(0.12)` — almost completely darkened
- **Radial glows:** Three `radial-gradient` overlays using `rgba(232,160,32,0.15/0.10/0.08)` at varying positions (20%/50%, 80%/30%, 50%/80%) for environmental warmth
- **Vignette:** `radial-gradient(transparent 0%, rgba(10,10,10,0.6) 50%, rgba(10,10,10,0.85) 100%)`

This layered approach gives depth without being distracting. **Never use flat `#0A0A0A` alone on hero sections.**

---

## Typography

### Font Families

| Role | Family | Notes |
|---|---|---|
| Display / Hero | **Barlow Condensed** | Loaded from Google Fonts; used for all large headings |
| UI / Body | **Inter** | Default sans-serif; all body copy, labels, form text |

### Type Scale

| Level | Font | Weight | Size | Transform | Tracking | Leading |
|---|---|---|---|---|---|---|
| Hero H1 | Barlow Condensed | 900 | `clamp(56px, 9vw, 120px)` | uppercase | `-0.02em` | `0.95` |
| Section H2 (large) | Barlow Condensed | 800 | `clamp(56px, 8vw, 120px)` | uppercase | — | `0.92` |
| Section H2 (medium) | Barlow Condensed | 800 | `clamp(48px, 6vw, 96px)` | uppercase | — | `0.92` |
| Section H2 (focused) | Barlow Condensed | 800 | `clamp(48px, 7vw, 110px)` | uppercase | — | `0.92` |
| Stat / Number | Barlow Condensed | 900 | `56px` | — | — | `1` |
| Card H3 | Inter | 700 | `16px` | uppercase | `0.05em` | — |
| Body Large | Inter | 400 | `20px` | — | — | `1.6` |
| Body | Inter | 400 | `15px` | — | — | `1.7` |
| Body Medium | Inter | 400 | `18px` | — | — | `1.7` |
| CTA Button | Inter | 700 | `14px` | uppercase | `0.08–0.1em` | — |
| Overline / Label | Inter | 700 | `11px` | uppercase | `0.15em` | — |
| Stat Label | Inter | 600 | `13px` | uppercase | `0.12em` | — |
| Microcopy | Inter | 400 | `12px` | — | — | — |
| Legal / Privacy | Inter | 400 | `12px` | — | — | — |

### H1 Color Split Pattern
Hero headlines use a two- or three-line color split — alternating `#FFFFFF` and `#E8A020` lines:
```
<div style="color: #FFFFFF;">HOW TO CLOSE</div>
<div style="color: #E8A020;">HIGH TICKET DEALS</div>
<div style="color: #FFFFFF;">IN 30 DAYS!</div>
```
This pattern is used consistently across all stage hero sections.

---

## Spacing System

The prototype uses Tailwind utility classes. Key spacing values:

| Context | Value |
|---|---|
| Section horizontal padding | `px-[10%]` (hero) / `px-[5%]` (content sections) |
| Section vertical padding (large) | `py-40` (~160px) |
| Section vertical padding (medium) | `py-32` (~128px) |
| Card internal padding | `p-7` (~28px) |
| Form internal padding | `p-8` (~32px) |
| Max content width (hero) | `max-w-[1200px]` |
| Max content width (sections) | `max-w-[1280px]` |
| Max content width (centered/forms) | `max-w-[600px]` / `max-w-4xl` |
| Grid gap (cards) | `gap-6` |
| Grid gap (stats) | `gap-8` |
| Form field gap | `gap-4` |
| Inline element gap | `gap-2` / `gap-3` |

---

## Border Radius

| Element | Radius |
|---|---|
| Cards (primary) | `rounded-[4px]` — sharp, intentional, institutional |
| Form inputs | `rounded-[4px]` |
| Primary CTA buttons | `rounded-[6px]` |
| Form container | `rounded-[8px]` |
| Badges / pills | `rounded-full` |
| Progress dots (nav) | `rounded-full` (`w-[6px] h-[6px]`) |

**Design note:** The near-square corner radius (`4px`) is a deliberate choice that communicates precision and institutional character. Avoid larger radii (`12px`, `16px`, `xl`) — they read as consumer/app, not operator/deal environment.

---

## Component Patterns

### Cards
The primary card component has a distinctive **top-accent border** treatment:
```css
background: #1A1A1A;
border-width: 2px 1px 1px;   /* top border heavier */
border-style: solid;
border-color: #E8A020 #2A2A2A #2A2A2A;  /* top: gold, sides/bottom: dark */
border-radius: 4px;
padding: 28px;
```
This creates a subtle gold crown effect on each card without overwhelming the dark palette.

### Overline / Section Label
Every major section opens with a small labeling device — a short horizontal rule + uppercase label:
```html
<div style="display:flex; align-items:center; gap:12px; margin-bottom:24px;">
  <div style="width:24px; height:1px; background:#E8A020;"></div>
  <span style="font-size:11px; text-transform:uppercase; letter-spacing:0.15em; color:#E8A020;">
    SECTION LABEL
  </span>
</div>
```

### Badge / Pill
Used for stage status and event labels:
```css
display: inline-flex;
align-items: center;
gap: 8px;
padding: 8px 16px;
border-radius: 9999px;
background: rgba(232, 160, 32, 0.10);
border: 1px solid rgba(232, 160, 32, 0.30);
```
Active indicator inside badge: `w-2 h-2 rounded-full bg-[#E8A020] animate-pulse`

### Primary CTA Button
```css
background: #E8A020;
color: #0A0A0A;
font-weight: 700;
font-size: 14px;
text-transform: uppercase;
letter-spacing: 0.08–0.1em;
padding: 20px 40px;       /* py-5 px-10 */
border-radius: 6px;
box-shadow: rgba(232, 160, 32, 0.30) 0px 0px 20px;   /* standard */
/* hover state: */
box-shadow: rgba(232, 160, 32, 0.40) 0px 0px 30px;   /* hero variant */
```
Button text always ends with ` →` as a directional affordance.

### Form Inputs
```css
background: #1A1A1A;
border: 1px solid #333333;
color: #FFFFFF;
border-radius: 4px;
padding: 16px 20px;       /* py-4 px-5 */
font-size: 15px;
/* focus: */
border-color: #E8A020;
outline: none;
```

### Form Container
```css
background: #111111;
border: 1px solid #2A2A2A;
border-radius: 8px;
padding: 32px;
max-width: 600px;
```

### Stat Block
Used in the social proof / results section — three-column grid:
```css
/* Number */
font-family: "Barlow Condensed";
font-weight: 900;
font-size: 56px;
color: #E8A020;
line-height: 1;
margin-bottom: 8px;

/* Label */
font-size: 13px;
text-transform: uppercase;
letter-spacing: 0.12em;
color: #CCCCCC;
font-weight: 600;
```

---

## Navigation

### Bottom Fixed Nav
The prototype uses a **bottom navigation bar** (not a top header), which reinforces the app-like, focused experience:

```css
position: fixed;
bottom: 0; left: 0; right: 0;
height: 72px;
z-index: 50;
background: rgba(10, 10, 10, 0.95);
backdrop-filter: blur(12px);
border-top: 1px solid #2A2A2A;
padding: 0 5%;
display: flex;
align-items: center;
justify-content: space-between;
```

**Left side:** Empty spacer (flex-1)

**Center:** Stage progress dots — 5 dots, active = `#E8A020`, inactive = `#333333`, each `w-[6px] h-[6px] rounded-full`

**Right side:** Stage advancement CTA link:
```css
display: inline-flex;
align-items: center;
gap: 12px;
padding: 12px 32px;     /* py-3 px-8 */
border-radius: 4px;
background: #E8A020;
color: #0A0A0A;
font-weight: 700;
font-size: 13px;
text-transform: uppercase;
letter-spacing: 0.08em;
box-shadow: rgba(232, 160, 32, 0.30) 0px 0px 20px;
```
Label pattern: `Stage 01 — Membership →` (desktop) / `→` (mobile)

---

## Page Structure & Routes

The platform is organized as five stage-gated pages plus the root landing page:

| Route | Stage | Page Purpose |
|---|---|---|
| `/` | Stage 0 | Public landing — Free Mini-Masterclass + Intake Call registration |
| `/stage-1` | Stage 1 (Ignite) | Membership page — community access, events, pitch credit |
| `/stage-2` | Stage 2 (Match) | Verified operators — KYC submission, matching engine activation |
| `/stage-3` | Stage 3 (Commit) | Inner circle — structured matching, Speed to Seed, Advisor sessions |
| `/stage-4` | Stage 4 (Guide) | Deal execution — due diligence, deal structuring, close tracking |
| `/dashboard` | Stage 2+ | Member portal — matches, deal board, events, Ad Credits |

Navigation between stages uses the bottom nav's forward CTA. Each page is fully self-contained — members only see the stage they've unlocked and below.

---

## Page-Level Section Structure

### Stage 0 (Root `/`) — Structure
1. **Hero** — full-viewport, atmospheric; H1 color split; badge + registration form
2. **Masterclass Agenda** — `bg-[#111111]`; 3-col card grid (6 agenda items)
3. **Ideal Attendee** — `bg-[#0A0A0A]`; 2-col card grid (4 archetypes)
4. **Social Proof / Results** — parallax photo bg at brightness 0.3; 3-stat grid ($2.3M / 147 / 92%)
5. **Final CTA** — centered; large H2 color split; single register button
6. **Bottom Nav** — fixed; progress dots; Stage 01 → CTA

### Stage 1 (Ignite) — Key Sections
1. Hero — "This Is Where Real Business Gets Done"
2. Problem / "You Don't Need More Contacts" — pain point list
3. Who Belongs Here — 3 archetype cards (SME Owner, Capital Allocator, Strategic Operator)
4. How the Network Works — 5-step vertical flow
5. What Makes This Different — 5 differentiator cards
6. The Experience — 3 event format cards (Weekly Session, Monthly Dinner, Pitch Night)
7. Your Role — 4 role tiers (Explorer → Growth Advisor)
8. Stage 1 Benefits list + CTA
9. Bottom Nav → Stage 02 CTA

### Stage 2 (Match) — Key Sections
1. Hero — "You've Been in the Room. Now Prove You Belong Here."
2. Stage 1 vs Stage 2 comparison table
3. Entry Requirements — document submission instructions
4. What Stage 2 Unlocks — 6 benefit cards (Dinners, Pitch Nights, Matching Engine, Ad Credits, Fireside Chats, Advisory Insights)
5. Who Stage 2 Is For — inclusion/exclusion list
6. The Stage 2 Experience — Weekly / Monthly cadence table
7. Standards — expectations list
8. Leadership Structure — 4 roles
9. Bottom Nav → Stage 03 CTA

### Stage 3 (Commit) — Key Sections
1. Hero — "Stage 3 activates structured alignment."
2. How It Works — Two-layer matching system (AI Scoring + Advisor Review)
3. Activation Pathways — Speed to Seed cohort vs. Advisor-Led Preparation
4. Member Dashboard Actions — 3 portal actions
5. Standards — responsibility layer
6. Legal Positioning — required disclaimer
7. FAQ — 6 questions
8. Application form — Speed to Seed submission
9. Bottom Nav → Stage 04 CTA

### Stage 4 (Guide / Execute) — Key Sections
1. Hero — "This Is Where Deals Close."
2. What You Unlock — Due Diligence Framework + Advisor-Facilitated Structuring
3. Standards — execution protocol
4. Gate Check — redirect logic (active deal vs. return to Stage 3)
5. Gated Portal — Due Diligence Package access; Deal Structuring Session booking; Protocol Reminder
6. No bottom nav forward CTA — Stage 4 is the terminal stage

---

## Grid System

| Layout | Columns | Gap |
|---|---|---|
| Masterclass agenda cards | `md:grid-cols-3` | `gap-6` |
| Attendee archetype cards | `md:grid-cols-2` | `gap-6` |
| Social proof stats | `md:grid-cols-3` | `gap-8` |
| Stage 2 benefits cards | `md:grid-cols-2` | `gap-6` |
| Form fields (name row) | `md:grid-cols-2` | `gap-4` |
| CTA buttons (final section) | `sm:flex-row` | `gap-4` |

---

## Motion & Interaction

The prototype uses minimal, purposeful motion:

- **Scroll entrance:** `opacity: 1; transform: none` — elements enter on scroll with a subtle fade+lift (inferred from Figma Make animation defaults)
- **Parallax:** Hero background image uses `transform: scale(1.08)` to allow scroll parallax without clipping
- **Radial glows:** Animated via subtle `translateX/Y` transforms on the atmospheric overlays — slow, ambient movement
- **Pulse:** Active nav dot and badge indicator use `animate-pulse` (Tailwind)
- **Button hover:** `hover:opacity-90` — intentionally simple; no scale, no color shift
- **Input focus:** `border-color: #E8A020; outline: none` — gold border on focus, no glow

**Principle:** Motion should feel like a room settling, not a product demoing features.

---

## Accessibility

- **Color contrast:** Gold (`#E8A020`) on black (`#0A0A0A`) meets WCAG AA for large text. For small body text on `#1A1A1A`, verify contrast of `#CCCCCC` (passes AA at normal size).
- **Form inputs:** All inputs must have visible labels or accessible `aria-label` attributes — the prototype uses placeholder-only inputs, which must be supplemented for production.
- **Focus states:** Gold border focus ring on inputs is visible and intentional. Extend to buttons with `focus-visible:ring-2 focus-visible:ring-[#E8A020]`.
- **Fixed nav:** The 72px bottom nav must be accounted for with `padding-bottom: 72px` on the page body to prevent content obscuring.

---

## Approved Language Reference

Use these in all UI copy, microcopy, and system messages:

| Approved | Never Use |
|---|---|
| "Structured introductions" | "Raise capital through us" |
| "Alignment facilitation" | "Access funding" |
| "Capital conversations" | "Investor pool" |
| "Verified deal flow" | "Get funded fast" |
| "Facilitated matching" | "Investment guarantee" |
| "Curated room" | "Open community" |
| "Execution" | "Inspiration" |

**Stage-specific copy anchors:**
- Stage 1 = Access: *"Request your invitation"*
- Stage 2 = Legitimacy: *"Submit your documents"*
- Stage 3 = Leverage: *"Activate structured alignment"*
- Stage 4 = Execution: *"Access your due diligence package"*

---

## Background Image Treatment

The prototype sources background images from Unsplash and applies a consistent dark treatment:

```css
/* Hero background */
filter: brightness(0.12);   /* nearly black — texture only */

/* Section backgrounds */
filter: brightness(0.3);    /* visible but subordinate */

/* Blur variant */
filter: brightness(0.3) blur(2px);   /* atmospheric; no focal point */
```

For production: replace Unsplash URLs with licensed assets. Maintain the same brightness treatment to preserve design intent. Images are never the focus — they provide texture and depth.

---

## Footer

The platform uses a minimal footer embedded at the bottom of Stage 0 (not a persistent global footer):

```
The Growth Network
Invitation-only deal matching for serious operators and accredited capital.
City-based chapters. · Limited seats per chapter. · Member data shared only with mutual consent.
```

Typography: `14–15px`, `color: #CCCCCC` / `#888888`. No nav links. No social icons. Consistent with the confidential, members-only positioning.

---

## Do / Don't

| Do | Don't |
|---|---|
| Use `4px` border radius on cards and inputs | Use `12px+` radii — reads as consumer app |
| Use Barlow Condensed 800–900 for all hero headings | Use Inter for display headings |
| Use the gold top-border card treatment | Use uniform border-color on cards |
| Keep section labels small: `11px` uppercase `0.15em` tracking | Make section labels compete with headings |
| Layer radial gold glows on hero sections | Use flat black hero backgrounds |
| Use `filter: brightness(0.12)` on background images | Use readable, full-brightness background photos |
| Append ` →` to CTA button text | Use generic labels like "Submit" or "Click here" |
| Use the bottom fixed nav for stage progression | Add a top navigation bar |
| Keep form containers on `#111111` surface | Float forms on the page without a container |
| Use `box-shadow: rgba(232,160,32,0.3) 0px 0px 20px` on primary buttons | Use drop shadows with neutral colors |

---

*The Growth Network by Exoasia Innovation Hub — growthnetwork.exoasia.org*
*Confidential by default · Limited seats · Operator-led*
