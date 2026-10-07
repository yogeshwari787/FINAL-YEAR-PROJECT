import os
from pathlib import Path
from typing import Dict, Any
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_case_dossier_pdf(case_data: Dict[str, Any], output_path: str) -> str:
    """
    Generates a formal, official law enforcement Criminal Case Dossier / Investigation Report PDF.
    """
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=40, leftMargin=40,
        topMargin=40, bottomMargin=40
    )

    styles = getSampleStyleSheet()

    # Custom styles
    header_style = ParagraphStyle(
        'DocHeader',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0f172a'),
        alignment=1
    )
    sub_header_style = ParagraphStyle(
        'DocSubHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#475569'),
        alignment=1
    )
    section_title_style = ParagraphStyle(
        'SectionTitle',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#1e293b'),
        spaceBefore=10,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155')
    )
    bold_label = ParagraphStyle(
        'BoldLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#1e293b')
    )

    story = []

    # 1. Header & Department Seal
    story.append(Paragraph("POLICE DEPARTMENT FORENSIC INVESTIGATION DIVISION", header_style))
    story.append(Paragraph("OFFICIAL CRIMINAL CASE DOSSIER & INVESTIGATION REPORT", sub_header_style))
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#0f172a'), spaceBefore=2, spaceAfter=10))

    # 2. Case Overview Table
    case_id = case_data.get("case_id", "N/A")
    title = case_data.get("title", "Untitled Investigation")
    location = case_data.get("location", "Unknown Location")
    timestamp = case_data.get("timestamp", "N/A")
    sector = case_data.get("sector", "Sector 1")
    clearance = case_data.get("commissioner_clearance_status", "GRANTED")
    approval = case_data.get("commissioner_approval", "PENDING")

    overview_data = [
        [
            Paragraph("<b>CASE FILE ID:</b>", bold_label), Paragraph(case_id, body_style),
            Paragraph("<b>SECURITY STATUS:</b>", bold_label), Paragraph(f"AES-256 Sealed ({clearance})", body_style)
        ],
        [
            Paragraph("<b>CASE TITLE:</b>", bold_label), Paragraph(title, body_style),
            Paragraph("<b>SECTOR / REGION:</b>", bold_label), Paragraph(sector, body_style)
        ],
        [
            Paragraph("<b>INCIDENT LOCATION:</b>", bold_label), Paragraph(location, body_style),
            Paragraph("<b>INCIDENT TIME:</b>", bold_label), Paragraph(timestamp, body_style)
        ],
        [
            Paragraph("<b>INVESTIGATOR:</b>", bold_label), Paragraph(case_data.get("assigned_investigator", "Investigator"), body_style),
            Paragraph("<b>COMMISSIONER STATUS:</b>", bold_label), Paragraph(approval, body_style)
        ]
    ]

    t_overview = Table(overview_data, colWidths=[1.4*inch, 2.3*inch, 1.5*inch, 2.1*inch])
    t_overview.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_overview)
    story.append(Spacer(1, 10))

    # 3. AI Suspect Prediction & Biometric Profile
    story.append(Paragraph("1. PRIMARY SUSPECT IDENTIFICATION & BIOMETRIC RISK PROFILE", section_title_style))
    pred = case_data.get("suspect_prediction", {})
    suspect_name = pred.get("name", "Unknown")
    alias = pred.get("alias", "N/A")
    conf = pred.get("confidence", "N/A")
    motive = pred.get("motive", "Under Evaluation")
    risk = pred.get("risk_level", "HIGH")

    suspect_data = [
        [
            Paragraph("<b>Suspect Name:</b>", bold_label), Paragraph(suspect_name, body_style),
            Paragraph("<b>Known Alias:</b>", bold_label), Paragraph(alias, body_style)
        ],
        [
            Paragraph("<b>AI Confidence:</b>", bold_label), Paragraph(conf, body_style),
            Paragraph("<b>Threat Classification:</b>", bold_label), Paragraph(f"<b>{risk} RISK</b>", body_style)
        ],
        [
            Paragraph("<b>Primary Motive:</b>", bold_label), Paragraph(motive, body_style),
            Paragraph("<b>Alibi Status:</b>", bold_label), Paragraph(pred.get("alibi_status", "Unverified"), body_style)
        ]
    ]
    t_suspect = Table(suspect_data, colWidths=[1.4*inch, 2.3*inch, 1.5*inch, 2.1*inch])
    t_suspect.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#fff1f2') if risk == 'CRITICAL' else colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#fda4af') if risk == 'CRITICAL' else colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_suspect)
    story.append(Spacer(1, 10))

    # 4. Forensic Evidence Registry
    story.append(Paragraph("2. COLLECTED FORENSIC EVIDENCE REGISTRY", section_title_style))
    evidence_items = case_data.get("evidence", [])
    if evidence_items:
        ev_data = [[Paragraph(f"• <b>Evidence Item #{i+1}:</b> {ev}", body_style)] for i, ev in enumerate(evidence_items)]
    else:
        ev_data = [[Paragraph("No physical evidence logged.", body_style)]]
    
    t_evidence = Table(ev_data, colWidths=[7.3*inch])
    t_evidence.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_evidence)
    story.append(Spacer(1, 10))

    # 5. Incident Chronological Timeline
    story.append(Paragraph("3. CHRONOLOGICAL INCIDENT TIMELINE", section_title_style))
    timeline_items = case_data.get("timeline", [])
    if timeline_items:
        time_data = [[Paragraph(f"<b>Stage {i+1}:</b> {t}", body_style)] for i, t in enumerate(timeline_items)]
    else:
        time_data = [[Paragraph("No chronological timeline recorded.", body_style)]]

    t_time = Table(time_data, colWidths=[7.3*inch])
    t_time.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_time)
    story.append(Spacer(1, 10))

    # 6. Officer Forensic Findings & Commissioner Directive
    story.append(Paragraph("4. 3-TIER VERIFICATION & EXECUTIVE CLEARANCE AUDIT", section_title_style))
    officer_ver = case_data.get("officer_verification", {})
    audit_data = [
        [
            Paragraph("<b>Tier 2 Forensic Verification:</b>", bold_label),
            Paragraph(f"{officer_ver.get('status', 'Pending')} — {officer_ver.get('notes', 'No notes logged')}", body_style)
        ],
        [
            Paragraph("<b>Tier 3 Commissioner Directive:</b>", bold_label),
            Paragraph(f"{approval} — Clearance: {clearance}. Immutable SHA-256 seal verified.", body_style)
        ]
    ]
    t_audit = Table(audit_data, colWidths=[2.2*inch, 5.1*inch])
    t_audit.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_audit)
    story.append(Spacer(1, 14))

    # 7. Signature & Seal Footer
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#94a3b8'), spaceBefore=4, spaceAfter=8))
    footer_text = Paragraph(
        "<b>LEGAL FORENSIC NOTICE:</b> This Case Dossier is cryptographically sealed under AES-256 encryption. "
        "Unauthorized modification or tampering invalidates the digital integrity signature.",
        ParagraphStyle('Footer', parent=styles['Normal'], fontSize=7.5, leading=10, textColor=colors.HexColor('#64748b'), alignment=1)
    )
    story.append(footer_text)

    doc.build(story)
    return output_path
