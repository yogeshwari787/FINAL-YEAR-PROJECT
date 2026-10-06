import os
import uuid
import shutil
import json
from pathlib import Path
from typing import Dict, Any, List, Optional

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from dotenv import load_dotenv

from services.audio_extractor import extract_audio_from_video
from services.sarvam_service import SarvamService
from services.video_engine import generate_reconstruction_video
from services.mongo_service import MongoService

load_dotenv()

app = FastAPI(
    title="Criminal Investigation Tracker & Cartoon Video Engine API",
    description="Role-based Criminal Investigation Tracker with Copy-Paste Case Creation",
    version="3.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories
BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
VIDEOS_DIR = UPLOAD_DIR / "videos"
RECONSTRUCTIONS_DIR = UPLOAD_DIR / "reconstructions"
AUDIO_DIR = UPLOAD_DIR / "audio"
RESULTS_DIR = UPLOAD_DIR / "results"

for d in [UPLOAD_DIR, VIDEOS_DIR, RECONSTRUCTIONS_DIR, AUDIO_DIR, RESULTS_DIR]:
    d.mkdir(parents=True, exist_ok=True)

app.mount("/media/videos", StaticFiles(directory=str(VIDEOS_DIR)), name="videos")
app.mount("/media/reconstructions", StaticFiles(directory=str(RECONSTRUCTIONS_DIR)), name="reconstructions")

sarvam_service = SarvamService()
mongo_service = MongoService()

class OfficerVerifyRequest(BaseModel):
    officer_name: str
    findings_notes: str
    verified_status: str

class CommissionerDecisionRequest(BaseModel):
    commissioner_name: str
    decision: str
    comments: str

class CreateCaseRequest(BaseModel):
    case_id: Optional[str] = None
    title: str
    location: str
    timestamp: str
    evidence: List[str]
    timeline: List[str]
    suspect_name: str
    suspect_alias: str
    confidence: str
    motive: str
    risk_level: str

# Seed default cases if none exist
def seed_default_cases():
    existing = mongo_service.list_cases()
    if not existing:
        sample_cases = [
            {
                "case_id": "CR-2026-101",
                "title": "Central Bank Armed Robbery",
                "location": "Downtown Financial District, Vault B",
                "timestamp": "2026-10-04 02:45 AM",
                "status": "Under Investigation",
                "commissioner_approval": "PENDING",
                "officer_verification": {
                    "officer_name": "Officer David Miller",
                    "notes": "Fingerprint match confirmed on Vault lock handle.",
                    "status": "Evidence Verified"
                },
                "evidence": [
                    "CCTV Footage from Entrance North",
                    "Discovered Fingerprints on Vault Lock",
                    "Recovered Getaway Vehicle (Black Sedan)"
                ],
                "timeline": [
                    "02:42 AM - Perimeter alarm bypassed via unauthorized keycard.",
                    "02:45 AM - Two masked individuals breached secondary vault security door.",
                    "02:49 AM - Vault contents accessed; security guard disarmed.",
                    "02:53 AM - Suspects fled through rear service corridor into getaway vehicle."
                ],
                "suspect_prediction": {
                    "name": "Marcus Vance",
                    "alias": "The Architect",
                    "confidence": "91.4%",
                    "motive": "Financial Debt & High-Yield Asset Theft",
                    "alibi_status": "Unverified (Claims home during incident)",
                    "risk_level": "CRITICAL"
                },
                "video_reconstruction": None
            }
        ]
        for c in sample_cases:
            mongo_service.insert_or_update_case(c["case_id"], c)

seed_default_cases()

@app.get("/")
def read_root():
    return {"status": "online", "message": "Criminal Investigation API is running"}

@app.get("/api/cases")
def list_cases():
    return mongo_service.list_cases()

@app.get("/api/cases/{case_id}")
def get_case(case_id: str):
    c = mongo_service.get_case(case_id)
    if not c:
        raise HTTPException(status_code=404, detail="Case not found")
    return c

# --- COPY & PASTE CASE CREATION + CARTOON VIDEO GENERATION ---

@app.post("/api/investigator/cases/create-and-generate")
def create_case_and_generate_video(req: CreateCaseRequest):
    case_id = req.case_id or f"CR-2026-{uuid.uuid4().hex[:4].upper()}"
    
    case_data = {
        "case_id": case_id,
        "title": req.title,
        "location": req.location,
        "timestamp": req.timestamp,
        "status": "Under Investigation",
        "commissioner_approval": "PENDING",
        "officer_verification": {
            "officer_name": "Pending Officer Review",
            "notes": "Awaiting forensic audit",
            "status": "Pending"
        },
        "evidence": req.evidence,
        "timeline": req.timeline,
        "suspect_prediction": {
            "name": req.suspect_name,
            "alias": req.suspect_alias,
            "confidence": req.confidence,
            "motive": req.motive,
            "alibi_status": "Unverified",
            "risk_level": req.risk_level
        },
        "video_reconstruction": None
    }

    # Generate Cartoon Video
    video_filename = f"{case_id}_reconstruction.mp4"
    output_video_path = str(RECONSTRUCTIONS_DIR / video_filename)

    try:
        generate_reconstruction_video(case_data, output_video_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cartoon Video Engine failed: {str(e)}")

    video_url = f"/media/reconstructions/{video_filename}"
    case_data["video_reconstruction"] = {
        "video_path": output_video_path,
        "video_url": video_url,
        "status": "Generated",
        "file_name": video_filename
    }

    # Store in MongoDB
    mongo_service.insert_or_update_case(case_id, case_data)

    return {
        "message": "New case created and Cartoon Reconstruction Video generated successfully!",
        "case": case_data
    }

@app.post("/api/investigator/cases/{case_id}/generate-reconstruction-video")
def generate_crime_video(case_id: str):
    case = mongo_service.get_case(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    video_filename = f"{case_id}_reconstruction.mp4"
    output_video_path = str(RECONSTRUCTIONS_DIR / video_filename)

    try:
        generate_reconstruction_video(case, output_video_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cartoon Video Engine failed: {str(e)}")

    video_url = f"/media/reconstructions/{video_filename}"
    case["video_reconstruction"] = {
        "video_path": output_video_path,
        "video_url": video_url,
        "status": "Generated",
        "file_name": video_filename
    }
    mongo_service.insert_or_update_case(case_id, case)

    return {
        "message": "Cartoon Crime Reconstruction Video generated successfully",
        "case_id": case_id,
        "video_url": video_url,
        "mongo_status": "Saved to MongoDB database"
    }

@app.post("/api/officer/cases/{case_id}/verify")
def officer_verify_case(case_id: str, req: OfficerVerifyRequest):
    case = mongo_service.get_case(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    case["officer_verification"] = {
        "officer_name": req.officer_name,
        "notes": req.findings_notes,
        "status": req.verified_status
    }
    case["status"] = req.verified_status
    mongo_service.insert_or_update_case(case_id, case)
    return {"message": "Officer verification findings updated in MongoDB", "case": case}

@app.post("/api/commissioner/cases/{case_id}/decision")
def commissioner_case_decision(case_id: str, req: CommissionerDecisionRequest):
    case = mongo_service.get_case(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    case["commissioner_approval"] = req.decision
    case["commissioner_comments"] = req.comments
    if req.decision == "APPROVED":
        case["status"] = "Case Closed (Approved by Commissioner)"
    else:
        case["status"] = "Re-Investigation Requested (Rejected by Commissioner)"

    mongo_service.insert_or_update_case(case_id, case)
    return {"message": f"Commissioner decision recorded: {req.decision}", "case": case}

jobs_db: Dict[str, Dict[str, Any]] = {}

@app.post("/api/upload")
async def upload_video(file: UploadFile = File(...), api_key: str = Form(None)):
    job_id = str(uuid.uuid4())
    file_ext = Path(file.filename).suffix or ".mp4"
    video_filename = f"{job_id}{file_ext}"
    video_path = VIDEOS_DIR / video_filename
    
    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    audio_path = AUDIO_DIR / f"{job_id}.wav"
    extract_audio_from_video(str(video_path), str(audio_path))

    active_service = SarvamService(api_key=api_key) if api_key else sarvam_service
    stt_result = active_service.transcribe_audio(str(audio_path), with_diarization=True)

    job_record = {
        "job_id": job_id,
        "original_filename": file.filename,
        "video_url": f"/media/videos/{video_filename}",
        "audio_path": str(audio_path),
        "status": "completed",
        "result": stt_result
    }

    jobs_db[job_id] = job_record
    return job_record

@app.get("/api/jobs")
def get_jobs():
    return list(jobs_db.values())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
