# Project Overview: Criminal Investigation Tracker with Suspect Prediction

## 📌 Project Title
**Criminal Investigation Tracker with Suspect Prediction**

---

## 🎯 Proposed Project Objectives (Simple & Impactful for Final Year Evaluation)

### 1. Centralized Investigation Case Tracking
- **Description**: Provide a secure, centralized dashboard for law enforcement and investigators to log, organize, and track active crime cases, evidence items, and incident timelines.
- **Key Deliverable**: MongoDB database integration storing structured case dossiers and evidence items.

### 2. AI-Powered Suspect Prediction & Risk Scoring
- **Description**: Evaluate crime scene evidence, witness reports, motives, and unverified alibis to predict primary suspects alongside confidence percentage scores and risk levels.
- **Key Deliverable**: Automated Suspect Profile card displaying suspect identity, motive analysis, alibi verification, and risk rating.

### 3. Automated Crime Scene Reconstruction Video Engine
- **Description**: Synthesize a visual timeline demo video based on case details to provide investigators with a step-by-step visual narration of how the crime unfolded.
- **Key Deliverable**: Python Video Engine using Pillow, gTTS audio narration, and FFmpeg to generate and serve downloadable MP4 crime reconstruction videos.

### 4. Interactive Audio/Video Evidence Transcription (Sarvam AI Integration)
- **Description**: Process suspect interrogations, witness audio recordings, and CCTV video audio to automatically generate speaker-diarized transcripts synced directly with media playback.
- **Key Deliverable**: Synced Video & Transcript player where clicking any dialogue line immediately seeks the video to that exact timestamp.

---

## 📊 Suggested Architecture Diagram for Presentation (PPT)

```text
[ Case Input / Evidence Log ] ──> [ MongoDB Database ]
                                        │
                                        ▼
                         [ Suspect Prediction Model ]
                                        │
                                        ▼
                     [ Python Crime Video Engine (FFmpeg) ]
                                        │
                                        ▼
             [ Investigator Dashboard (Play / Download / Transcribe) ]
```

---

## 💡 Key Highlights to Emphasize During Final Year Demo
1. **End-to-End Automation**: From entering case details to generating a full narrated crime video demo.
2. **Local Execution**: Runs completely on `localhost` without requiring cloud hosting subscriptions.
3. **Dual Multimedia Capability**: Handles both Crime Scene Reconstruction Videos and Speech-to-Text Interrogation Analysis.
