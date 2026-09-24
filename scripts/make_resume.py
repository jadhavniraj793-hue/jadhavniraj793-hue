#!/usr/bin/env python3
"""Generate Niraj Jadhav's resume PDF.

Content is sourced exclusively from the details Niraj provided — no invented
education, employment, projects or certifications.
"""

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    HRFlowable,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

INK = colors.HexColor("#0f172a")
BODY = colors.HexColor("#334155")
MUTED = colors.HexColor("#64748b")
ACCENT = colors.HexColor("#6d28d9")

OUT = "public/resume/Niraj_Jadhav_Resume.pdf"

name_s = ParagraphStyle("name", fontName="Helvetica-Bold", fontSize=21, leading=25, textColor=INK, alignment=TA_CENTER)
role_s = ParagraphStyle("role", fontName="Helvetica", fontSize=11.5, leading=15, textColor=ACCENT, alignment=TA_CENTER, spaceBefore=3)
contact_s = ParagraphStyle("contact", fontName="Helvetica", fontSize=9.2, leading=13, textColor=MUTED, alignment=TA_CENTER, spaceBefore=5)
section_s = ParagraphStyle("section", fontName="Helvetica-Bold", fontSize=10.8, leading=14, textColor=ACCENT, spaceBefore=13, spaceAfter=2)
body_s = ParagraphStyle("body", fontName="Helvetica", fontSize=9.6, leading=13.6, textColor=BODY)
item_s = ParagraphStyle("item", fontName="Helvetica", fontSize=9.6, leading=13.6, textColor=BODY, leftIndent=11, bulletIndent=2, spaceBefore=1.5)
job_title_s = ParagraphStyle("jtitle", fontName="Helvetica-Bold", fontSize=10.6, leading=14, textColor=INK)
job_meta_s = ParagraphStyle("jmeta", fontName="Helvetica", fontSize=9.4, leading=13, textColor=MUTED, alignment=2)
skill_h = ParagraphStyle("skillh", fontName="Helvetica-Bold", fontSize=9.6, leading=13.6, textColor=INK)


def section(title):
    return [
        Paragraph(title, section_s),
        HRFlowable(width="100%", thickness=1.1, color=colors.HexColor("#ddd6fe"), spaceBefore=1, spaceAfter=6),
    ]


def bullets(items):
    return [Paragraph(f"• {t}", item_s) for t in items]


doc = SimpleDocTemplate(
    OUT,
    pagesize=A4,
    leftMargin=15 * mm,
    rightMargin=15 * mm,
    topMargin=13 * mm,
    bottomMargin=13 * mm,
    title="Niraj Laxman Jadhav — Data Analyst Resume",
    author="Niraj Laxman Jadhav",
)

story = []

# ------------------------------- header ------------------------------------
story.append(Paragraph("NIRAJ LAXMAN JADHAV", name_s))
story.append(Paragraph("Data Analyst", role_s))
story.append(
    Paragraph(
        "Mumbai, India &nbsp;|&nbsp; +91 72087 01481 &nbsp;|&nbsp; jadhavniraj793@gmail.com "
        "&nbsp;|&nbsp; linkedin.com/in/niraj-jadhav-b313ba39a",
        contact_s,
    )
)
story.append(Spacer(1, 4))

# ------------------------------- summary ------------------------------------
story += section("PROFESSIONAL SUMMARY")
story.append(
    Paragraph(
        "Detail-oriented and analytically minded Data Analyst with hands-on experience in Excel, SQL, "
        "Python, Power BI, and Tableau. Skilled at cleaning, analyzing, and visualizing data to uncover "
        "trends and support data-driven decision-making — passionate about transforming raw data into "
        "clear, actionable business insights.",
        body_s,
    )
)

# ------------------------------- skills -------------------------------------
story += section("TECHNICAL SKILLS")
skills_rows = [
    [Paragraph("Data Analysis & BI", skill_h), Paragraph("Excel, Advanced Excel, SQL, Python", body_s)],
    [Paragraph("Python Libraries", skill_h), Paragraph("Pandas, NumPy, Matplotlib, Seaborn", body_s)],
    [Paragraph("Visualization", skill_h), Paragraph("Power BI, Tableau, Data Visualization", body_s)],
    [
        Paragraph("Analytics Techniques", skill_h),
        Paragraph(
            "Data Cleaning, Data Transformation, Exploratory Data Analysis (EDA), "
            "Trend & Pattern Analysis, Business Intelligence",
            body_s,
        ),
    ],
]
skills_table = Table(skills_rows, colWidths=[42 * mm, 138 * mm])
skills_table.setStyle(
    TableStyle(
        [
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (0, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 1.5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 1.5),
        ]
    )
)
story.append(skills_table)

# ------------------------------ projects ------------------------------------
story += section("PROJECTS")
projects = [
    (
        "Sales Data Analysis — Excel + SQL",
        "Cleaned and analyzed a multi-region sales dataset to identify top-performing products, regions, "
        "and customer segments. Built pivot tables and charts in Excel and used SQL joins, aggregations "
        "and filtering to analyze key sales metrics.",
    ),
    (
        "Customer Churn Analysis — Python, Pandas, Matplotlib, Seaborn",
        "Performed data cleaning and exploratory data analysis on customer data to identify churn "
        "patterns, customer behavior trends and factors influencing churn.",
    ),
    (
        "Economic Data Analysis — Excel + Tableau",
        "Analyzed macroeconomic indicators and market trends using Excel and designed interactive "
        "Tableau dashboards to communicate findings clearly.",
    ),
]
for title, desc in projects:
    story.append(Paragraph(title, job_title_s))
    story.append(Paragraph(desc, body_s))
    story.append(Spacer(1, 5))

# ----------------------------- experience -----------------------------------
story += section("EXPERIENCE")
story.append(
    Table(
        [
            [
                Paragraph("Aspiring Data Analyst — Independent Projects & Self-Learning", job_title_s),
                Paragraph("2025 – Present", job_meta_s),
            ]
        ],
        colWidths=[135 * mm, 45 * mm],
    )
)
story.append(Spacer(1, 3))
story += bullets(
    [
        "Working on hands-on data analysis projects covering end-to-end analytics workflows.",
        "Interpreting datasets and performing trend and pattern analysis.",
        "Creating dashboards and visualizations to communicate findings clearly.",
        "Practicing data cleaning and data transformation on real datasets.",
    ]
)

# ------------------------------ education -----------------------------------
story += section("EDUCATION")
story.append(
    Table(
        [
            [
                Paragraph("B.A. in Economics — KV Pendarkar College, Mumbai University", job_title_s),
                Paragraph("2023 – 2025", job_meta_s),
            ]
        ],
        colWidths=[135 * mm, 45 * mm],
    )
)
story.append(Paragraph("Mumbai, India", ParagraphStyle("loc", parent=body_s, textColor=MUTED, fontSize=9.2)))

# ---------------------------- certifications --------------------------------
story += section("CERTIFICATIONS")
certs = [
    "Data Analyst, Certificate of Achievement — OneRoadmap (Certified: September 2, 2026 · ID: CERT-80401CE8)",
    "Official Practice Question Set: AWS Certified AI Practitioner — AWS Training & Certification (Completed: August 8, 2026)",
    "Microsoft Azure Essentials Professional Certificate — Microsoft + LinkedIn Learning (Completed: September 4, 2026)",
    "Data Analytics Job Simulation — Deloitte / Forage (Completed: August 5, 2026)",
    "Business Analytics with Excel (Certificate dated August 9, 2026)",
    "Introduction to SQL (Certificate dated September 5, 2026)",
    "GenAI Powered Data Analytics Job Simulation (Completed: August 7, 2026) — EDA, risk profiling, predicting delinquency with AI, business reporting, data storytelling, AI-driven collections strategy",
    "TCS iON Career Edge — Young Professional — TCS iON — Communication, presentation, interview and problem-solving skills, business etiquette, accounting fundamentals, IT foundation skills and AI overview",
]
story += bullets(certs)

doc.build(story)
print(f"Resume written to {OUT}")
