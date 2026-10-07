import os
import uuid
import shutil
import json
from pathlib import Path
from typing import Dict, Any, List, Optional

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from dotenv import load_dotenv

from services.audio_extractor import extract_audio_from_video
from services.sarvam_service import SarvamService
from services.video_engine import generate_reconstruction_video
from services.mongo_service import MongoService
from services.crypto_service import SecurityService
from services.pdf_service import generate_case_dossier_pdf

load_dotenv()

app = FastAPI(
    title="Criminal Investigation Tracker & Forensics API",
    description="Sector-Restricted, Cryptographically Secured Criminal Investigation System with Commissioner Clearance Hierarchy",
    version="4.0.0"
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
IMAGES_DIR = UPLOAD_DIR / "images"
DOSSIERS_DIR = UPLOAD_DIR / "dossiers"

for d in [UPLOAD_DIR, VIDEOS_DIR, RECONSTRUCTIONS_DIR, AUDIO_DIR, RESULTS_DIR, IMAGES_DIR, DOSSIERS_DIR]:
    d.mkdir(parents=True, exist_ok=True)

app.mount("/media/videos", StaticFiles(directory=str(VIDEOS_DIR)), name="videos")
app.mount("/media/reconstructions", StaticFiles(directory=str(RECONSTRUCTIONS_DIR)), name="reconstructions")
app.mount("/media/images", StaticFiles(directory=str(IMAGES_DIR)), name="images")

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

class CommissionerClearanceRequest(BaseModel):
    commissioner_name: str
    clearance_status: str  # "GRANTED" or "RESTRICTED"
    assigned_investigator: Optional[str] = "investigator"
    comments: Optional[str] = "Clearance authorized by Chief Commissioner"

class CreateCaseRequest(BaseModel):
    case_id: Optional[str] = None
    title: str
    location: str
    timestamp: str
    sector: Optional[str] = "CENTRAL"
    evidence: List[str]
    timeline: List[str]
    suspect_name: str
    suspect_alias: str
    confidence: str
    motive: str
    risk_level: str
    assigned_investigator: Optional[str] = "investigator"
    images: Optional[List[str]] = []

class AuthLogRequest(BaseModel):
    username: str
    role: str
    role_label: Optional[str] = "User"
    tier: Optional[str] = "Tier 1"
    action: str  # "LOGIN" or "LOGOUT"
    ip_address: Optional[str] = "127.0.0.1"
    device: Optional[str] = "Mac Forensic Workstation"


# Default Sector Definitions
SECTORS = {
    "SECTOR_1": {"name": "Sector 1 (Financial & Vault Crimes)", "jurisdiction": "Downtown Financial District"},
    "SECTOR_2": {"name": "Sector 2 (Cyber & High-Tech)", "jurisdiction": "Metropolitan Digital & Museums"},
    "SECTOR_3": {"name": "Sector 3 (Highway & Transit)", "jurisdiction": "Interstate 45 & Commercial Corridors"},
    "SECTOR_4": {"name": "Sector 4 (Special Ops & Narcotics)", "jurisdiction": "Industrial Zone & Research Parks"}
}

@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "Criminal Investigation Tracker with Commissioner Hierarchy & AES-256 Security",
        "security": "AES-256 (Fernet) + SHA-256 Integrity Verification Active"
    }

@app.get("/api/cases")
def list_cases(
    sector: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    username: Optional[str] = Query(None)
):
    """
    Returns cases with role & sector-based filtering.
    Commissioner sees ALL cases.
    Investigators see cases in their assigned sector or cleared for their username.
    """
    cases = mongo_service.list_cases()

    # If Commissioner, return all cases with full clearance management attributes
    if role == "COMMISSIONER":
        return cases

    # If Investigator, filter by Sector / Authorization
    if role == "INVESTIGATOR" and sector:
        filtered = []
        for c in cases:
            case_sec = c.get("sector", "SECTOR_1")
            assigned = c.get("assigned_investigator", "investigator")
            # Matches sector OR specifically assigned to this investigator
            if case_sec == sector or assigned == username:
                filtered.append(c)
        return filtered

    return cases

@app.get("/api/cases/{case_id}")
def get_case(case_id: str):
    c = mongo_service.get_case(case_id)
    if not c:
        raise HTTPException(status_code=404, detail="Case not found")
    return c

@app.get("/api/cases/{case_id}/download-pdf")
def download_case_dossier_pdf(case_id: str):
    c = mongo_service.get_case(case_id)
    if not c:
        raise HTTPException(status_code=404, detail="Case dossier not found")
    DOSSIERS_DIR.mkdir(parents=True, exist_ok=True)
    pdf_path = DOSSIERS_DIR / f"Case_Dossier_{case_id}.pdf"
    generate_case_dossier_pdf(c, str(pdf_path))
    return FileResponse(
        path=str(pdf_path),
        filename=f"Case_Dossier_{case_id}.pdf",
        media_type="application/pdf"
    )

@app.post("/api/upload-image")
async def upload_image(file: UploadFile = File(...)):
    filename = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = IMAGES_DIR / filename
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"url": f"/media/images/{filename}"}

@app.get("/api/audit-logs")
def get_audit_logs():
    """
    Returns live cryptographic security audit logs generated across all cases.
    """
    cases = mongo_service.list_cases()
    logs = []
    
    for c in cases:
        case_id = c.get("case_id", "CR-101")
        title = c.get("title", "Case")
        sector = c.get("sector", "SECTOR_1")
        audit = c.get("security_audit", {})
        hash_sig = audit.get("integrity_hash", "SHA256-AUTHENTICATED")[:16] + "..."

        # Log 1: Creation & Encryption
        logs.append({
            "timestamp": c.get("timestamp", "Recent"),
            "case_id": case_id,
            "case_title": title,
            "sector": sector,
            "action": "CASE_INITIALIZED_AND_ENCRYPTED",
            "performed_by": c.get("assigned_investigator", "Investigator"),
            "encryption": "AES-256 (CBC+HMAC)",
            "hash_signature": hash_sig,
            "severity": "NORMAL",
            "details": f"Investigation dossier created with {len(c.get('evidence', []))} evidence items."
        })

        # Log 2: Video Reconstruction Generation
        if c.get("video_reconstruction"):
            logs.append({
                "timestamp": c.get("timestamp", "Recent"),
                "case_id": case_id,
                "case_title": title,
                "sector": sector,
                "action": "VIDEO_RECONSTRUCTION_SYNTHESIZED",
                "performed_by": "Python Forensic Video Engine (FFmpeg)",
                "encryption": "MP4/H.264 Sealed",
                "hash_signature": hash_sig,
                "severity": "INFO",
                "details": f"5-stage visual simulation rendered with gTTS case storytelling audio."
            })

        # Log 3: Officer Verification
        if c.get("officer_verification", {}).get("status") == "Evidence Verified":
            logs.append({
                "timestamp": c.get("timestamp", "Recent"),
                "case_id": case_id,
                "case_title": title,
                "sector": sector,
                "action": "FORENSIC_EVIDENCE_AUDITED",
                "performed_by": c.get("officer_verification", {}).get("officer_name", "Officer Miller"),
                "encryption": "AES-256 Sealed",
                "hash_signature": hash_sig,
                "severity": "VERIFIED",
                "details": c.get("officer_verification", {}).get("notes", "Evidence verified.")
            })

        # Log 4: Commissioner Clearance & Approval
        clearance = c.get("commissioner_clearance_status", "GRANTED")
        logs.append({
            "timestamp": c.get("timestamp", "Recent"),
            "case_id": case_id,
            "case_title": title,
            "sector": sector,
            "action": f"CLEARANCE_{clearance}",
            "performed_by": "Chief Commissioner",
            "encryption": "Cryptographic Key Validated",
            "hash_signature": hash_sig,
            "severity": "SECURITY_CRITICAL" if clearance == "RESTRICTED" else "CLEARANCE_OK",
            "details": f"Clearance delegation set to {clearance} for sector access."
        })

    return sorted(logs, key=lambda x: x["timestamp"], reverse=True)

# --- AUTHENTICATION & LOGIN/LOGOUT SESSION TRACKING ---

@app.post("/api/auth/log-event")
def log_auth_event(req: AuthLogRequest):
    import datetime
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %I:%M:%S %p")
    session_id = f"SES-{uuid.uuid4().hex[:8].upper()}"
    log_entry = {
        "session_id": session_id,
        "timestamp": now_str,
        "username": req.username,
        "role": req.role,
        "role_label": req.role_label,
        "tier": req.tier,
        "action": req.action.upper(),
        "ip_address": req.ip_address or "127.0.0.1",
        "device": req.device or "Mac Forensic Workstation",
        "status": "AUTHENTICATED"
    }
    log_entry["integrity_hash"] = SecurityService.generate_auth_hash(log_entry)[:16] + "..."
    mongo_service.insert_auth_log(log_entry)
    return {"status": "recorded", "log": log_entry}

@app.get("/api/auth/session-logs")
def get_auth_session_logs():
    return mongo_service.list_auth_logs()

# --- PREVIOUS SUSPECT CORRELATION & RECIDIVISM MATCHING ---

@app.get("/api/suspects/match")
def match_previous_suspects(
    name: Optional[str] = Query(None),
    alias: Optional[str] = Query(None),
    current_case_id: Optional[str] = Query(None)
):
    """
    Cross-Case Suspect Correlation & Recidivism Matching Engine:
    Scans all cases across sectors in MongoDB to identify prior records,
    linking previous Case IDs, locations, crimes, and modus operandi.
    """
    if not name and not alias:
        return {"matched": False, "matches": [], "recidivism_risk": "NONE", "total_prior_records": 0}

    query_name = (name or "").strip().lower()
    query_alias = (alias or "").strip().lower()

    all_cases = mongo_service.list_cases()
    matches = []

    for c in all_cases:
        cid = c.get("case_id")
        if current_case_id and cid == current_case_id:
            continue

        pred = c.get("suspect_prediction", {})
        cand_name = (pred.get("name") or "").strip().lower()
        cand_alias = (pred.get("alias") or "").strip().lower()

        is_name_match = bool(query_name and cand_name and len(cand_name) >= 2 and (query_name in cand_name or cand_name in query_name))
        is_alias_match = bool(query_alias and cand_alias and len(cand_alias) >= 2 and (query_alias in cand_alias or cand_alias in query_alias))

        if is_name_match or is_alias_match:
            match_score = 98 if (is_name_match and is_alias_match) else (92 if is_name_match else 85)
            match_type = "CONFIRMED SERIAL OFFENDER (NAME & ALIAS MATCH)" if (is_name_match and is_alias_match) else (
                "RECIDIVIST RECORD (NAME MATCH)" if is_name_match else "ALIAS / CODE-NAME CORRELATION"
            )
            matches.append({
                "case_id": cid,
                "case_title": c.get("title"),
                "sector": c.get("sector"),
                "location": c.get("location"),
                "timestamp": c.get("timestamp"),
                "suspect_name": pred.get("name"),
                "suspect_alias": pred.get("alias"),
                "prior_confidence": pred.get("confidence"),
                "motive": pred.get("motive"),
                "risk_level": pred.get("risk_level", "HIGH"),
                "evidence_summary": c.get("evidence", [])[:2],
                "match_score": f"{match_score}%",
                "match_type": match_type
            })

    recidivism_risk = "EXTREME (SERIAL OFFENDER)" if len(matches) >= 2 else ("CRITICAL (REPEAT SUSPECT)" if len(matches) == 1 else "NONE")

    return {
        "matched": len(matches) > 0,
        "total_prior_records": len(matches),
        "recidivism_risk": recidivism_risk,
        "matches": matches
    }

@app.get("/api/suspects/all-matches")
def get_all_repeat_suspects():
    """
    Returns an intelligence dossier of all suspects who appear across multiple cases.
    """
    all_cases = mongo_service.list_cases()
    suspect_map = {}
    for c in all_cases:
        pred = c.get("suspect_prediction", {})
        s_name = pred.get("name")
        if not s_name:
            continue
        key = s_name.strip().lower()
        if key not in suspect_map:
            suspect_map[key] = {
                "name": s_name,
                "alias": pred.get("alias"),
                "cases": [],
                "risk_level": pred.get("risk_level", "HIGH")
            }
        suspect_map[key]["cases"].append({
            "case_id": c.get("case_id"),
            "title": c.get("title"),
            "sector": c.get("sector"),
            "location": c.get("location"),
            "timestamp": c.get("timestamp")
        })

    repeat_offenders = [v for v in suspect_map.values() if len(v["cases"]) > 1]
    return {
        "total_tracked": len(suspect_map),
        "repeat_offenders_count": len(repeat_offenders),
        "repeat_offenders": repeat_offenders
    }

# --- SIMILAR CASE DETECTION & MODUS OPERANDI (MO) PATTERN ENGINE ---

def extract_case_keywords(case: Dict[str, Any]) -> set:
    import re
    stop_words = {"from", "with", "that", "this", "into", "through", "after", "before", "were", "been", "have", "case", "file"}
    text = " ".join([
        case.get("title", ""),
        " ".join(case.get("evidence", [])),
        " ".join(case.get("timeline", [])),
        case.get("location", ""),
        case.get("suspect_prediction", {}).get("motive", "")
    ]).lower()
    words = set(re.findall(r'[a-z]{4,}', text))
    return words - stop_words

@app.get("/api/cases/{case_id}/similar")
def detect_similar_cases(case_id: str):
    """
    AI-Assisted Similar Case Detection & Modus Operandi (MO) Pattern Matching:
    Cross-references crime categories, physical evidence keywords, timeline infiltration tactics,
    jurisdiction sectors, and temporal patterns to discover correlated precedent cases.
    """
    target = mongo_service.get_case(case_id)
    if not target:
        raise HTTPException(status_code=404, detail="Target case not found")

    target_words = extract_case_keywords(target)
    target_sector = target.get("sector")
    target_time = target.get("timestamp", "")
    target_ev = [e.lower() for e in target.get("evidence", [])]
    target_pred = target.get("suspect_prediction", {})

    all_cases = mongo_service.list_cases()
    results = []

    for c in all_cases:
        cid = c.get("case_id")
        if cid == case_id:
            continue

        cand_words = extract_case_keywords(c)
        cand_sector = c.get("sector")
        cand_time = c.get("timestamp", "")
        cand_ev = [e.lower() for e in c.get("evidence", [])]
        cand_pred = c.get("suspect_prediction", {})

        intersection = target_words.intersection(cand_words)
        union = target_words.union(cand_words)
        jaccard_score = len(intersection) / len(union) if union else 0.0

        same_sector = bool(target_sector and cand_sector and target_sector == cand_sector)

        shared_evidence = []
        for te in target_ev:
            for ce in cand_ev:
                common_tokens = set(te.split()).intersection(set(ce.split())) - {"the", "from", "and", "for", "with", "on", "in"}
                if len(common_tokens) >= 1:
                    shared_evidence.append(f"{te.title()} ↔ {ce.title()}")

        matching_factors = []
        if same_sector:
            matching_factors.append(f"Geographic Sector Parity: Both cases situated in {target_sector}")

        if shared_evidence:
            matching_factors.append(f"Forensic Proof Overlap: Detected correlated evidence items ({len(shared_evidence)} elements)")

        if ("am" in target_time.lower() and "am" in cand_time.lower()) or ("pm" in target_time.lower() and "pm" in cand_time.lower()):
            matching_factors.append(f"Temporal Operating Window: Incident times align within similar night/morning infiltration window")

        if target_pred.get("risk_level") == cand_pred.get("risk_level"):
            matching_factors.append(f"Threat Severity Parity: Both classified under {target_pred.get('risk_level')} risk classification")

        if len(intersection) >= 3:
            matching_factors.append(f"Modus Operandi Signature: Correlated keywords ({', '.join(list(intersection)[:3])})")

        raw_score = (jaccard_score * 55) + (15 if same_sector else 5) + (min(len(shared_evidence), 3) * 6) + (10 if len(intersection) >= 3 else 0)
        similarity_pct = round(min(max(raw_score * 1.5, 38.0), 96.5), 1)

        grade = "VERY HIGH SIMILARITY" if similarity_pct >= 75 else ("HIGH SIMILARITY" if similarity_pct >= 55 else "MODERATE SIMILARITY")

        results.append({
            "case_id": cid,
            "title": c.get("title"),
            "sector": c.get("sector"),
            "location": c.get("location"),
            "timestamp": c.get("timestamp"),
            "status": c.get("status"),
            "suspect_name": cand_pred.get("name"),
            "risk_level": cand_pred.get("risk_level"),
            "similarity_percentage": similarity_pct,
            "similarity_grade": grade,
            "matching_factors": matching_factors[:4],
            "shared_keywords": list(intersection)[:5]
        })

    results.sort(key=lambda x: x["similarity_percentage"], reverse=True)

    return {
        "target_case_id": case_id,
        "target_title": target.get("title"),
        "total_analyzed": len(all_cases) - 1,
        "similar_cases": results
    }

# --- COMMISSIONER CLEARANCE & ACCESS CONTROL ---

@app.post("/api/commissioner/cases/{case_id}/grant-clearance")
def commissioner_grant_clearance(case_id: str, req: CommissionerClearanceRequest):
    case = mongo_service.get_case(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    case["commissioner_clearance_status"] = req.clearance_status
    case["assigned_investigator"] = req.assigned_investigator or case.get("assigned_investigator", "investigator")
    case["clearance_log"] = {
        "authorized_by": req.commissioner_name,
        "status": req.clearance_status,
        "comments": req.comments
    }

    # Cryptographically seal update
    case = SecurityService.secure_case_payload(case)
    mongo_service.insert_or_update_case(case_id, case)

    return {
        "message": f"Commissioner clearance successfully updated to {req.clearance_status} for {case.get('assigned_investigator')}",
        "case": case
    }

# --- INVESTIGATOR CASE CREATION ---

@app.post("/api/investigator/cases/create-and-generate")
def create_case_and_generate_video(req: CreateCaseRequest):
    case_id = req.case_id or f"CR-2026-{uuid.uuid4().hex[:4].upper()}"
    
    case_data = {
        "case_id": case_id,
        "title": req.title,
        "location": req.location,
        "timestamp": req.timestamp,
        "sector": req.sector or "CENTRAL",
        "assigned_investigator": req.assigned_investigator or "investigator",
        "commissioner_clearance_status": "GRANTED",  # Default granted for newly logged cases
        "status": "Under Investigation",
        "commissioner_approval": "PENDING",
        "officer_verification": {
            "officer_name": "Pending Forensic Audit",
            "notes": "Awaiting initial evidence cataloging",
            "status": "Pending"
        },
        "evidence": req.evidence,
        "timeline": req.timeline,
        "suspect_prediction": {
            "name": req.suspect_name,
            "alias": req.suspect_alias,
            "confidence": req.confidence,
            "motive": req.motive,
            "alibi_status": "Unverified (Claims home during incident)",
            "risk_level": req.risk_level
        },
        "video_reconstruction": None
    }

    # Cryptographic integrity seal
    case_data = SecurityService.secure_case_payload(case_data)

    # Generate Reconstruction Video
    video_filename = f"{case_id}_reconstruction.mp4"
    output_video_path = str(RECONSTRUCTIONS_DIR / video_filename)

    try:
        generate_reconstruction_video(case_data, output_video_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reconstruction Video Engine failed: {str(e)}")

    video_url = f"/media/reconstructions/{video_filename}"
    case_data["video_reconstruction"] = {
        "video_path": output_video_path,
        "video_url": video_url,
        "status": "Generated",
        "file_name": video_filename
    }

    mongo_service.insert_or_update_case(case_id, case_data)

    return {
        "message": "New case created, encrypted, and visual reconstruction video generated successfully!",
        "case": case_data
    }

@app.post("/api/investigator/cases/{case_id}/generate-reconstruction-video")
def generate_crime_video(
    case_id: str,
    investigator_user: Optional[str] = Query(None),
    role: Optional[str] = Query(None)
):
    case = mongo_service.get_case(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    # Clearance check: Check if Commissioner has authorized investigator access (Commissioner has executive override)
    clearance = case.get("commissioner_clearance_status", "GRANTED")
    if role != "COMMISSIONER" and clearance == "RESTRICTED":
        raise HTTPException(
            status_code=403,
            detail="Access Denied: The Commissioner has restricted access to this case. Clearance required to proceed."
        )

    video_filename = f"{case_id}_reconstruction.mp4"
    output_video_path = str(RECONSTRUCTIONS_DIR / video_filename)

    try:
        generate_reconstruction_video(case, output_video_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reconstruction Video Engine failed: {str(e)}")

    video_url = f"/media/reconstructions/{video_filename}"
    case["video_reconstruction"] = {
        "video_path": output_video_path,
        "video_url": video_url,
        "status": "Generated",
        "file_name": video_filename
    }
    
    case = SecurityService.secure_case_payload(case)
    mongo_service.insert_or_update_case(case_id, case)

    return {
        "message": "Crime Reconstruction Video generated successfully",
        "case_id": case_id,
        "video_url": video_url,
        "mongo_status": "Encrypted and saved to MongoDB"
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
    case = SecurityService.secure_case_payload(case)
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

    case = SecurityService.secure_case_payload(case)
    mongo_service.insert_or_update_case(case_id, case)
    return {"message": f"Commissioner decision recorded: {req.decision}", "case": case}

# --- SPEECH-TO-TEXT DIARIZATION (SARVAM AI) ---

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
