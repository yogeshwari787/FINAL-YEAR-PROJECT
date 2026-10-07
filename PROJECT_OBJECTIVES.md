# Project Overview: Criminal Investigation Tracker with AI Visual Crime Reconstruction

## 📌 Project Title
**Criminal Investigation Tracker with AI-Assisted Visual Crime Scene Reconstruction & 3-Tier Cryptographic Access Control**

---

## 🎯 Formal Project Objectives (Flagship Evaluation & Defense Criteria)

### 1. AI-Assisted Visual Crime Scene Reconstruction Video Engine (CORE FLAGSHIP OBJECTIVE)
- **Description**: Synthesize a comprehensive, chronological visual reconstruction video demonstrating how the crime unfolded based on collected evidence, incident timelines, and AI suspect predictions. Unlike a simple text slideshow, the engine generates an animated forensic simulation featuring scenario-adaptive blueprints, animated figure movements, dynamic action sequences, escape tracking, and natural speech narration.
- **Key Deliverables**:
  - **5-Stage Chronological Simulation Architecture**:
    1. *Stage 1 — Tactical Incident Blueprint*: Perimeter coordinates, target crime zones, entrance and security sectors rendered as a forensic grid map.
    2. *Stage 2 — Infiltration Trajectory*: Animated suspect figures, entry vector arrows, CCTV vision cones, and security bypass markers.
    3. *Stage 3 — Crime Execution Simulation*: Scenario-adaptive incident animations (Bank vault locking wheel rotation, Jewelry glass diamond cutter, Museum mainframe terminal data download, Highway spike-strip armored truck halt, Pharmaceutical cold vault breach, Warehouse arson ignition).
    4. *Stage 4 — Movement & Getaway Corridor*: Vector escape tracking depicting getaway vehicles (Sedan, Motorcycle, Pickup Truck, Delivery Van) fleeing through recorded corridors.
    5. *Stage 5 — AI Suspect Dossier & Biometrics*: High-confidence suspect prediction profile, biometric targeting reticle, motive analysis, and alibi status summary.
  - **Dynamic Audio Storytelling**: Case-specific voice narration synthesized via `gTTS` explaining the exact step-by-step timeline of events.
  - **Forensic Disclaimer & Legal Evidence Badging**: Clear forensic disclaimers distinguishing factual evidence items from AI-simulated inferences.
  - **Downloadable MP4 Export**: High-performance FFmpeg rendering producing shareable `.mp4` video files accessible across all roles.

---

### 2. AI-Powered Suspect Prediction, Recidivism Risk Scoring & Cross-Case Suspect Correlation
- **Description**: Automatically analyze collected crime evidence, physical artifacts, motives, and unverified alibis to predict primary suspects with mathematical confidence percentages, while simultaneously running automated cross-case correlation to detect serial offenders across jurisdiction sectors.
- **Key Deliverables**:
  - Automated suspect identification dossier with AI confidence meter (e.g. 91.4%), motive breakdown, and risk classification (`CRITICAL`, `HIGH`, `MODERATE`).
  - **Previous Suspect Matching Engine**: Scans all cases across sectors in MongoDB to detect repeat offenders by name, alias, and Modus Operandi.
  - **Recidivism Risk Alerts**: Flags repeat offenders as `EXTREME (SERIAL OFFENDER)` or `CRITICAL (REPEAT SUSPECT)` with links to previous Case IDs, sectors, and past crime locations.
  - **Live Case Entry Warning**: Real-time alert during case creation when an investigator inputs a suspect who has a prior criminal record.
  - Evidence-to-suspect correlation registry directly embedded into the investigation workflow.

---

### 3. 3-Tier Law Enforcement Hierarchy & Strict Chain-of-Command Access Control
- **Description**: Enforce a strict 3-tier constitutional chain-of-command across law enforcement roles, ensuring separation of duties for field evidence logging, forensic auditing, and executive clearance.
- **Key Deliverables**:
  - **3 Distinct Tiers & Credentials**:
    1. **Tier 1: Investigator** (`investigator` / `investigator@123`): Field investigator on the ground at the crime scene. **Sole role with permission to log new cases and upload crime scene photos**, review AI suspect predictions, and generate visual reconstruction videos.
    2. **Tier 2: Police Officer / Forensics** (`officer` / `officer@456`): Forensic audit authority. Inspects uploaded crime scene photos, cross-examines physical evidence against timeline records, and submits forensic verification findings to MongoDB. Cannot log cases or upload photos.
    3. **Tier 3: Commissioner (Chief of Police)** (`commissioner` / `commissioner@789`): Supreme executive authority. Reviews uploaded crime scene photos, evidence dossiers, and forensic audits to grant/restrict investigator clearance, delegate sector jurisdictions, and issue final case approval or rejection decisions. Does not perform data entry or photo uploads.
  - **Master Clearance Toggle**: Commissioner controls whether investigators have clearance to proceed on sensitive cases.

---

### 4. Cryptographic Security, Immutable Audit Trail & Authentication Tracking
- **Description**: Protect sensitive law enforcement dossiers and operational sessions from unauthorized alteration, tampering, or leaks through cryptographic encryption, immutable audit trails, and strict session tracking.
- **Key Deliverables**:
  - **AES-256 Protection**: Cryptographic sealing of sensitive case fields.
  - **SHA-256 Digital Hash Stamp**: Every case modification generates an immutable digital signature.
  - **User Login & Logout Session Tracking**: Tamper-proof logging of every authentication event (`USER_LOGIN` / `USER_LOGOUT`) with timestamp, authority tier, workstation IP, and SHA-256 session integrity seal.
  - **Dashboard Audit Trail**: Real-time chronological audit table showing timestamp, case ID, actor, security seals, and action descriptions.

---

### 5. Multilingual Audio/Video Interrogation Diarization (Sarvam AI Integration)
- **Description**: Process recorded suspect interrogations, witness statements, and CCTV audio using Sarvam AI to produce speaker-diarized, timestamped transcripts synced with media playback.
- **Key Deliverables**:
  - FFmpeg automated audio track extraction from interrogations.
  - Interactive transcript viewer where clicking any line instantly seeks the media player to that exact spoken moment.

---

### 6. Centralized NoSQL MongoDB Persistence with Resilient Fallback
- **Description**: Scalable document storage persisting hundreds of cases with an automatic local file JSON fallback ensuring zero data loss if MongoDB is offline.
- **Key Deliverables**:
  - Primary NoSQL storage in MongoDB (`crime_investigation_db.cases`).
  - Automatic zero-configuration fallback to `backend/uploads/db_store/case_{case_id}.json`.

---

### 7. Formal Case Dossier / Investigation Report & High-Definition PDF Generation
- **Description**: Provide professional law enforcement report generation transforming raw database cases into formalized, courtroom-ready Case Dossiers / Investigation Reports with direct PDF export.
- **Key Deliverables**:
  - **Professional Action Buttons**:
    - `📄 Generate Case Dossier` (dashboard creation workflow for Tier 1 Investigators).
    - `👁 View Case Dossier` (comprehensive case dossier & forensic evidence view across all tiers).
    - `⬇ Download PDF` (direct instant download of official law enforcement investigation dossier PDF).
  - **ReportLab PDF Engine**: Automated compilation of case summaries, biometric risk scores, timeline stages, forensic evidence checklists, cryptographic integrity signatures, and commissioner directives.

---

## 📊 Complete System Architecture Diagram

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        3-TIER LAW ENFORCEMENT HIERARCHY                │
│  ┌───────────────────────┐  ┌──────────────────┐  ┌─────────────────┐  │
│  │     INVESTIGATOR      │  │  POLICE OFFICER  │  │  COMMISSIONER   │  │
│  │ (Log Cases & Trigger) │  │ (Evidence Audit) │  │(Clearance/Decide│  │
│  └───────────┬───────────┘  └────────┬─────────┘  └────────┬────────┘  │
└──────────────┼───────────────────────┼─────────────────────┼───────────┘
               │                       │                     │
               ▼                       ▼                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  SECURITY & CLEARANCE VALIDATION LAYER                 │
│         [ Commissioner Clearance Check: GRANTED vs RESTRICTED ]        │
│          [ AES-256 Cryptographic Seal + SHA-256 Digital Hash ]          │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│               CORE FLAGSHIP: AI VIDEO RECONSTRUCTION ENGINE            │
│  ┌───────────────────────┐   ┌──────────────────────────────────────┐  │
│  │ Tactical 2D Blueprint │──>│ Animated Infiltration & Action Vector│  │
│  └───────────────────────┘   └──────────────────┬───────────────────┘  │
│                                                 ▼                      │
│  ┌───────────────────────┐   ┌──────────────────────────────────────┐  │
│  │ gTTS Speech Narration │──>│  FFmpeg MP4 Visual Scene Synthesizer │  │
│  └───────────────────────┘   └──────────────────┬───────────────────┘  │
│                                                 ▼                      │
│                                   [ Final Reconstructed MP4 Video ]    │
└────────────────────────────────────────────────────────────────────────┘
```
