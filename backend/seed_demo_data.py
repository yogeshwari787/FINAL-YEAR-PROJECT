import os
from pathlib import Path
from services.mongo_service import MongoService
from services.video_engine import generate_reconstruction_video

def seed_complete_demo():
    print("Pre-seeding demo crime reconstruction videos and database records...")
    mongo_service = MongoService()
    cases = mongo_service.list_cases()
    
    reconstructions_dir = Path(__file__).resolve().parent / "uploads" / "reconstructions"
    reconstructions_dir.mkdir(parents=True, exist_ok=True)
    
    for case in cases:
        case_id = case["case_id"]
        video_filename = f"{case_id}_reconstruction.mp4"
        output_video_path = str(reconstructions_dir / video_filename)
        video_url = f"/media/reconstructions/{video_filename}"
        
        print(f"Generating reconstruction video for {case_id}...")
        try:
            generate_reconstruction_video(case, output_video_path)
            case["video_reconstruction"] = {
                "video_path": output_video_path,
                "video_url": video_url,
                "status": "Generated",
                "file_name": video_filename
            }
            mongo_service.insert_or_update_case(case_id, case)
            print(f"✓ Case {case_id} seeded successfully with video demo.")
        except Exception as e:
            print(f"❌ Error seeding case {case_id}: {e}")

if __name__ == "__main__":
    seed_complete_demo()
