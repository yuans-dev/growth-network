# AGENTS.md — The Growth Network Matching Platform

> **Project:** The Growth Network AI-Powered Matching Platform
> **Owner:** Exoasia Innovation Hub
> **Version:** v1.0 — March 2026
> **Tagline:** Where Serious Entrepreneurs Architect Exponential Growth

---

## Overview

This document defines the AI agents, automated workflows, and intelligent systems that power The Growth Network Matching Platform. It is the canonical reference for any developer, advisor, or contributor building on or integrating with the platform's agent layer.

The platform is not a social network or lead-generation tool. It is an **intelligent facilitation layer** — and the agents described here exist to serve that mission: moving verified members from discovery through to closed deals with institutional discipline.

### Governing Principle

> **Technology filters. Humans protect standards.**

Every agent output that affects introductions, access, or deal progression is subject to Growth Advisor review before it reaches a member. No agent acts autonomously on consequential decisions.

---

## Agent Inventory

| Agent | Trigger | Stages | Human Checkpoint |
|---|---|---|---|
| Matching Agent | Matching Cycle start (every 2–4 weeks) | 2+ | Growth Advisor match review |
| KYC & Verification Agent | Document submission | 2, 3, trigger-based | Growth Advisor access decision |
| Deal Board Agent | Continuous / card events | 3–4 | Advisor on stale flags & stage transitions |
| Member Progression Agent | Event-driven (attendance, docs, activity) | All | Advisor on inactivity, stage endorsement |
| Content & Communication Agent | Event-triggered (registrations, transitions) | All | Language enforcement rules (automated) |

---

## Agent 1 — Matching Agent

### Purpose
Generate compatibility-scored introduction recommendations for verified members each Matching Cycle.

### Activation
Triggered at the start of each Matching Cycle (every 2–4 weeks) for all Stage 2+ members with complete, active profiles.

### Inputs
- Member profile: sector focus, business stage, operational maturity, employee band, estimated annual revenue
- ASK/OFFER framework data (top 3 ASKs, top 3 OFFERs per member)
- Capital requirement or allocation mandate (for investor–operator matching)
- Growth thesis statement
- Verification tier: Light KYC / Full KYC / Enhanced DD

### Scoring Dimensions

| Dimension | Weight |
|---|---|
| Sector focus and vertical alignment | High |
| Business stage and operational maturity | High |
| ASK/OFFER strategic fit | High |
| Capital requirement / allocation mandate | Medium |
| Growth thesis compatibility | Medium |

Scores range from **0–100** and reflect structural compatibility — the degree to which two members' goals, capabilities, and timelines align — not superficial category overlap.

### Outputs
- **Top 5 Strategic Matches** per member per Matching Cycle
- **Compatibility score** (0–100) per pairing
- **Score rationale** — breakdown across each scoring dimension
- **Proposed introduction payload** — held in Advisor queue; never released directly to members

### Rules
- No introduction is released to either party without Growth Advisor approval and confirmed bilateral consent.
- Matches are re-evaluated fresh every Matching Cycle. Stale or rejected matches do not persist.
- Members with incomplete profiles or lapsed KYC are excluded from the cycle until resolved.
- The agent never surfaces member profile data to any counterpart — it produces internal proposals only.

### Human Checkpoint
A Growth Advisor reviews every proposed match before release. The Advisor may **Approve**, **Modify framing**, or **Block** the introduction. No exceptions.

---

## Agent 2 — KYC & Verification Agent

### Purpose
Orchestrate the multi-tier identity and business verification process, classify risk, unlock stage access upon successful completion, and maintain document expiry tracking.

### Activation
- **Light KYC:** Triggered by document submission at Stage 2 entry
- **Full KYC:** Triggered by Stage 3 entry request
- **Enhanced Due Diligence:** Triggered ad hoc by any risk flag

### Verification Tiers

#### Tier 1 — Light KYC (Stage 2 Entry)
- Registered business name, entity type, SEC / DTI / CDA registration numbers, TIN, date of incorporation
- Authorized signatory details
- Ultimate Beneficial Owner (UBO) disclosure — threshold: 25%+
- HQ and operating address with proof of address
- Website and social presence check
- PDPA-PH data privacy consent
- NDA-light acceptance
- Non-circumvention agreement acceptance

#### Tier 2 — Full KYC (Stage 3 Entry)
All Light KYC items, plus:
- SEC / DTI / CDA certificates (certified true copies)
- BIR Certificate of Registration
- Current Mayor's Permit or Business Permit
- Banking and payment details for disbursement verification
- Trade references (minimum 2)
- PEP (Politically Exposed Person) status declaration
- Sanctions exposure declaration
- Adverse media disclosure
- Data handling posture declaration

#### Tier 3 — Enhanced Due Diligence (Trigger-Based)
Activated when any of the following flags are present:
- High-risk country links
- PEP status confirmed
- Deal size above defined threshold
- Negative news or adverse media hits
- Sensitive data processing
- Regulated sector involvement

Enhanced DD scope:
- Beneficial ownership tracing (full UBO chain)
- Proof of funds / source of funds verification
- External watchdog checks (sanctions lists, AMLC advisories)
- Cyber posture assessment
- Video verification with authorized signatory

### Outputs
- **Risk classification:** Low / Medium / High (with documented rationale)
- **Access decision:** Approved / Approved with conditions / Declined
- **Document expiry tracker:** Alerts at 30 days and 7 days before permit or license renewal

### Human Checkpoint
Growth Advisors review KYC output and make the final access decision. All classifications and decisions require documented rationale before being applied to the member record.

---

## Agent 3 — Deal Board Agent

### Purpose
Manage deal card hygiene, enforce SLA rules, track stage progression, and surface stale or at-risk deals for Advisor intervention.

### Activation
Continuous background process. Triggered on: card creation, card updates, stage transitions, inactivity thresholds, and scheduled SLA sweeps.

### Deal Card Stages

| # | Stage | Entry Criteria | Exit Criteria |
|---|---|---|---|
| 1 | Discover / Qualified | ASK/OFFER logged; basic fit confirmed | Discovery call scheduled |
| 2 | Intro & Scoping | Curated intro completed; discovery call done | Scope drafted; problem confirmed |
| 3 | Proposal / Pilot | Proposal or quote sent; success metrics defined | Pilot design agreed |
| 4 | Negotiation / Legal | MoU/SOW redlines underway; compliance checks initiated | Terms agreed or rejected |
| 5 | Closed-Won / Pilot Go | Agreements signed; kickoff confirmed | — |
| 6 | Closed-Lost / On Hold | Reason code required | Learnings captured and archived |

### Card Fields Maintained by Agent
- **Fit Score** (0–100, populated by Matching Agent at introduction)
- **Confidence rating:** Low / Medium / High
- **Impact projection:** Monetary value (PHP / USD) and KPI impact estimate
- **Next action and due date**
- **Blocker flags**
- **Last-updated timestamp**

### SLA Hygiene Rules
- Cards without a next-action update within **7 days** → auto-flagged as stale; surfaced to Advisor dashboard
- Cards in Negotiation / Legal with no update for **14 days** → escalation alert to Advisor
- Closed-Lost cards require a **reason code** before archiving; cards without one cannot be archived
- Closed-Won cards require written member consent before deal is recorded and publicly recognized

### Outputs
- Stale card flags (to Advisor dashboard)
- Stage transition confirmations
- Escalation alerts
- Deal close record (with member consent)
- Metrics roll-up for KPI tracking layer

### Human Checkpoint
Advisors act on stale flags and escalation alerts. Stage transitions from **Proposal → Negotiation** and **Negotiation → Closed-Won** require Advisor confirmation.

### Example Deal Card
```
DL-0327 | "Reduce payroll errors by 80% — HRTech ⇄ Retail Co."
Buyer:    RetailCo PH (500–1k employees, CFO)
Provider: Sprout-Partner (SaaS)
Stage:    Proposal / Pilot
Value:    ₱1.8M/yr
Fit Score: 82 | Confidence: High
Next Step: Pilot SOW sign-off | Due: May 28
Blocker:  Security checklist pending
Impact:   ₱3.2M/yr estimated savings
```

---

## Agent 4 — Member Progression Agent

### Purpose
Track member activity, validate stage-progression criteria, manage Ad Credit balances, surface engagement signals to Advisors and Chapter Leads, and enforce inactivity rules.

### Activation
Event-driven — triggered by: attendance events, document submissions, pitch participation, referrals, and deal card activity.

### Stage Progression Logic

| From | To | Criteria |
|---|---|---|
| Stage 0 (Discover) | Stage 1 (Ignite) | Intake Call completed; invitation accepted |
| Stage 1 (Ignite) | Stage 2 (Match) | Light KYC submitted and approved; NDA-light and non-circumvention signed |
| Stage 2 (Match) | Stage 3 (Commit) | Full KYC approved; active deal activity demonstrated; Advisor endorsement |
| Stage 3 (Commit) | Stage 4 (Guide) | Invitation only; Advisor appointment — not earned through activity alone |

### Member Contribution Score — Tracked Inputs
- Weekly session attendance
- Monthly dinner attendance
- Pitch Night participation
- Referrals (tracked through to Stage 1 conversion)
- Deal card activity: cards created, stages advanced, cards closed
- Ad Credit usage

### Ad Credit System
- Credits are **earned** through attendance, contribution, and engagement milestones
- Credits are **spent** to promote member businesses within the network — visible to verified capital and operators
- Balance is tracked per member; expiry rules apply per credit batch
- Ad Credit history is surfaced on the member dashboard

### Inactivity Rules
- Stage 2 members without dinner attendance or matching activity for **30 days** → flagged for Advisor outreach
- Stage 2 members not meeting Stage 3 criteria within **90 days** → reviewed for stage retention or re-onboarding

### Outputs
- Member Contribution Score (composite; on member dashboard and Advisor panel)
- Stage progression notifications (to member and Advisor)
- Ad Credit balance and history
- Inactivity alerts (to Advisor and Chapter Lead)
- Chapter-level engagement digest (weekly, to Chapter Leads)

---

## Agent 5 — Content & Communication Agent

### Purpose
Deliver stage-appropriate communications, onboarding sequences, and event reminders. Enforce approved language standards across all automated member-facing output.

### Communication Sequences

| Trigger | Sequence |
|---|---|
| Stage 0 registration | Mini-masterclass access link; Intake Call booking prompt |
| Stage 1 onboarding | 1-minute intro video prompt; events calendar; pitch credit instructions |
| Stage 2 unlock | KYC submission instructions; NDA-light and non-circumvention signing links; profile activation confirmation |
| Stage 3 unlock | Matching profile activation; pathway selection (Structured Capital Cohort vs. Advisor-Led Preparation); standards reminder |
| Stage 4 unlock | Due diligence package access; deal structuring session booking |
| Match release | Introduction briefing (both parties); bilateral consent confirmation request |
| Document expiry | 30-day alert; 7-day alert; renewal instructions |

### Stage 3 Email Sequence (canonical)
- **Email 1** / Subject: `Stage 3 Access Confirmed` — activate matching profile prompt
- **Email 2** / Subject: `Choose Your Stage 3 Pathway` — Structured Capital Cohort vs. Advisor-Led Preparation
- **Email 3** / Subject: `Stage 3 Operating Standards` — accuracy, timeliness, confidentiality, accountability

### Language Enforcement

The agent must **never** use the following in any automated output:

| Prohibited | Approved Replacement |
|---|---|
| "Raise capital through us" | "Structured introductions" |
| "Access funding" | "Alignment facilitation" |
| "Investor pool" | "Capital conversations" |
| "Get funded fast" | "Verified deal flow" |
| "Investment guarantee" | "Facilitated matching" |

The following legal disclaimer must appear in all Stage 3 and Stage 4 automated communications and public-facing pages:

> *The Growth Network does not offer securities, solicit investments, or provide financial advice. All investment decisions and transactions are initiated and executed solely by participating members. The Network provides structured facilitation, infrastructure, and verified introductions only. Participation does not guarantee capital allocation, partnership formation, or transaction completion.*

---

## Consent & Privacy Rules — All Agents

All agents operate under the following non-negotiable constraints:

1. **No profile is shared with any counterpart without explicit bilateral consent.** The Matching Agent produces proposals; it does not release introductions.
2. **Member data is governed by PDPA-PH.** No member data is transmitted externally without explicit written consent.
3. **Profile visibility is gated by stage and match confirmation status.** Agents may not surface full profiles outside confirmed, consent-verified matches.
4. **KYC documents are accessible only to Growth Advisors and authorized platform administrators.**
5. **Deal card data is visible to deal participants and Growth Advisors only.** Cross-member visibility requires consent.

---

## Platform KPIs — Agent Tracking Layer

| Metric | Source Agent | Description |
|---|---|---|
| Intro-to-Proposal Rate | Deal Board Agent | % of curated introductions advancing to Proposal or Pilot |
| Proposal-to-Close Rate | Deal Board Agent | % of proposals resulting in Closed-Won or Pilot Go |
| Average Deal Cycle Time | Deal Board Agent | Days from first introduction to deal close |
| Average Deal Value | Deal Board Agent | Monetary value of closed deals (PHP / USD) |
| Advisor Match Accuracy | Matching + Advisor Panel | Win rate on Advisor-approved introductions |
| Verification Completion Rate | KYC Agent | % of Stage 1 completing Light KYC within 30 days |
| Stage Progression Rate | Progression Agent | % advancing Stage 1 → 2 → 3 |
| Card Freshness Score | Deal Board Agent | % of cards updated within 7 days |
| Chapter Engagement Rate | Progression Agent | Attendance consistency per chapter |
| Member Contribution Score | Progression Agent | Composite per member |
| Masterclass Conversion Rate | Content Agent | % of Stage 0 attendees registering for Stage 1 |
| Dinner Attendance Rate | Progression Agent | % of Stage 1 attending monthly dinner |
| Incubation Enrollment Rate | Progression Agent | % of Stage 2 enrolling in 30-Day Incubation Program |
| Speed to Seed Enrollment Rate | Progression Agent | % of Stage 3 enrolling in Speed to Seed |

---

## Implementation Phases

| Phase | Focus | Agents Active |
|---|---|---|
| Phase 1 | Foundation | Content Agent (Stage 0–1 sequences only) |
| Phase 2 | Verification Layer | KYC Agent; Content Agent |
| Phase 3 | Matching Engine | Matching Agent; Content Agent |
| Phase 4 | Deal Board | Deal Board Agent; Matching Agent; Content Agent |
| Phase 5 | Deal Execution | All agents; Enhanced DD workflows; Full KYC portal |
| Phase 6 | Scale & Chapters | All agents; cross-chapter matching; Chapter Lead dashboards |

---

## Governance

- **Growth Advisors** are the human checkpoint for all consequential agent outputs — matches, KYC approvals, deal stage transitions, and escalations.
- **Platform Administrators** manage agent configuration, document access controls, and system-level rules.
- **Chapter Leads / Community Builders** receive agent-generated engagement summaries and inactivity alerts for their chapter members.
- No agent may bypass the Advisor review layer for any introduction, access decision, or deal stage transition.

---

*The Growth Network by Exoasia Innovation Hub — growthnetwork.exoasia.org*
*Confidential by default · Limited seats · Operator-led*
