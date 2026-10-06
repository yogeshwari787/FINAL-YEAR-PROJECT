# Meeting Assistant - Video Speech-to-Text & Diarization System

A full-stack application built for local execution (**localhost**) that handles meeting video upload, automated high-quality audio extraction using `ffmpeg`, AI speech transcription & speaker diarization via **Sarvam AI (`saaras:v3`)**, and interactive video playback synchronized with line-by-line speaker transcripts.

---

## 🏗️ Architecture Overview

- **Backend**: FastAPI (Python 3.14+) running on `http://localhost:8000`
  - Audio extraction via `ffmpeg` (PCM WAV 16kHz mono)
  - Sarvam AI Speech-to-Text API (`saaras:v3` model with speaker diarization)
  - Video streaming server & JSON storage
- **Frontend**: React + Vite + Lucide Icons running on `http://localhost:3000`
  - Glassmorphic dark UI with live video player
  - Interactive transcript: click any line to seek video directly to that exact moment
  - Filter transcript search & TXT export

---

## 🚀 Quick Start Guide (Run on Localhost)

### Step 1: Start the Backend (FastAPI)

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd "/Users/lohithnandyal/Desktop/FINAL YEAR PROJECT/backend"
   ```

2. Activate the Python virtual environment:
   ```bash
   source venv/bin/activate
   ```

3. (Optional) Set your Sarvam AI API Key in `.env`:
   ```env
   SARVAM_API_KEY=your_actual_sarvam_subscription_key
   ```
   *Note: If no API key is set, the application will automatically run in local Demo Mode with simulated transcripts so you can test all video playback features immediately.*

4. Start the FastAPI server:
   ```bash
   python main.py
   ```
   *Backend will run at:* `http://localhost:8000`

---

### Step 2: Start the Frontend (Vite / React)

1. Open a **new** terminal window and navigate to the `frontend` folder:
   ```bash
   cd "/Users/lohithnandyal/Desktop/FINAL YEAR PROJECT/frontend"
   ```

2. Start the development web server:
   ```bash
   npm run dev
   ```

3. Open your browser and go to:
   ```text
   http://localhost:3000
   ```

---

## 🎯 How to Use the App

1. **Upload Video**: Click on the upload dropzone or select any meeting recording (`.mp4`, `.webm`, `.mov`).
2. **Automated Processing**: The backend extracts audio and runs Sarvam AI speech transcription.
3. **Synchronized Playback**:
   - Play the meeting video in the embedded player.
   - Click on any transcript block or speaker line to instantly jump the video playback to that exact timestamp!
4. **Export**: Export complete speaker-diarized transcript notes to TXT.
