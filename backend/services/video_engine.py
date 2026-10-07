import os
import math
import subprocess
from pathlib import Path
from typing import Dict, Any, List, Tuple
from PIL import Image, ImageDraw, ImageFont
from gtts import gTTS

def get_font(size: int, bold: bool = False):
    font_candidates = [
        "/System/Library/Fonts/Supplemental/Arial.ttf" if not bold else "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/Geneva.dfont",
    ]
    for fp in font_candidates:
        if os.path.exists(fp):
            try:
                return ImageFont.truetype(fp, size)
            except Exception:
                pass
    return ImageFont.load_default()

def detect_case_theme(case_data: Dict[str, Any]) -> str:
    """Classifies the case into a distinct visual & narrative theme"""
    combined = (case_data.get("title", "") + " " + case_data.get("location", "") + " " + " ".join(case_data.get("evidence", []))).lower()
    
    if any(k in combined for k in ["bank", "vault", "robbery", "cash", "safe"]):
        return "BANK_ROBBERY"
    elif any(k in combined for k in ["diamond", "jewelry", "jewel", "mall", "gem", "glass"]):
        return "DIAMOND_HEIST"
    elif any(k in combined for k in ["cyber", "server", "data", "museum", "hack", "usb", "computer"]):
        return "CYBER_HEIST"
    elif any(k in combined for k in ["highway", "armored", "truck", "ambush", "interstate", "spike"]):
        return "HIGHWAY_AMBUSH"
    elif any(k in combined for k in ["pharmaceutical", "pharma", "lab", "drug", "biometric", "compound", "medtech"]):
        return "PHARMA_LAB"
    elif any(k in combined for k in ["arson", "fire", "warehouse", "gasoline", "insurance", "burn"]):
        return "WAREHOUSE_ARSON"
    else:
        return "GENERAL_FORENSIC"

def draw_header(draw, width: int, case_data: Dict[str, Any], current_scene_title: str, scene_idx: int, total_scenes: int = 5):
    """Forensic Tactical Top Header"""
    draw.rectangle([0, 0, width, 85], fill='#070b14', outline='#1e293b', width=1)
    draw.line([0, 85, width, 85], fill='#3b82f6', width=2)

    font_title = get_font(20, bold=True)
    font_sub = get_font(13, bold=False)
    font_badge = get_font(12, bold=True)

    case_id = case_data.get("case_id", "CR-101")
    title = case_data.get("title", "Investigation Case").upper()
    location = case_data.get("location", "Crime Scene")
    timestamp = case_data.get("timestamp", "Incident Time")

    draw.rectangle([25, 14, 185, 36], fill='#2d1216', outline='#ef4444', width=1)
    draw.text((32, 17), "● FORENSIC RECON", fill='#ef4444', font=font_badge)

    draw.text((200, 14), f"CASE #{case_id}: {title[:38]}", fill='#f8fafc', font=font_title)
    draw.text((200, 44), f"📍 {location[:35]}   |   🕒 {timestamp}", fill='#94a3b8', font=font_sub)

    pill_x1 = width - 380
    draw.rectangle([pill_x1, 14, width - 25, 70], fill='#0f172a', outline='#334155', width=1)
    draw.text((pill_x1 + 14, 20), f"STAGE {scene_idx}/{total_scenes}: {current_scene_title.upper()[:28]}", fill='#38bdf8', font=font_badge)
    
    bar_width = 330
    fill_width = int(bar_width * (scene_idx / total_scenes))
    draw.rectangle([pill_x1 + 14, 48, pill_x1 + 14 + bar_width, 56], fill='#1e293b')
    draw.rectangle([pill_x1 + 14, 48, pill_x1 + 14 + fill_width, 56], fill='#6366f1')

def draw_footer_disclaimer(draw, width: int, height: int):
    """Legal & Investigative disclaimer banner"""
    draw.rectangle([0, height - 42, width, height], fill='#050811', outline='#1e293b', width=1)
    draw.line([0, height - 42, width, height - 42], fill='#f59e0b', width=2)
    font_disc = get_font(12, bold=True)
    draw.text((25, height - 30), "⚠️  AI-ASSISTED RECONSTRUCTION FOR INVESTIGATION SUPPORT. THIS VISUALIZATION IS NOT ACTUAL CCTV FOOTAGE AND DOES NOT ESTABLISH GUILT.", fill='#fbbf24', font=font_disc)

def draw_grid_background(draw, width: int, height: int, bg_tint='#090d16', grid_col='#0e1726'):
    draw.rectangle([0, 0, width, height], fill=bg_tint)
    for x in range(0, width, 60):
        draw.line([x, 85, x, height - 42], fill=grid_col, width=1)
    for y in range(85, height - 42, 60):
        draw.line([0, y, width, y], fill=grid_col, width=1)

def draw_arrow(draw, start: Tuple[int, int], end: Tuple[int, int], color='#38bdf8', width=3, arrow_size=12):
    x1, y1 = start
    x2, y2 = end
    draw.line([x1, y1, x2, y2], fill=color, width=width)
    angle = math.atan2(y2 - y1, x2 - x1)
    p1 = (x2 - arrow_size * math.cos(angle - math.pi / 6), y2 - arrow_size * math.sin(angle - math.pi / 6))
    p2 = (x2 - arrow_size * math.cos(angle + math.pi / 6), y2 - arrow_size * math.sin(angle + math.pi / 6))
    draw.polygon([(x2, y2), p1, p2], fill=color)

def draw_badge(draw, x: int, y: int, text: str, is_factual: bool = True):
    font = get_font(11, bold=True)
    if is_factual:
        bg_col = '#064e3b'
        bd_col = '#10b981'
        txt_col = '#6ee7b7'
        prefix = "✔ FACT: "
    else:
        bg_col = '#312e81'
        bd_col = '#6366f1'
        txt_col = '#c7d2fe'
        prefix = "✦ AI-INFERRED: "
    full_text = f"{prefix}{text}"
    tw = len(full_text) * 7 + 16
    draw.rectangle([x, y, x + tw, y + 24], fill=bg_col, outline=bd_col, width=1)
    draw.text((x + 8, y + 5), full_text, fill=txt_col, font=font)

def draw_suspect_figure(draw, x: int, y: int, scale: float = 1.0, step_cycle: int = 0, label="SUSPECT", outfit_color='#0f172a'):
    head_r = int(14 * scale)
    torso_h = int(36 * scale)
    leg_offset = int(math.sin(step_cycle * 0.3) * 12 * scale)
    
    draw.ellipse([x - 22 * scale, y + torso_h + 30 * scale, x + 22 * scale, y + torso_h + 38 * scale], fill='#030712')
    draw.line([x, y + torso_h, x - 12 * scale + leg_offset, y + torso_h + 32 * scale], fill='#1e293b', width=int(5 * scale))
    draw.line([x, y + torso_h, x + 12 * scale - leg_offset, y + torso_h + 32 * scale], fill='#1e293b', width=int(5 * scale))
    draw.rectangle([x - 14 * scale, y, x + 14 * scale, y + torso_h], fill=outfit_color, outline='#475569', width=2)
    draw.ellipse([x - head_r, y - head_r * 2, x + head_r, y], fill='#1e1b4b', outline='#ef4444', width=2)
    draw.rectangle([x - 6 * scale, y - int(head_r * 1.2), x + 6 * scale, y - int(head_r * 0.9)], fill='#ef4444')
    
    if label:
        font = get_font(11, bold=True)
        draw.rectangle([x - 40, y - int(head_r * 2) - 22, x + 40, y - int(head_r * 2) - 4], fill='#000000', outline='#ef4444', width=1)
        draw.text((x - 34, y - int(head_r * 2) - 20), label, fill='#ef4444', font=font)


# ==========================================
# SCENE 1: UNIQUE LOCATION BLUEPRINT PER THEME
# ==========================================
def render_scene_1_blueprint(draw, width: int, height: int, f: int, case_data: Dict[str, Any], theme: str):
    draw_grid_background(draw, width, height)
    draw_header(draw, width, case_data, "Incident Location & Blueprint Layout", 1)
    draw_footer_disclaimer(draw, width, height)

    font_h2 = get_font(16, bold=True)
    font_body = get_font(13)
    font_mono = get_font(12, bold=True)

    bp_x, bp_y, bp_w, bp_h = 45, 110, 720, 520
    draw.rectangle([bp_x, bp_y, bp_x + bp_w, bp_y + bp_h], fill='#050c1e', outline='#1e3a8a', width=2)

    # 1. Custom Blueprint Content based on Theme
    if theme == "BANK_ROBBERY":
        draw.text((bp_x + 20, bp_y + 18), "📐 DOWNTOWN CENTRAL BANK & VAULT B BLUEPRINT", fill='#60a5fa', font=font_h2)
        draw.rectangle([bp_x + 40, bp_y + 60, bp_x + 280, bp_y + 240], fill='#0a152e', outline='#3b82f6')
        draw.text((bp_x + 55, bp_y + 75), "ZONE 1: FRONT ATRIUM & TELLER DESKS", fill='#93c5fd', font=font_mono)
        
        draw.rectangle([bp_x + 320, bp_y + 60, bp_x + bp_w - 40, bp_y + 360], fill='#111c38', outline='#f59e0b', width=2)
        draw.text((bp_x + 335, bp_y + 75), "ZONE 2: REINFORCED CASH VAULT B", fill='#fbbf24', font=font_mono)
        draw.text((bp_x + 335, bp_y + 105), "• Heavy Class-V Steel Vault Door\n• Ultrasonic Motion Sensors\n• Safe Deposit Lockers", fill='#cbd5e1', font=font_body)

        draw.rectangle([bp_x + 40, bp_y + 280, bp_x + 280, bp_y + bp_h - 40], fill='#0a152e', outline='#10b981')
        draw.text((bp_x + 55, bp_y + 295), "ZONE 3: REAR SERVICE CORRIDOR", fill='#34d399', font=font_mono)

    elif theme == "DIAMOND_HEIST":
        draw.text((bp_x + 20, bp_y + 18), "📐 CENTRAL PLAZA MALL - SHOP 104 FLOORPLAN", fill='#a855f7', font=font_h2)
        draw.rectangle([bp_x + 40, bp_y + 60, bp_x + 280, bp_y + 220], fill='#1e112a', outline='#a855f7')
        draw.text((bp_x + 55, bp_y + 75), "ZONE 1: MALL ATRIUM & ESCALATORS", fill='#d8b4fe', font=font_mono)

        draw.rectangle([bp_x + 320, bp_y + 60, bp_x + bp_w - 40, bp_y + 360], fill='#2e1040', outline='#f43f5e', width=2)
        draw.text((bp_x + 335, bp_y + 75), "ZONE 2: JEWELRY SHOWCASE BOUTIQUE", fill='#f43f5e', font=font_mono)
        draw.text((bp_x + 335, bp_y + 105), "• Reinforced Glass Display Pedestals\n• Rooftop Ventilation Access Shaft\n• Laser Grid Alarm Matrix", fill='#cbd5e1', font=font_body)

        draw.rectangle([bp_x + 40, bp_y + 260, bp_x + 280, bp_y + bp_h - 40], fill='#1e112a', outline='#10b981')
        draw.text((bp_x + 55, bp_y + 275), "ZONE 3: PARKING SERVICE ALLEY", fill='#34d399', font=font_mono)

    elif theme == "CYBER_HEIST":
        draw.text((bp_x + 20, bp_y + 18), "📐 MUSEUM SERVER ROOM B2 & NETWORK TOPOLOGY", fill='#22c55e', font=font_h2)
        draw.rectangle([bp_x + 40, bp_y + 60, bp_x + 280, bp_y + 240], fill='#062015', outline='#22c55e')
        draw.text((bp_x + 55, bp_y + 75), "ZONE 1: SECURITY DESK & BADGE AIRLOCK", fill='#86efac', font=font_mono)

        draw.rectangle([bp_x + 320, bp_y + 60, bp_x + bp_w - 40, bp_y + 360], fill='#032818', outline='#38bdf8', width=2)
        draw.text((bp_x + 335, bp_y + 75), "ZONE 2: CENTRAL MAINFRAME & RACKS", fill='#38bdf8', font=font_mono)
        draw.text((bp_x + 335, bp_y + 105), "• Mainframe Database Server B2\n• Direct Fiber Console Terminal\n• Encrypted Auction & Financial Records", fill='#cbd5e1', font=font_body)

        draw.rectangle([bp_x + 40, bp_y + 280, bp_x + 280, bp_y + bp_h - 40], fill='#062015', outline='#eab308')
        draw.text((bp_x + 55, bp_y + 295), "ZONE 3: EMERGENCY FIRE ESCAPE", fill='#fde047', font=font_mono)

    elif theme == "HIGHWAY_AMBUSH":
        draw.text((bp_x + 20, bp_y + 18), "📐 INTERSTATE 45 - MILE 112 TACTICAL INTERCEPTION MAP", fill='#f59e0b', font=font_h2)
        draw.rectangle([bp_x + 40, bp_y + 120, bp_x + bp_w - 40, bp_y + 260], fill='#1e293b', outline='#64748b')
        draw.line([bp_x + 40, bp_y + 190, bp_x + bp_w - 40, bp_y + 190], fill='#fbbf24', width=4)
        draw.text((bp_x + 60, bp_y + 135), "INTERSTATE HIGHWAY LANES (NORTHBOUND)", fill='#f8fafc', font=font_mono)

        draw.rectangle([bp_x + 350, bp_y + 160, bp_x + 550, bp_y + 220], fill='#7f1d1d', outline='#ef4444', width=2)
        draw.text((bp_x + 365, bp_y + 185), "⚠️ SPIKE STRIP AMBUSH ZONE", fill='#fca5a5', font=font_mono)

        draw.rectangle([bp_x + 40, bp_y + 300, bp_x + 350, bp_y + bp_h - 40], fill='#0f172a', outline='#10b981')
        draw.text((bp_x + 55, bp_y + 315), "ZONE 3: DIRT OFF-RAMP & ESCAPE TRAIL", fill='#34d399', font=font_mono)

    elif theme == "PHARMA_LAB":
        draw.text((bp_x + 20, bp_y + 18), "📐 MEDTECH RESEARCH PARK - BUILDING C LAB 7", fill='#06b6d4', font=font_h2)
        draw.rectangle([bp_x + 40, bp_y + 60, bp_x + 280, bp_y + 240], fill='#082f49', outline='#0ea5e9')
        draw.text((bp_x + 55, bp_y + 75), "ZONE 1: RFID ACCESS CORRIDOR", fill='#7dd3fc', font=font_mono)

        draw.rectangle([bp_x + 320, bp_y + 60, bp_x + bp_w - 40, bp_y + 360], fill='#0c4a6e', outline='#38bdf8', width=2)
        draw.text((bp_x + 335, bp_y + 75), "ZONE 2: BIO-SYNTHESIS COLD VAULT", fill='#38bdf8', font=font_mono)
        draw.text((bp_x + 335, bp_y + 105), "• Cryogenic Storage Unit -80°C\n• Tampered Biometric Fingerprint Lock\n• 15 Experimental Compound Vials", fill='#cbd5e1', font=font_body)

        draw.rectangle([bp_x + 40, bp_y + 280, bp_x + 280, bp_y + bp_h - 40], fill='#082f49', outline='#10b981')
        draw.text((bp_x + 55, bp_y + 295), "ZONE 3: REAR CHEMICAL LOADING DOCK", fill='#34d399', font=font_mono)

    elif theme == "WAREHOUSE_ARSON":
        draw.text((bp_x + 20, bp_y + 18), "📐 INDUSTRIAL ZONE - WAREHOUSE 14 SITE MAP", fill='#f97316', font=font_h2)
        draw.rectangle([bp_x + 40, bp_y + 60, bp_x + 280, bp_y + 240], fill='#27130a', outline='#ea580c')
        draw.text((bp_x + 55, bp_y + 75), "ZONE 1: PERIMETER SECURITY GATE", fill='#fdba74', font=font_mono)

        draw.rectangle([bp_x + 320, bp_y + 60, bp_x + bp_w - 40, bp_y + 360], fill='#431407', outline='#ef4444', width=2)
        draw.text((bp_x + 335, bp_y + 75), "ZONE 2: MAIN STORAGE BAY (IGNITION ORIGIN)", fill='#f87171', font=font_mono)
        draw.text((bp_x + 335, bp_y + 105), "• Accelerant Pour Lines Across Timber Flooring\n• Rapid Burn Pattern Origin Point\n• Fire Suppression System Tampered", fill='#cbd5e1', font=font_body)

        draw.rectangle([bp_x + 40, bp_y + 280, bp_x + 280, bp_y + bp_h - 40], fill='#27130a', outline='#10b981')
        draw.text((bp_x + 55, bp_y + 295), "ZONE 3: DOCK STREET ACCESS ROAD", fill='#34d399', font=font_mono)

    else:
        draw.text((bp_x + 20, bp_y + 18), "📐 CRIME SCENE TACTICAL LAYOUT & BLUEPRINT", fill='#60a5fa', font=font_h2)
        draw.rectangle([bp_x + 40, bp_y + 60, bp_x + bp_w - 40, bp_y + 360], fill='#0f172a', outline='#3b82f6', width=2)
        draw.text((bp_x + 60, bp_y + 80), f"PRIMARY SCENE: {case_data.get('location', 'Scene')}", fill='#f8fafc', font=font_mono)

    # Radar Ping
    radar_cx, radar_cy = bp_x + 520, bp_y + 230
    ping_r = (f * 3) % 70
    draw.ellipse([radar_cx - ping_r, radar_cy - ping_r, radar_cx + ping_r, radar_cy + ping_r], outline='#f59e0b', width=2)
    draw.ellipse([radar_cx - 8, radar_cy - 8, radar_cx + 8, radar_cy + 8], fill='#ef4444')
    draw.text((radar_cx - 45, radar_cy + 15), "INCIDENT FOCUS", fill='#ef4444', font=font_mono)

    # Right: Case Dossier & Intelligence Facts Card
    rc_x = 790
    draw.rectangle([rc_x, bp_y, width - 45, bp_y + bp_h], fill='#0b1120', outline='#1e293b', width=2)
    draw.text((rc_x + 20, bp_y + 20), "📋 CASE METRICS & DISPATCH FACTS", fill='#38bdf8', font=font_h2)

    evidence_list = case_data.get("evidence", [])
    draw_badge(draw, rc_x + 20, bp_y + 60, f"TIMESTAMP: {case_data.get('timestamp', 'Recorded')}", is_factual=True)
    draw_badge(draw, rc_x + 20, bp_y + 95, f"EVIDENCE ITEMS LOGGED: {len(evidence_list)}", is_factual=True)
    draw_badge(draw, rc_x + 20, bp_y + 130, "AI SPATIAL RECONSTRUCTION", is_factual=False)

    draw.text((rc_x + 20, bp_y + 175), "PRIMARY EVIDENCE REGISTER:", fill='#e2e8f0', font=font_mono)
    for idx, ev in enumerate(evidence_list[:4]):
        ey = bp_y + 205 + idx * 32
        draw.rectangle([rc_x + 20, ey, width - 65, ey + 26], fill='#1e293b', outline='#334155')
        draw.text((rc_x + 30, ey + 6), f"🔹 {ev[:38]}", fill='#93c5fd', font=font_body)

    draw.rectangle([rc_x + 20, bp_y + 360, width - 65, bp_y + 490], fill='#0f172a', outline='#3b82f6')
    draw.text((rc_x + 35, bp_y + 375), "CHRONOLOGICAL EVENT 1:", fill='#60a5fa', font=font_mono)
    timeline = case_data.get("timeline", [])
    t0 = timeline[0] if len(timeline) > 0 else "Perimeter breach detected."
    draw.text((rc_x + 35, bp_y + 405), f"{t0[:110]}", fill='#f8fafc', font=font_body)


# ==========================================
# SCENE 2: UNIQUE INFILTRATION & ENTRY PER THEME
# ==========================================
def render_scene_2_infiltration(draw, width: int, height: int, f: int, case_data: Dict[str, Any], theme: str):
    draw_grid_background(draw, width, height)
    draw_header(draw, width, case_data, "Suspect Approach & Infiltration Trajectory", 2)
    draw_footer_disclaimer(draw, width, height)

    font_h2 = get_font(16, bold=True)
    font_body = get_font(13)
    font_mono = get_font(12, bold=True)

    stage_x, stage_y, stage_w, stage_h = 45, 110, 1190, 520
    draw.rectangle([stage_x, stage_y, stage_x + stage_w, stage_y + stage_h], fill='#040814', outline='#1e293b', width=2)

    rel_f = f - 60
    suspect_x = int(stage_x + 120 + (rel_f * 10))
    suspect_x = min(suspect_x, stage_x + 820)

    # 1. THEME-SPECIFIC ENVIRONMENT & BACKGROUND
    if theme == "BANK_ROBBERY":
        # Bank Exterior Pillars & Street
        draw.rectangle([stage_x, stage_y + 340, stage_x + stage_w, stage_y + stage_h], fill='#0f172a')
        for px in range(stage_x + 600, stage_x + 1000, 120):
            draw.rectangle([px, stage_y + 100, px + 45, stage_y + 340], fill='#1e293b', outline='#475569')
        # Bank Vault Outer Glass & Keycard Door
        draw.rectangle([stage_x + 850, stage_y + 160, stage_x + 980, stage_y + 340], fill='#020617', outline='#6366f1', width=3)
        draw.text((stage_x + 865, stage_y + 240), "KEYCARD GATE\n[BYPASSED]", fill='#ef4444', font=font_mono)
        # Suspect
        draw_suspect_figure(draw, suspect_x, stage_y + 245, scale=1.2, step_cycle=f, label="INTRUDER")

    elif theme == "DIAMOND_HEIST":
        # Rooftop & Skylight Rappel Infiltration
        draw.rectangle([stage_x, stage_y + 40, stage_x + stage_w, stage_y + 120], fill='#1e293b', outline='#475569')
        draw.text((stage_x + 40, stage_y + 60), "ROOFTOP DUCT & VENTILATION INGRESS", fill='#d8b4fe', font=font_mono)
        # Skylight opening
        draw.rectangle([stage_x + 500, stage_y + 110, stage_x + 720, stage_y + 150], fill='#090d16', outline='#a855f7', width=2)
        # Rappel Wire descending
        wire_y = min(stage_y + 320, int(stage_y + 120 + rel_f * 5))
        draw.line([stage_x + 610, stage_y + 120, stage_x + 610, wire_y], fill='#cbd5e1', width=3)
        draw_suspect_figure(draw, stage_x + 610, wire_y - 40, scale=1.1, step_cycle=f, label="CAT BURGLAR")

    elif theme == "CYBER_HEIST":
        # Security Air-Lock & Rogue Contractor Entry
        draw.rectangle([stage_x, stage_y + 340, stage_x + stage_w, stage_y + stage_h], fill='#022c22')
        draw.rectangle([stage_x + 800, stage_y + 120, stage_x + 960, stage_y + 340], fill='#064e3b', outline='#10b981', width=3)
        draw.text((stage_x + 820, stage_y + 220), "SERVER B2 ENTRY\n[ROGUE BADGE]", fill='#34d399', font=font_mono)
        # Suspect with contractor vest
        draw_suspect_figure(draw, suspect_x, stage_y + 245, scale=1.2, step_cycle=f, label="FAKE CONTRACTOR", outfit_color='#854d0e')

    elif theme == "HIGHWAY_AMBUSH":
        # Dark Highway & Spike Strip Deployment
        draw.rectangle([stage_x, stage_y + 220, stage_x + stage_w, stage_y + 420], fill='#1e293b')
        draw.line([stage_x, stage_y + 320, stage_x + stage_w, stage_y + 320], fill='#fbbf24', width=3)
        # Spike strip graphic
        draw.rectangle([stage_x + 600, stage_y + 270, stage_x + 820, stage_y + 370], fill='#7f1d1d', outline='#ef4444', width=2)
        draw.text((stage_x + 620, stage_y + 310), "⚡ TACTICAL SPIKE STRIP", fill='#fca5a5', font=font_mono)
        draw_suspect_figure(draw, suspect_x, stage_y + 245, scale=1.2, step_cycle=f, label="AMBUSH OPERATIVE")

    elif theme == "PHARMA_LAB":
        # Cleanroom Airlock & Cloned RFID Scanner
        draw.rectangle([stage_x, stage_y + 340, stage_x + stage_w, stage_y + stage_h], fill='#082f49')
        draw.rectangle([stage_x + 800, stage_y + 120, stage_x + 960, stage_y + 340], fill='#0c4a6e', outline='#38bdf8', width=3)
        draw.text((stage_x + 820, stage_y + 220), "LAB 7 BIOMETRIC\n[OVERRIDDEN]", fill='#38bdf8', font=font_mono)
        draw_suspect_figure(draw, suspect_x, stage_y + 245, scale=1.2, step_cycle=f, label="DISGUISED SCIENTIST", outfit_color='#0284c7')

    elif theme == "WAREHOUSE_ARSON":
        # Industrial Dock & Gasoline Canister Carrier
        draw.rectangle([stage_x, stage_y + 340, stage_x + stage_w, stage_y + stage_h], fill='#1c1917')
        # Warehouse door
        draw.rectangle([stage_x + 800, stage_y + 120, stage_x + 960, stage_y + 340], fill='#292524', outline='#ea580c', width=3)
        draw.text((stage_x + 820, stage_y + 220), "WAREHOUSE BAY\n[UNLOCKED]", fill='#fb923c', font=font_mono)
        # Red Gas Can in Hand
        draw.rectangle([suspect_x + 20, stage_y + 280, suspect_x + 40, stage_y + 310], fill='#dc2626', outline='#fca5a5')
        draw.text((suspect_x + 15, stage_y + 315), "FUEL CAN", fill='#f87171', font=get_font(9, bold=True))
        draw_suspect_figure(draw, suspect_x, stage_y + 245, scale=1.2, step_cycle=f, label="ARSONIST")

    else:
        draw.rectangle([stage_x, stage_y + 340, stage_x + stage_w, stage_y + stage_h], fill='#0f172a')
        draw_suspect_figure(draw, suspect_x, stage_y + 245, scale=1.2, step_cycle=f, label="SUSPECT")

    # Movement arrows on ground
    for px in range(stage_x + 120, suspect_x, 40):
        draw.ellipse([px, stage_y + 332, px + 6, stage_y + 338], fill='#38bdf8')
    draw_arrow(draw, (stage_x + 120, stage_y + 335), (suspect_x, stage_y + 335), color='#38bdf8', width=3)

    # CCTV Camera at Top
    cctv_x, cctv_y = stage_x + 790, stage_y + 120
    draw.rectangle([cctv_x - 15, cctv_y - 15, cctv_x + 15, cctv_y + 15], fill='#38bdf8', outline='#ffffff', width=2)
    draw.text((cctv_x - 110, cctv_y - 25), "📹 PERIMETER CCTV", fill='#38bdf8', font=font_mono)
    draw.polygon([(cctv_x, cctv_y), (cctv_x - 280, stage_y + 340), (cctv_x - 120, stage_y + 340)], fill='#0b1d30')

    draw_badge(draw, stage_x + 25, stage_y + 25, "APPROACH TIMELINE LOGGED", is_factual=True)
    draw_badge(draw, stage_x + 320, stage_y + 25, "INFILTRATION MOTION VECTOR", is_factual=False)

    # Narrative Card
    draw.rectangle([stage_x + 25, stage_y + stage_h - 110, stage_x + stage_w - 25, stage_y + stage_h - 20], fill='#020617', outline='#3b82f6', width=2)
    timeline = case_data.get("timeline", [])
    step_desc = timeline[0] if len(timeline) > 0 else "Suspect approached the perimeter undetected and breached entry point."
    draw.text((stage_x + 45, stage_y + stage_h - 98), "PHASE 1: INFILTRATION & ENTRY SEQUENCE", fill='#60a5fa', font=font_mono)
    draw.text((stage_x + 45, stage_y + stage_h - 72), f"• {step_desc[:120]}", fill='#ffffff', font=font_h2)


# ==========================================
# SCENE 3: UNIQUE INCIDENT EXECUTION PER THEME
# ==========================================
def render_scene_3_execution(draw, width: int, height: int, f: int, case_data: Dict[str, Any], theme: str):
    draw_grid_background(draw, width, height)
    draw_header(draw, width, case_data, "Primary Incident Execution & Crime Event", 3)
    draw_footer_disclaimer(draw, width, height)

    font_h2 = get_font(16, bold=True)
    font_body = get_font(13)
    font_mono = get_font(12, bold=True)

    stage_x, stage_y, stage_w, stage_h = 45, 110, 1190, 520
    draw.rectangle([stage_x, stage_y, stage_x + stage_w, stage_y + stage_h], fill='#020617', outline='#1e293b', width=2)

    draw_badge(draw, stage_x + 25, stage_y + 25, "PHYSICAL EVIDENCE & TOOL MARKS", is_factual=True)
    draw_badge(draw, stage_x + 360, stage_y + 25, "AI ACTION CHRONOLOGY SIMULATION", is_factual=False)

    rel_f = f - 120

    if theme == "BANK_ROBBERY":
        # Vault Safe Door Mechanism with Rotating Spokes & Sparks
        vault_cx, vault_cy = stage_x + 520, stage_y + 230
        draw.rectangle([stage_x + 260, stage_y + 70, stage_x + 780, stage_y + 390], fill='#0f172a', outline='#3b82f6', width=3)
        draw.ellipse([vault_cx - 130, vault_cy - 130, vault_cx + 130, vault_cy + 130], fill='#1e293b', outline='#6366f1', width=6)
        draw.ellipse([vault_cx - 40, vault_cy - 40, vault_cx + 40, vault_cy + 40], fill='#334155', outline='#818cf8', width=3)
        
        angle = (rel_f * 8) % 360
        for i in range(4):
            rad = math.radians(angle + i * 90)
            draw.line([vault_cx, vault_cy, vault_cx + int(36 * math.cos(rad)), vault_cy + int(36 * math.sin(rad))], fill='#fbbf24', width=4)

        draw.rectangle([stage_x + 840, stage_y + 120, stage_x + 1060, stage_y + 240], fill='#064e3b', outline='#10b981', width=2)
        draw.text((stage_x + 860, stage_y + 140), "💵 $2.4M CASH ASSETS", fill='#34d399', font=font_mono)
        draw.text((stage_x + 860, stage_y + 175), "• Vault Lock Forced Open\n• Guards Disarmed", fill='#f8fafc', font=font_body)

        draw_suspect_figure(draw, stage_x + 320, stage_y + 175, scale=1.3, step_cycle=rel_f, label="VAULT BREACHER")

    elif theme == "DIAMOND_HEIST":
        # Glass Display Case with Red Saw Laser Circle Cut
        draw.rectangle([stage_x + 360, stage_y + 140, stage_x + 820, stage_y + 380], fill='#1e112a', outline='#a855f7', width=3)
        draw.polygon([(stage_x + 380, stage_y + 140), (stage_x + 460, stage_y + 70), (stage_x + 720, stage_y + 70), (stage_x + 800, stage_y + 140)], fill='#090d16', outline='#c084fc', width=2)
        
        # Diamond Glowing
        draw.polygon([(stage_x + 590, stage_y + 90), (stage_x + 610, stage_y + 110), (stage_x + 590, stage_y + 130), (stage_x + 570, stage_y + 110)], fill='#38bdf8', outline='#ffffff', width=2)
        draw.text((stage_x + 540, stage_y + 65), "💎 12 UNCUT DIAMONDS", fill='#fef08a', font=font_mono)

        # Circular Glass Cutter Action Line
        cut_r = min(60, rel_f * 2)
        draw.ellipse([stage_x + 590 - cut_r, stage_y + 110 - cut_r, stage_x + 590 + cut_r, stage_y + 110 + cut_r], outline='#ef4444', width=3)
        draw.text((stage_x + 480, stage_y + 190), "✂️ DIAMOND-TIPPED GLASS CUTTER APPLIED", fill='#f87171', font=font_mono)

        draw_suspect_figure(draw, stage_x + 280, stage_y + 170, scale=1.3, step_cycle=rel_f, label="JEWEL THIEF")

    elif theme == "CYBER_HEIST":
        # Server Racks with Blinking LEDs & Data Exploitation Terminal
        for col in range(3):
            sx = stage_x + 120 + col * 160
            draw.rectangle([sx, stage_y + 90, sx + 120, stage_y + 380], fill='#0b1329', outline='#38bdf8', width=2)
            for row in range(5):
                sy = stage_y + 120 + row * 50
                led_col = '#22c55e' if (row + col + rel_f) % 3 == 0 else '#ef4444'
                draw.ellipse([sx + 15, sy, sx + 28, sy + 13], fill=led_col)
                draw.rectangle([sx + 40, sy + 3, sx + 105, sy + 10], fill='#1e293b')

        draw.rectangle([stage_x + 650, stage_y + 90, stage_x + 1120, stage_y + 380], fill='#000000', outline='#22c55e', width=2)
        draw.text((stage_x + 670, stage_y + 110), "> CYBER DATA EXTRAPOLATION ENGINE", fill='#22c55e', font=font_mono)
        draw.text((stage_x + 670, stage_y + 140), "> USB HARDWARE EXPLOIT: MOUNTED", fill='#38bdf8', font=font_body)
        draw.text((stage_x + 670, stage_y + 170), "> DOWNLOADING AUCTION & DONOR RECORDS", fill='#fef08a', font=font_body)
        
        pct = min(100, int(rel_f * 2.2))
        draw.rectangle([stage_x + 670, stage_y + 220, stage_x + 1080, stage_y + 250], fill='#1e293b')
        draw.rectangle([stage_x + 670, stage_y + 220, stage_x + 670 + int(4.1 * pct), stage_y + 250], fill='#22c55e')
        draw.text((stage_x + 680, stage_y + 228), f"EXTRACTING SENSITIVE PAYLOAD: {pct}%", fill='#000000', font=font_mono)

    elif theme == "HIGHWAY_AMBUSH":
        # Armored Truck Forced Open on Highway
        draw.rectangle([stage_x + 350, stage_y + 140, stage_x + 780, stage_y + 340], fill='#1e293b', outline='#f59e0b', width=3)
        draw.text((stage_x + 400, stage_y + 170), "🛡️ ARMORED CASH TRANSPORT TRUCK", fill='#fbbf24', font=font_mono)
        draw.text((stage_x + 400, stage_y + 205), "• Rear Security Vault Doors Breached\n• $800,000 Cash Shipment Looted\n• Transport Officers Disarmed", fill='#cbd5e1', font=font_body)
        
        # Blown tires on truck
        draw.ellipse([stage_x + 420, stage_y + 330, stage_x + 480, stage_y + 370], fill='#7f1d1d', outline='#ef4444', width=3)
        draw.ellipse([stage_x + 660, stage_y + 330, stage_x + 720, stage_y + 370], fill='#7f1d1d', outline='#ef4444', width=3)

        draw_suspect_figure(draw, stage_x + 260, stage_y + 180, scale=1.3, step_cycle=rel_f, label="ARMED ROBBER")

    elif theme == "PHARMA_LAB":
        # Cold Storage Unit & Bio-Chemical Vials Extraction
        draw.rectangle([stage_x + 350, stage_y + 100, stage_x + 850, stage_y + 380], fill='#0c4a6e', outline='#38bdf8', width=3)
        draw.text((stage_x + 380, stage_y + 120), "❄️ CRYOGENIC STORAGE VAULT (-80°C)", fill='#38bdf8', font=font_mono)
        
        # 15 Chemical Vials glowing green/cyan
        for vi in range(5):
            vx = stage_x + 400 + vi * 80
            draw.rectangle([vx, stage_y + 180, vx + 40, stage_y + 270], fill='#0284c7', outline='#67e8f9', width=2)
            draw.rectangle([vx + 5, stage_y + 210, vx + 35, stage_y + 265], fill='#22c55e')
            draw.text((vx + 8, stage_y + 280), f"V-{vi+1}", fill='#f8fafc', font=get_font(10))

        draw.text((stage_x + 380, stage_y + 320), "⚠️ 15 VIALS OF EXPERIMENTAL DRUG COMPOUND EXTRACTED", fill='#fef08a', font=font_mono)
        draw_suspect_figure(draw, stage_x + 240, stage_y + 180, scale=1.3, step_cycle=rel_f, label="DR. HARMON", outfit_color='#0284c7')

    elif theme == "WAREHOUSE_ARSON":
        # Accelerant Pouring & Flame Ignition Graphics
        draw.rectangle([stage_x + 200, stage_y + 120, stage_x + 950, stage_y + 380], fill='#292524', outline='#ea580c', width=3)
        draw.text((stage_x + 230, stage_y + 140), "🔥 WAREHOUSE 14 - TIMBER STORAGE FLOOR", fill='#f97316', font=font_mono)
        
        # Gasoline spill line
        draw.line([stage_x + 250, stage_y + 320, stage_x + 900, stage_y + 320], fill='#7c2d12', width=8)
        draw.text((stage_x + 250, stage_y + 335), "⚡ 20 GALLONS GASOLINE ACCELERANT POURED", fill='#fca5a5', font=font_mono)

        # Flame VFX (dynamic animated triangles)
        for fx in range(stage_x + 300, stage_x + 850, 90):
            flame_h = int(30 + math.sin(rel_f * 0.5 + fx) * 20)
            draw.polygon([(fx, stage_y + 320), (fx + 25, stage_y + 320 - flame_h), (fx + 50, stage_y + 320)], fill='#f97316')
            draw.polygon([(fx + 10, stage_y + 320), (fx + 25, stage_y + 320 - int(flame_h * 0.6)), (fx + 40, stage_y + 320)], fill='#fef08a')

        draw_suspect_figure(draw, stage_x + 180, stage_y + 180, scale=1.3, step_cycle=rel_f, label="ARSONIST")

    else:
        draw_suspect_figure(draw, stage_x + 350, stage_y + 180, scale=1.3, step_cycle=rel_f, label="SUSPECT")

    # Narrative Card
    draw.rectangle([stage_x + 25, stage_y + stage_h - 110, stage_x + stage_w - 25, stage_y + stage_h - 20], fill='#020617', outline='#f43f5e', width=2)
    timeline = case_data.get("timeline", [])
    step_desc = timeline[1] if len(timeline) > 1 else "Suspect executed primary criminal breach at the scene."
    draw.text((stage_x + 45, stage_y + stage_h - 98), "PHASE 2: INCIDENT EXECUTION & ASSET COMPROMISE", fill='#f87171', font=font_mono)
    draw.text((stage_x + 45, stage_y + stage_h - 72), f"• {step_desc[:120]}", fill='#ffffff', font=font_h2)


# ==========================================
# SCENE 4: UNIQUE ESCAPE ROUTE PER THEME
# ==========================================
def render_scene_4_escape(draw, width: int, height: int, f: int, case_data: Dict[str, Any], theme: str):
    draw_grid_background(draw, width, height)
    draw_header(draw, width, case_data, "Movement & Escape Route Reconstruction", 4)
    draw_footer_disclaimer(draw, width, height)

    font_h2 = get_font(16, bold=True)
    font_body = get_font(13)
    font_mono = get_font(12, bold=True)

    stage_x, stage_y, stage_w, stage_h = 45, 110, 1190, 520
    draw.rectangle([stage_x, stage_y, stage_x + stage_w, stage_y + stage_h], fill='#020617', outline='#1e293b', width=2)

    rel_f = f - 180
    vehicle_x = int(stage_x + 120 + (rel_f * 15))

    # Roadway
    draw.rectangle([stage_x, stage_y + 220, stage_x + stage_w, stage_y + stage_h - 120], fill='#0f172a')
    draw.line([stage_x, stage_y + 220, stage_x + stage_w, stage_y + 220], fill='#334155', width=2)
    draw.line([stage_x, stage_y + stage_h - 120, stage_x + stage_w, stage_y + stage_h - 120], fill='#334155', width=2)

    for rx in range(stage_x + 10, stage_x + stage_w, 70):
        draw.line([rx, stage_y + 300, rx + 35, stage_y + 300], fill='#fbbf24', width=4)

    draw_arrow(draw, (stage_x + 100, stage_y + 160), (stage_x + 950, stage_y + 160), color='#10b981', width=4, arrow_size=16)

    # 1. THEME-SPECIFIC ESCAPE VEHICLE / ROUTE
    if theme == "DIAMOND_HEIST":
        draw.text((stage_x + 120, stage_y + 135), "EXFILTRATION CORRIDOR: SERVICE ALLEY → MOTORCYCLE EVASION", fill='#34d399', font=font_mono)
        # Motorcycle Silhouette
        draw.ellipse([vehicle_x - 30, stage_y + 310, vehicle_x, stage_y + 340], fill='#000', outline='#a855f7', width=3)
        draw.ellipse([vehicle_x + 40, stage_y + 310, vehicle_x + 70, stage_y + 340], fill='#000', outline='#a855f7', width=3)
        draw.line([vehicle_x - 15, stage_y + 325, vehicle_x + 20, stage_y + 280], fill='#a855f7', width=4)
        draw.line([vehicle_x + 20, stage_y + 280, vehicle_x + 55, stage_y + 325], fill='#a855f7', width=4)
        draw_suspect_figure(draw, vehicle_x + 20, stage_y + 240, scale=0.9, step_cycle=f, label="FLEEING CYCLIST")

    elif theme == "CYBER_HEIST":
        draw.text((stage_x + 120, stage_y + 135), "EXFILTRATION CORRIDOR: EMERGENCY FIRE STAIRWELL → METRO", fill='#34d399', font=font_mono)
        # Running suspect with laptop bag
        draw_suspect_figure(draw, vehicle_x, stage_y + 230, scale=1.3, step_cycle=f * 2, label="FLEEING HACKER")
        draw.rectangle([vehicle_x + 20, stage_y + 280, vehicle_x + 50, stage_y + 310], fill='#1e293b', outline='#22c55e')
        draw.text((vehicle_x + 22, stage_y + 290), "SSD", fill='#22c55e', font=get_font(9, bold=True))

    elif theme == "HIGHWAY_AMBUSH":
        draw.text((stage_x + 120, stage_y + 135), "EXFILTRATION CORRIDOR: INTERSTATE 45 OFF-RAMP (GETAWAY PICKUP)", fill='#34d399', font=font_mono)
        # Pickup Truck
        draw.rectangle([vehicle_x - 70, stage_y + 270, vehicle_x + 80, stage_y + 315], fill='#475569', outline='#94a3b8', width=2)
        draw.rectangle([vehicle_x + 10, stage_y + 250, vehicle_x + 80, stage_y + 270], fill='#1e293b', outline='#38bdf8')
        draw.ellipse([vehicle_x - 40, stage_y + 310, vehicle_x - 10, stage_y + 340], fill='#000', outline='#fff', width=2)
        draw.ellipse([vehicle_x + 40, stage_y + 310, vehicle_x + 70, stage_y + 340], fill='#000', outline='#fff', width=2)

    elif theme == "PHARMA_LAB":
        draw.text((stage_x + 120, stage_y + 135), "EXFILTRATION CORRIDOR: RESEARCH PARK LOADING DOCK (DELIVERY VAN)", fill='#34d399', font=font_mono)
        # White Delivery Van
        draw.rectangle([vehicle_x - 80, stage_y + 240, vehicle_x + 80, stage_y + 315], fill='#f8fafc', outline='#94a3b8', width=2)
        draw.rectangle([vehicle_x + 40, stage_y + 250, vehicle_x + 75, stage_y + 280], fill='#0284c7')
        draw.ellipse([vehicle_x - 50, stage_y + 310, vehicle_x - 20, stage_y + 340], fill='#000', outline='#fff', width=2)
        draw.ellipse([vehicle_x + 40, stage_y + 310, vehicle_x + 70, stage_y + 340], fill='#000', outline='#fff', width=2)

    else:
        # Bank Robbery & Default: Black Getaway Sedan
        draw.text((stage_x + 120, stage_y + 135), "EXFILTRATION CORRIDOR: REAR SERVICE ALLEYWAY → BLACK SEDAN", fill='#34d399', font=font_mono)
        draw.polygon([
            (vehicle_x - 80, stage_y + 310),
            (vehicle_x - 70, stage_y + 285),
            (vehicle_x - 30, stage_y + 265),
            (vehicle_x + 30, stage_y + 265),
            (vehicle_x + 60, stage_y + 285),
            (vehicle_x + 90, stage_y + 310)
        ], fill='#1e293b', outline='#64748b', width=2)
        draw.ellipse([vehicle_x - 50, stage_y + 305, vehicle_x - 20, stage_y + 335], fill='#020617', outline='#94a3b8', width=3)
        draw.ellipse([vehicle_x + 45, stage_y + 305, vehicle_x + 75, stage_y + 335], fill='#020617', outline='#94a3b8', width=3)

    draw_badge(draw, stage_x + 25, stage_y + 25, "ESCAPE VEHICLE / FOOTPRINT TRACKS", is_factual=True)
    draw_badge(draw, stage_x + 380, stage_y + 25, "ESTIMATED ESCAPE SPEED & VECTOR", is_factual=False)

    # Narrative Card
    draw.rectangle([stage_x + 25, stage_y + stage_h - 110, stage_x + stage_w - 25, stage_y + stage_h - 20], fill='#020617', outline='#10b981', width=2)
    timeline = case_data.get("timeline", [])
    step_desc = timeline[2] if len(timeline) > 2 else "Suspects fled through rear exit into waiting vehicle."
    draw.text((stage_x + 45, stage_y + stage_h - 98), "PHASE 3: ESCAPE ROUTE & EVASION", fill='#34d399', font=font_mono)
    draw.text((stage_x + 45, stage_y + stage_h - 72), f"• {step_desc[:120]}", fill='#ffffff', font=font_h2)


# ==========================================
# SCENE 5: UNIQUE AI SUSPECT DOSSIER PER CASE
# ==========================================
def render_scene_5_dossier(draw, width: int, height: int, f: int, case_data: Dict[str, Any], theme: str):
    draw_grid_background(draw, width, height)
    draw_header(draw, width, case_data, "AI Suspect Prediction & Case Dossier", 5)
    draw_footer_disclaimer(draw, width, height)

    font_h1 = get_font(20, bold=True)
    font_h2 = get_font(16, bold=True)
    font_body = get_font(13)
    font_mono = get_font(12, bold=True)

    stage_x, stage_y, stage_w, stage_h = 45, 110, 1190, 520
    draw.rectangle([stage_x, stage_y, stage_x + stage_w, stage_y + stage_h], fill='#070c18', outline='#1e293b', width=2)

    suspect = case_data.get("suspect_prediction", {})
    name = suspect.get("name", "Suspect Identified")
    alias = suspect.get("alias", "Unknown Alias")
    confidence = suspect.get("confidence", "91.4%")
    motive = suspect.get("motive", "Financial Gain")
    risk = suspect.get("risk_level", "CRITICAL")
    alibi = suspect.get("alibi_status", "Unverified")

    # Left: Suspect Profile Card
    card_w = 480
    draw.rectangle([stage_x + 30, stage_y + 30, stage_x + card_w, stage_y + stage_h - 30], fill='#0b1326', outline='#6366f1', width=2)
    
    # Suspect Mugshot Box with Target Reticle
    mug_cx, mug_cy = stage_x + 120, stage_y + 130
    draw.rectangle([mug_cx - 60, mug_cy - 60, mug_cx + 60, mug_cy + 60], fill='#020617', outline='#3b82f6', width=2)
    draw.ellipse([mug_cx - 25, mug_cy - 40, mug_cx + 25, mug_cy + 5], fill='#334155')
    draw.ellipse([mug_cx - 45, mug_cy + 10, mug_cx + 45, mug_cy + 80], fill='#1e293b')
    draw.line([mug_cx - 60, mug_cy, mug_cx + 60, mug_cy], fill='#7f1d1d', width=1)
    draw.line([mug_cx, mug_cy - 60, mug_cx, mug_cy + 60], fill='#7f1d1d', width=1)
    draw.text((mug_cx - 40, mug_cy + 40), "BIOMETRIC MATCH", fill='#ef4444', font=get_font(9, bold=True))

    draw.text((stage_x + 200, stage_y + 75), name.upper(), fill='#f8fafc', font=font_h1)
    draw.text((stage_x + 200, stage_y + 105), f"Alias: \"{alias}\"", fill='#93c5fd', font=font_body)
    draw.text((stage_x + 200, stage_y + 130), f"Risk Level: {risk}", fill='#f87171' if risk == 'CRITICAL' else '#fbbf24', font=font_mono)

    # Confidence Score Bar
    draw.rectangle([stage_x + 50, stage_y + 215, stage_x + card_w - 50, stage_y + 275], fill='#0f172a', outline='#334155')
    draw.text((stage_x + 65, stage_y + 225), f"AI PREDICTION CONFIDENCE: {confidence}", fill='#fef08a', font=font_mono)
    try:
        pct_val = float(confidence.replace('%', ''))
    except Exception:
        pct_val = 90.0
    bar_max_w = card_w - 130
    fill_w = int(bar_max_w * (pct_val / 100.0))
    draw.rectangle([stage_x + 65, stage_y + 250, stage_x + 65 + bar_max_w, stage_y + 262], fill='#1e293b')
    draw.rectangle([stage_x + 65, stage_y + 250, stage_x + 65 + fill_w, stage_y + 262], fill='#10b981')

    draw.text((stage_x + 50, stage_y + 295), "SUSPECT MOTIVE ANALYSIS:", fill='#94a3b8', font=font_mono)
    draw.text((stage_x + 50, stage_y + 318), motive[:50], fill='#e2e8f0', font=font_body)

    draw.text((stage_x + 50, stage_y + 360), "ALIBI VERIFICATION STATUS:", fill='#94a3b8', font=font_mono)
    draw.text((stage_x + 50, stage_y + 383), alibi, fill='#f87171', font=font_body)

    # Right: Case Audit & Evidence Synthesis
    rx = stage_x + card_w + 30
    draw.rectangle([rx, stage_y + 30, stage_x + stage_w - 30, stage_y + stage_h - 30], fill='#0b1326', outline='#1e293b', width=2)
    draw.text((rx + 25, stage_y + 50), "🔎 INVESTIGATION AUDIT & EVIDENCE SYNTHESIS", fill='#38bdf8', font=font_h2)

    draw_badge(draw, rx + 25, stage_y + 90, "EVIDENCE SECURED IN MONGODB", is_factual=True)
    draw_badge(draw, rx + 25, stage_y + 125, "TIMELINE RECONSTRUCTION COMPLETE", is_factual=False)

    draw.text((rx + 25, stage_y + 175), "CORROBORATING EVIDENCE REGISTER:", fill='#cbd5e1', font=font_mono)
    for idx, ev in enumerate(case_data.get("evidence", [])[:4]):
        draw.text((rx + 35, stage_y + 205 + idx * 28), f"✔ {ev}", fill='#34d399', font=font_body)

    draw.rectangle([rx + 25, stage_y + 330, stage_x + stage_w - 55, stage_y + stage_h - 45], fill='#020617', outline='#3b82f6')
    draw.text((rx + 40, stage_y + 345), "LEGAL STATUS:", fill='#60a5fa', font=font_mono)
    draw.text((rx + 40, stage_y + 370), f"Status: {case_data.get('status', 'Under Investigation')}", fill='#f8fafc', font=font_body)


# ==========================================
# MASTER FRAME RENDERER
# ==========================================
def generate_reconstruction_frames(case_data: Dict[str, Any], temp_dir: Path) -> List[str]:
    width, height = 1280, 720
    frame_paths = []
    total_frames = 300
    theme = detect_case_theme(case_data)

    for f in range(total_frames):
        img = Image.new('RGB', (width, height), color='#090d16')
        draw = ImageDraw.Draw(img)

        if f < 60:
            render_scene_1_blueprint(draw, width, height, f, case_data, theme)
        elif f < 120:
            render_scene_2_infiltration(draw, width, height, f, case_data, theme)
        elif f < 180:
            render_scene_3_execution(draw, width, height, f, case_data, theme)
        elif f < 240:
            render_scene_4_escape(draw, width, height, f, case_data, theme)
        else:
            render_scene_5_dossier(draw, width, height, f, case_data, theme)

        frame_path = str(temp_dir / f"frame_{f:03d}.png")
        img.save(frame_path)
        frame_paths.append(frame_path)

    return frame_paths


# ==========================================
# DYNAMIC INVESTIGATOR AUDIO STORYTELLER
# ==========================================
def build_case_narration_story(case_data: Dict[str, Any]) -> str:
    """
    Creates an immersive, dynamic story narration describing how the suspect entered the room,
    committed the specific crime, and escaped, completely tailored to the case details.
    """
    case_id = case_data.get("case_id", "CR-101")
    title = case_data.get("title", "Criminal Incident")
    location = case_data.get("location", "the scene")
    timestamp = case_data.get("timestamp", "the time of incident")
    timeline = case_data.get("timeline", [])
    suspect = case_data.get("suspect_prediction", {})
    suspect_name = suspect.get("name", "the identified suspect")
    alias = suspect.get("alias", "Unknown")
    confidence = suspect.get("confidence", "90 percent")
    motive = suspect.get("motive", "unlawful financial theft")
    evidence = case_data.get("evidence", [])

    # Story steps from actual timeline
    step1 = timeline[0] if len(timeline) > 0 else "The suspect approached the outer perimeter and bypassed entry security."
    step2 = timeline[1] if len(timeline) > 1 else "The suspect entered the primary area and executed the crime."
    step3 = timeline[2] if len(timeline) > 2 else "The suspect looted the targeted assets and disarmed alarms."
    step4 = timeline[3] if len(timeline) > 3 else (timeline[2] if len(timeline) > 2 else "The suspect escaped into a waiting vehicle.")

    # Convert bullets/timestamps cleanly for speech
    clean_step1 = step1.replace("AM -", "AM,").replace("PM -", "PM,")
    clean_step2 = step2.replace("AM -", "AM,").replace("PM -", "PM,")
    clean_step3 = step3.replace("AM -", "AM,").replace("PM -", "PM,")
    clean_step4 = step4.replace("AM -", "AM,").replace("PM -", "PM,")

    ev_text = ", and ".join(evidence[:2]) if evidence else "forensic physical clues"

    narration = (
        f"Forensic Crime Reconstruction for Case {case_id}: {title}. "
        f"Incident occurred at {location}, recorded on {timestamp}. "
        f"Here is how the crime took place. "
        f"First, {clean_step1}. "
        f"Next, {clean_step2}. "
        f"Then, {clean_step3}. "
        f"Finally, {clean_step4}. "
        f"Investigators recovered critical physical evidence including {ev_text}. "
        f"AI predictive modeling identifies {suspect_name}, known as {alias}, as the primary suspect with a {confidence} confidence score, driven by {motive}. "
        f"This AI-assisted visual reconstruction is for investigative support and does not establish guilt."
    )
    return narration


def generate_reconstruction_video(case_data: Dict[str, Any], output_video_path: str) -> str:
    """
    Synthesizes the complete unique MP4 crime reconstruction video with dynamic story narration.
    """
    case_id = case_data.get("case_id", "CR-101")
    temp_dir = Path(output_video_path).parent / f"temp_recon_{case_id}"
    temp_dir.mkdir(parents=True, exist_ok=True)

    try:
        # 1. Render all 300 theme-specific visual frames
        generate_reconstruction_frames(case_data, temp_dir)

        # 2. Build case-specific story narration
        narration_script = build_case_narration_story(case_data)

        audio_path = str(temp_dir / "narration.mp3")
        tts = gTTS(text=narration_script, lang='en')
        tts.save(audio_path)

        # 3. Compile MP4 with FFmpeg
        ffmpeg_cmd = [
            'ffmpeg',
            '-y',
            '-framerate', '15',
            '-i', str(temp_dir / 'frame_%03d.png'),
            '-i', audio_path,
            '-c:v', 'libx264',
            '-pix_fmt', 'yuv420p',
            '-c:a', 'aac',
            '-b:a', '128k',
            '-shortest',
            output_video_path
        ]

        res = subprocess.run(ffmpeg_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if res.returncode != 0:
            raise RuntimeError(f"FFmpeg compilation failed: {res.stderr}")

        return output_video_path

    finally:
        import shutil
        shutil.rmtree(temp_dir, ignore_errors=True)
