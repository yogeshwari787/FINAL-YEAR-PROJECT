import os
from pathlib import Path
from services.mongo_service import MongoService
from services.video_engine import generate_reconstruction_video
from services.crypto_service import SecurityService

SAMPLE_CASES_SEED = [
    {
        "case_id": "CR-2026-101",
        "title": "Central Bank Armed Robbery",
        "location": "Downtown Financial District, Vault B",
        "timestamp": "2026-10-04 02:45 AM",
        "sector": "SECTOR_1",
        "assigned_investigator": "investigator",
        "commissioner_clearance_status": "GRANTED",
        "status": "Under Investigation",
        "commissioner_approval": "PENDING",
        "images": [
            "/media/images/crime_scene_vault_1.png"
        ],
        "officer_verification": {
            "officer_name": "Forensic Officer Miller",
            "notes": "Fingerprint match confirmed on Vault lock handle.",
            "status": "Evidence Verified"
        },
        "evidence": [
            "CCTV Footage from Entrance North",
            "Discovered Fingerprints on Vault Lock",
            "Recovered Getaway Vehicle (Black Sedan)"
        ],
        "timeline": [
            "02:40 AM - Suspect disabled rooftop security cameras.",
            "02:45 AM - Two masked individuals breached secondary vault security door.",
            "02:49 AM - Vault contents accessed and security guard was disarmed.",
            "02:53 AM - Suspects fled through rear service corridor into getaway vehicle."
        ],
        "suspect_prediction": {
            "name": "Marcus Vance",
            "alias": "The Architect",
            "confidence": "91.4%",
            "motive": "Financial Debt & High-Yield Asset Theft",
            "alibi_status": "Unverified (Claims home during incident)",
            "risk_level": "CRITICAL"
        }
    },
    {
        "case_id": "CR-2026-102",
        "title": "Jewelry Store Diamond Heist",
        "location": "Central Plaza Mall, Shop 104",
        "timestamp": "2026-10-05 03:15 AM",
        "sector": "SECTOR_1",
        "assigned_investigator": "investigator",
        "commissioner_clearance_status": "GRANTED",
        "status": "Under Investigation",
        "commissioner_approval": "PENDING",
        "images": [
            "/media/images/crime_scene_diamond_1.png"
        ],
        "officer_verification": {
            "officer_name": "Forensic Officer Miller",
            "notes": "Diamond saw glass residue recovered.",
            "status": "Evidence Verified"
        },
        "evidence": [
            "Cut Display Glass Fragments",
            "Rooftop Diamond-Tipped Glass Saw",
            "Motorcycle Tire Marks on Parking Lot"
        ],
        "timeline": [
            "03:10 AM - Suspect entered through rooftop ventilation shaft.",
            "03:15 AM - Used diamond-tipped glass saw to precision-cut display case.",
            "03:18 AM - Stole 12 uncut diamonds worth $2.4 million.",
            "03:22 AM - Escaped on motorcycle through service alley."
        ],
        "suspect_prediction": {
            "name": "Victor Krum",
            "alias": "The Shadow",
            "confidence": "87.2%",
            "motive": "Black Market Diamond Trade",
            "alibi_status": "Unverified",
            "risk_level": "HIGH"
        }
    },
    {
        "case_id": "CR-2026-103",
        "title": "City Museum Cyber Heist",
        "location": "National History Museum, Server Room B2",
        "timestamp": "2026-10-06 11:30 PM",
        "sector": "SECTOR_2",
        "assigned_investigator": "investigator",
        "commissioner_clearance_status": "GRANTED",
        "status": "Under Investigation",
        "commissioner_approval": "PENDING",
        "images": [
            "/media/images/crime_scene_server_1.png"
        ],
        "officer_verification": {
            "officer_name": "Forensic Officer Miller",
            "notes": "USB hardware drive recovered with zero-day exploit.",
            "status": "Evidence Verified"
        },
        "evidence": [
            "Tampered Server Access Logs",
            "USB Hardware Exploit Device",
            "Disabled Fire Alarm Circuit Wiring"
        ],
        "timeline": [
            "11:20 PM - Suspect posed as night security contractor to enter server room.",
            "11:30 PM - Plugged USB exploit hardware tool into central mainframe.",
            "11:38 PM - Extracted auction records and donor financial databases.",
            "11:45 PM - Exited through emergency fire escape after disabling alarm."
        ],
        "suspect_prediction": {
            "name": "Elena Zhao",
            "alias": "Ghost Wire",
            "confidence": "93.7%",
            "motive": "Corporate Espionage & Data Ransom",
            "alibi_status": "Unverified",
            "risk_level": "CRITICAL"
        }
    },
    {
        "case_id": "CR-2026-240E",
        "title": "Highway Armored Truck Ambush",
        "location": "Interstate 45, Mile Marker 112",
        "timestamp": "2026-10-03 04:20 AM",
        "sector": "SECTOR_3",
        "assigned_investigator": "investigator",
        "commissioner_clearance_status": "RESTRICTED",  # Demo restricted case requiring Commissioner clearance!
        "status": "Under Investigation",
        "commissioner_approval": "PENDING",
        "images": [
            "/media/images/crime_scene_vault_1.png"
        ],
        "officer_verification": {
            "officer_name": "Forensic Officer Miller",
            "notes": "9mm shell casings recovered at roadside.",
            "status": "Evidence Verified"
        },
        "evidence": [
            "Spike Strip Steel Fragments",
            "Recovered 9mm Shell Casings",
            "Abandoned Getaway Pickup Truck"
        ],
        "timeline": [
            "04:15 AM - Suspects deployed tactical spike strips across highway lanes.",
            "04:20 AM - Armored truck tires burst and transport vehicle halted.",
            "04:24 AM - Three armed suspects forced open rear security doors.",
            "04:29 AM - Stole cash shipment of $800,000 and fled in pickup truck."
        ],
        "suspect_prediction": {
            "name": "Ray Donovan",
            "alias": "The Roadrunner",
            "confidence": "78.5%",
            "motive": "Organized Crime Syndicate Transit Theft",
            "alibi_status": "Unverified",
            "risk_level": "HIGH"
        }
    }
]

def seed_complete_demo():
    print("Pre-seeding demo crime cases with sector metadata and AES-256 security...")
    mongo_service = MongoService()
    reconstructions_dir = Path(__file__).resolve().parent / "uploads" / "reconstructions"
    reconstructions_dir.mkdir(parents=True, exist_ok=True)
    
    for case in SAMPLE_CASES_SEED:
        case_id = case["case_id"]
        video_filename = f"{case_id}_reconstruction.mp4"
        output_video_path = str(reconstructions_dir / video_filename)
        video_url = f"/media/reconstructions/{video_filename}"
        
        print(f"Generating reconstruction video for {case_id} ({case['sector']})...")
        try:
            generate_reconstruction_video(case, output_video_path)
            case["video_reconstruction"] = {
                "video_path": output_video_path,
                "video_url": video_url,
                "status": "Generated",
                "file_name": video_filename
            }
            case = SecurityService.secure_case_payload(case)
            mongo_service.insert_or_update_case(case_id, case)
            print(f"✓ Case {case_id} seeded successfully.")
        except Exception as e:
            print(f"❌ Error seeding case {case_id}: {e}")

if __name__ == "__main__":
    seed_complete_demo()
