"""
pdf_generator.py
Generates a clean, ATS-friendly resume PDF from structured data
using ReportLab. Returns bytes that can be sent as a file download.
"""

import io
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer,
    HRFlowable, ListFlowable, ListItem,
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER


# ── Brand colors ─────────────────────────────────
COLOR_PURPLE = colors.HexColor("#6C3AED")
COLOR_DARK   = colors.HexColor("#0F172A")
COLOR_MID    = colors.HexColor("#475569")
COLOR_LIGHT  = colors.HexColor("#94A3B8")


def generate_resume_pdf(resume_data: dict) -> bytes:
    """
    Generate a PDF resume from structured data.

    resume_data keys:
        name, email, phone, location, linkedin,
        summary, skills, experience (list of dicts),
        education (list of dicts), certifications (list)

    Returns PDF as bytes.
    """
    buffer = io.BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=1.8 * cm,
        rightMargin=1.8 * cm,
        topMargin=1.5 * cm,
        bottomMargin=1.5 * cm,
    )

    styles = _build_styles()
    story  = []

    # ── Header — Name ─────────────────────────────
    name = resume_data.get("name", "Your Name")
    story.append(Paragraph(name.upper(), styles["name"]))
    story.append(Spacer(1, 4))

    # ── Contact row ────────────────────────────────
    contact_parts = []
    if resume_data.get("email"):    contact_parts.append(resume_data["email"])
    if resume_data.get("phone"):    contact_parts.append(resume_data["phone"])
    if resume_data.get("location"): contact_parts.append(resume_data["location"])
    if resume_data.get("linkedin"): contact_parts.append(resume_data["linkedin"])

    if contact_parts:
        story.append(Paragraph("  |  ".join(contact_parts), styles["contact"]))

    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=2, color=COLOR_PURPLE))
    story.append(Spacer(1, 8))

    # ── Professional Summary ───────────────────────
    summary = resume_data.get("summary", "")
    if summary:
        story.append(Paragraph("PROFESSIONAL SUMMARY", styles["section_title"]))
        story.append(Spacer(1, 4))
        story.append(Paragraph(summary, styles["body"]))
        story.append(Spacer(1, 10))

    # ── Skills ────────────────────────────────────
    skills = resume_data.get("skills", [])
    if skills:
        story.append(Paragraph("SKILLS", styles["section_title"]))
        story.append(Spacer(1, 4))

        # Group skills into rows of 4
        skill_rows = [skills[i:i+4] for i in range(0, len(skills), 4)]
        for row in skill_rows:
            story.append(Paragraph("  •  ".join(row), styles["skill_row"]))
            story.append(Spacer(1, 3))

        story.append(Spacer(1, 8))

    # ── Experience ────────────────────────────────
    experience = resume_data.get("experience", [])
    if experience:
        story.append(Paragraph("EXPERIENCE", styles["section_title"]))
        story.append(Spacer(1, 6))

        for exp in experience:
            # Role + Company row
            story.append(Paragraph(
                f"<b>{exp.get('role', '')}</b> — {exp.get('company', '')}",
                styles["job_title"],
            ))
            # Date + Location
            date_loc = []
            if exp.get("duration"): date_loc.append(exp["duration"])
            if exp.get("location"): date_loc.append(exp["location"])
            if date_loc:
                story.append(Paragraph(" | ".join(date_loc), styles["job_meta"]))

            story.append(Spacer(1, 4))

            # Bullet points
            bullets = exp.get("bullets", [])
            if bullets:
                items = [
                    ListItem(
                        Paragraph(b, styles["bullet"]),
                        bulletColor=COLOR_PURPLE,
                        leftIndent=16,
                        bulletIndent=0,
                    )
                    for b in bullets
                ]
                story.append(ListFlowable(items, bulletType="bullet", start="•"))

            story.append(Spacer(1, 10))

    # ── Education ────────────────────────────────
    education = resume_data.get("education", [])
    if education:
        story.append(Paragraph("EDUCATION", styles["section_title"]))
        story.append(Spacer(1, 6))

        for edu in education:
            story.append(Paragraph(
                f"<b>{edu.get('degree', '')}</b> — {edu.get('institution', '')}",
                styles["job_title"],
            ))
            meta = []
            if edu.get("year"):  meta.append(edu["year"])
            if edu.get("grade"): meta.append(f"Grade: {edu['grade']}")
            if meta:
                story.append(Paragraph(" | ".join(meta), styles["job_meta"]))
            story.append(Spacer(1, 8))

    # ── Certifications ────────────────────────────
    certs = resume_data.get("certifications", [])
    if certs:
        story.append(Paragraph("CERTIFICATIONS", styles["section_title"]))
        story.append(Spacer(1, 4))
        for cert in certs:
            story.append(Paragraph(f"• {cert}", styles["body"]))
            story.append(Spacer(1, 2))

    # ── Build PDF ─────────────────────────────────
    doc.build(story)
    buffer.seek(0)
    return buffer.read()


def _build_styles() -> dict:
    """Build and return all paragraph styles."""
    base = getSampleStyleSheet()

    return {
        "name": ParagraphStyle(
            "name",
            parent=base["Normal"],
            fontSize=22,
            fontName="Helvetica-Bold",
            textColor=COLOR_DARK,
            alignment=TA_CENTER,
            spaceAfter=2,
            letterSpacing=3,
        ),
        "contact": ParagraphStyle(
            "contact",
            parent=base["Normal"],
            fontSize=9,
            fontName="Helvetica",
            textColor=COLOR_MID,
            alignment=TA_CENTER,
        ),
        "section_title": ParagraphStyle(
            "section_title",
            parent=base["Normal"],
            fontSize=10,
            fontName="Helvetica-Bold",
            textColor=COLOR_PURPLE,
            spaceAfter=2,
            letterSpacing=2,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["Normal"],
            fontSize=9.5,
            fontName="Helvetica",
            textColor=COLOR_DARK,
            leading=14,
        ),
        "skill_row": ParagraphStyle(
            "skill_row",
            parent=base["Normal"],
            fontSize=9,
            fontName="Helvetica",
            textColor=COLOR_DARK,
            leading=13,
        ),
        "job_title": ParagraphStyle(
            "job_title",
            parent=base["Normal"],
            fontSize=10,
            fontName="Helvetica-Bold",
            textColor=COLOR_DARK,
        ),
        "job_meta": ParagraphStyle(
            "job_meta",
            parent=base["Normal"],
            fontSize=8.5,
            fontName="Helvetica-Oblique",
            textColor=COLOR_LIGHT,
        ),
        "bullet": ParagraphStyle(
            "bullet",
            parent=base["Normal"],
            fontSize=9,
            fontName="Helvetica",
            textColor=COLOR_DARK,
            leading=13,
        ),
    }