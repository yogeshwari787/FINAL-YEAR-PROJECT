import os
import subprocess
from pathlib import Path
from typing import Dict, Any
from PIL import Image, ImageDraw
from gtts import gTTS

def render_vault_robbery_scene(draw, width: int, height: int, f: int, case_data: Dict[str, Any]):
    """VISUAL ENGINE 1: BANK VAULT ROBBERY"""
    # Background: Vault Steel Walls
    draw.rectangle([0, 0, width, height], fill='#0f172a')
    
    # Vault Door (Animated wheel rotation)
    center_x, center_y = 640, 380
    radius = 180
    draw.ellipse([center_x-radius, center_y-radius, center_x+radius, center_y+radius], fill='#1e293b', outline='#6366f1', width=6)
    draw.ellipse([center_x-60, center_y-60, center_x+60, center_y+60], fill='#334155', outline='#818cf8', width=4)
    
    # Vault Wheel Spokes rotating
    angle = (f * 10) % 360
    import math
    for i in range(4):
        rad = math.radians(angle + i * 90)
        x2 = center_x + int(50 * math.cos(rad))
        y2 = center_y + int(50 * math.sin(rad))
        draw.line([center_x, center_y, x2, y2], fill='#fbbf24', width=5)

    # Cash / Gold Stacks
    draw.rectangle([200, 480, 380, 580], fill='#15803d', outline='#4ade80', width=3)
    draw.text((230, 520), "💰 CASH STACK", fill='#ffffff', font_size=18)

    draw.rectangle([900, 480, 1080, 580], fill='#eab308', outline='#fef08a', width=3)
    draw.text((930, 520), "🥇 GOLD BARS", fill='#ffffff', font_size=18)

    # Suspect burglar figure
    suspect_x = 350 + (f * 5) % 500
    draw.ellipse([suspect_x-20, 450, suspect_x+20, 490], fill='#000000', outline='#f43f5e', width=2)
    draw.rectangle([suspect_x-15, 490, suspect_x+15, 550], fill='#1e1b4b', outline='#6366f1', width=2)
    draw.text((suspect_x-30, 425), "MASKED SUSPECT", fill='#f43f5e', font_size=14)

def render_cyber_heist_scene(draw, width: int, height: int, f: int, case_data: Dict[str, Any]):
    """VISUAL ENGINE 2: CYBER HEIST & DIGITAL SERVER ROOM"""
    # Background: Matrix Terminal Green/Blue Dark Room
    draw.rectangle([0, 0, width, height], fill='#020617')
    
    # Server Racks
    for col in range(5):
        x1 = 120 + col * 220
        draw.rectangle([x1, 150, x1+160, 580], fill='#0f172a', outline='#38bdf8', width=3)
        # Server lights blinking
        for row in range(6):
            y1 = 180 + row * 60
            color = '#22c55e' if (row + col + f) % 3 == 0 else '#ef4444'
            draw.ellipse([x1+20, y1, x1+35, y1+15], fill=color)
            draw.rectangle([x1+50, y1+4, x1+140, y1+12], fill='#1e293b')

    # Cyber Hacker Terminal Screen
    draw.rectangle([380, 220, 900, 500], fill='#000000', outline='#22c55e', width=4)
    draw.text((410, 240), "> INITIALIZING EXPLOIT PROTOCOL...", fill='#22c55e', font_size=18)
    draw.text((410, 280), f"> TARGET SERVER: {case_data.get('location', 'SERVER-01')}", fill='#38bdf8', font_size=16)
    draw.text((410, 320), f"> ACCESS CODE: BYPASSED", fill='#fef08a', font_size=16)
    
    # Progress Bar
    prog = min(100, f * 2)
    draw.rectangle([410, 400, 410 + int(prog * 4.5), 440], fill='#22c55e')
    draw.text((420, 410), f"DATA DOWNLOAD: {prog}%", fill='#000000', font_size=16)

def render_jewelry_diamond_scene(draw, width: int, height: int, f: int, case_data: Dict[str, Any]):
    """VISUAL ENGINE 3: JEWELRY GLASS CUTTING & DIAMOND THEFT"""
    # Background: Luxury Boutique Showroom
    draw.rectangle([0, 0, width, height], fill='#18181b')
    
    # Velvet Display Pedestal
    draw.rectangle([400, 300, 880, 620], fill='#4c1d95', outline='#a855f7', width=4)
    
    # Glass Case Dome
    draw.polygon([(420, 300), (480, 180), (800, 180), (860, 300)], fill='#090d16', outline='#c084fc', width=3)
    
    # Diamond Item glowing
    draw.polygon([(640, 220), (670, 250), (640, 280), (610, 250)], fill='#38bdf8', outline='#ffffff', width=2)
    draw.text((585, 200), "💎 RARE DIAMOND", fill='#fef08a', font_size=16)

    # Glass Circular Cutter Graphic (animating red cut line)
    cut_radius = min(70, f * 2)
    draw.ellipse([640-cut_radius, 250-cut_radius, 640+cut_radius, 250+cut_radius], outline='#ef4444', width=3)
    draw.text((550, 140), "✂️ DIAMOND GLASS SAW CUTTING", fill='#ef4444', font_size=18)

def render_general_street_scene(draw, width: int, height: int, f: int, case_data: Dict[str, Any]):
    """VISUAL ENGINE 4: STREET SCENE / GENERAL INCIDENT"""
    draw.rectangle([0, 0, width, height], fill='#090d16')
    
    # Street asphalt road
    draw.rectangle([0, 400, width, height], fill='#1e293b')
    draw.line([0, 550, width, 550], fill='#fef08a', width=6)

    # Traffic light / streetlight
    draw.rectangle([150, 150, 200, 400], fill='#0f172a', outline='#475569', width=3)
    light_color = '#ef4444' if (f // 10) % 2 == 0 else '#22c55e'
    draw.ellipse([160, 170, 190, 200], fill=light_color)

    # Evidence Chalk Outline on Road
    draw.ellipse([600, 460, 750, 520], outline='#ffffff', width=3)
    draw.text((615, 480), "EVIDENCE #1", fill='#fbbf24', font_size=16)

def generate_cartoon_reconstruction_frames(case_data: Dict[str, Any], temp_dir: Path) -> list[str]:
    """
    Selects the matching visual engine and renders case-specific animation frames.
    """
    width, height = 1280, 720
    frame_paths = []
    total_frames = 120  # 8 seconds at 15 FPS

    case_id = case_data.get("case_id", "CR-101")
    title = case_data.get("title", "Crime Scene Incident")
    location = case_data.get("location", "Scene Location")
    timeline = case_data.get("timeline", [])
    suspect = case_data.get("suspect_prediction", {})
    suspect_name = suspect.get("name", "Suspect")
    confidence = suspect.get("confidence", "90%")

    title_lower = (title + " " + location).lower()

    for f in range(total_frames):
        img = Image.new('RGB', (width, height), color='#090d16')
        draw = ImageDraw.Draw(img)

        # 1. RENDER CATEGORY-SPECIFIC SCENE GRAPHICS
        if "bank" in title_lower or "vault" in title_lower or "robbery" in title_lower:
            render_vault_robbery_scene(draw, width, height, f, case_data)
            category_label = "CRIME TYPE: VAULT BREACH & ARMED ROBBERY"
        elif "cyber" in title_lower or "heist" in title_lower or "server" in title_lower or "museum" in title_lower:
            render_cyber_heist_scene(draw, width, height, f, case_data)
            category_label = "CRIME TYPE: DIGITAL CYBER HEIST & SECURITY BYPASS"
        elif "diamond" in title_lower or "jewelry" in title_lower or "mall" in title_lower or "theft" in title_lower:
            render_jewelry_diamond_scene(draw, width, height, f, case_data)
            category_label = "CRIME TYPE: DIAMOND STORE GLASS CUTTING"
        else:
            render_general_street_scene(draw, width, height, f, case_data)
            category_label = "CRIME TYPE: STREET INCIDENT & FORENSIC INVESTIGATION"

        # 2. OVERLAY CASE HEADER BANNER
        draw.rectangle([40, 30, width-40, 130], fill='#090d16', outline='#6366f1', width=3)
        draw.text((60, 45), f"CASE #{case_id}: {title.upper()}", fill='#818cf8', font_size=24)
        draw.text((60, 85), f"📍 {location} | {category_label}", fill='#38bdf8', font_size=16)

        # 3. OVERLAY DYNAMIC STEP-BY-STEP TIMELINE CARDS
        # Stage 1: Frames 0 - 40
        if f < 40:
            step_text = timeline[0] if len(timeline) > 0 else "Suspect approaches the scene."
            draw.rectangle([40, 600, width-40, 690], fill='#020617', outline='#6366f1', width=2)
            draw.text((60, 615), "STEP 1 (INITIAL APPROACH & BREACH):", fill='#818cf8', font_size=16)
            draw.text((60, 645), f"• {step_text[:85]}", fill='#ffffff', font_size=18)

        # Stage 2: Frames 40 - 80
        elif f < 80:
            step_text = timeline[1] if len(timeline) > 1 else "Suspect executes the crime."
            draw.rectangle([40, 600, width-40, 690], fill='#020617', outline='#f43f5e', width=2)
            draw.text((60, 615), "STEP 2 (CRIME EXECUTION AT SCENE):", fill='#f43f5e', font_size=16)
            draw.text((60, 645), f"• {step_text[:85]}", fill='#ffffff', font_size=18)

        # Stage 3: Frames 80 - 120
        else:
            step_text = timeline[2] if len(timeline) > 2 else "Suspect flees the scene."
            draw.rectangle([40, 580, width-40, 690], fill='#020617', outline='#4ade80', width=2)
            draw.text((60, 595), "STEP 3 (ESCAPE & AI SUSPECT PREDICTION):", fill='#4ade80', font_size=16)
            draw.text((60, 620), f"• {step_text[:85]}", fill='#ffffff', font_size=17)
            draw.text((60, 650), f"PREDICTED SUSPECT: {suspect_name.upper()} (CONFIDENCE: {confidence})", fill='#fef08a', font_size=18)

        # Save frame
        frame_path = str(temp_dir / f"frame_{f:03d}.png")
        img.save(frame_path)
        frame_paths.append(frame_path)

    return frame_paths

def generate_reconstruction_video(case_data: Dict[str, Any], output_video_path: str) -> str:
    """
    Synthesizes a 15-FPS video tailored specifically to the crime execution timeline.
    """
    temp_dir = Path(output_video_path).parent / f"temp_dynamic_{case_data.get('case_id', '101')}"
    temp_dir.mkdir(parents=True, exist_ok=True)
    
    try:
        frames = generate_cartoon_reconstruction_frames(case_data, temp_dir)

        # Dynamic Audio Narration tailored to exact crime timeline
        case_id = case_data.get("case_id", "101")
        title = case_data.get("title", "Crime Incident")
        location = case_data.get("location", "the scene")
        timestamp = case_data.get("timestamp", "at the time of incident")
        timeline = case_data.get("timeline", [])
        suspect = case_data.get("suspect_prediction", {})
        suspect_name = suspect.get("name", "the suspect")
        confidence = suspect.get("confidence", "90 percent")

        step1 = timeline[0] if len(timeline) > 0 else "the suspect initiated the breach."
        step2 = timeline[1] if len(timeline) > 1 else "he executed the primary crime at the location."
        step3 = timeline[2] if len(timeline) > 2 else "he escaped from the crime scene."

        narration = (
            f"Crime Reconstruction Report for Case {case_id}, {title}. "
            f"Location: {location}, recorded at {timestamp}. "
            f"Here is how the crime took place. "
            f"First, {step1} "
            f"Second, {step2} "
            f"Third, {step3} "
            f"AI predictive modeling identifies {suspect_name} as the primary suspect with a {confidence} confidence score."
        )

        audio_path = str(temp_dir / "narration.mp3")
        tts = gTTS(text=narration, lang='en')
        tts.save(audio_path)

        ffmpeg_cmd = [
            'ffmpeg',
            '-y',
            '-framerate', '15',
            '-i', str(temp_dir / 'frame_%03d.png'),
            '-i', audio_path,
            '-c:v', 'libx264',
            '-pix_fmt', 'yuv420p',
            '-c:a', 'aac',
            '-shortest',
            output_video_path
        ]

        res = subprocess.run(ffmpeg_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if res.returncode != 0:
            raise RuntimeError(f"FFmpeg video compilation failed: {res.stderr}")

        return output_video_path

    finally:
        import shutil
        shutil.rmtree(temp_dir, ignore_errors=True)
