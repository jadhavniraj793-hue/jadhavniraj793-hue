#!/usr/bin/env python3
"""Generate resume.pdf — Niraj Laxman Jadhav, Data Analyst.
Clean single-page layout that echoes the portfolio's navy/teal theme.
Run:  python3 scripts/make_resume.py   (requires fpdf2 + DejaVu fonts)
"""
import os

from fpdf import FPDF

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = "/usr/share/fonts/truetype/dejavu"

NAVY = (13, 20, 48)        # headings
INK = (35, 41, 62)         # body text
MUTED = (95, 105, 130)     # secondary text
TEAL = (8, 145, 178)       # accent
LINE = (210, 216, 230)     # rules


class Resume(FPDF):
    def __init__(self):
        super().__init__(orientation="P", unit="mm", format="A4")
        self.add_font("dv", "", os.path.join(FONTS, "DejaVuSans.ttf"))
        self.add_font("dv", "B", os.path.join(FONTS, "DejaVuSans-Bold.ttf"))
        self.add_font("dv", "I", os.path.join(FONTS, "DejaVuSans.ttf"))
        self.set_margins(14, 12, 14)
        self.set_auto_page_break(False)
        self.add_page()

    # ── helpers ──────────────────────────────────────────────
    def section(self, title):
        if self.get_y() > 12:
            self.ln(3.2)
        y = self.get_y()
        self.set_font("dv", "B", 10.5)
        self.set_text_color(*NAVY)
        self.cell(0, 5.4, title.upper(), new_x="LMARGIN", new_y="NEXT")
        # accent underline
        self.set_draw_color(*TEAL)
        self.set_line_width(0.5)
        self.line(self.l_margin, self.get_y() + 0.2, self.l_margin + 14, self.get_y() + 0.2)
        self.set_draw_color(*LINE)
        self.set_line_width(0.25)
        self.line(self.l_margin + 15, self.get_y() + 0.2, self.w - self.r_margin, self.get_y() + 0.2)
        self.set_y(self.get_y() + 2.4)

    def bullet(self, text, x=None, width=None, size=8.8):
        x = self.l_margin if x is None else x
        width = (self.w - self.l_margin - self.r_margin) if width is None else width
        self.set_x(x)
        self.set_font("dv", "", size)
        self.set_text_color(*TEAL)
        self.cell(3.4, 4.3, "•")
        self.set_text_color(*INK)
        self.multi_cell(width - 3.4, 4.3, text, new_x="LMARGIN", new_y="NEXT")

    def role_head(self, title, right="", size=9.8):
        self.set_x(self.l_margin)
        self.set_font("dv", "B", size)
        self.set_text_color(*NAVY)
        if right:
            w = self.get_string_width(title)
            self.cell(w, 4.8, title)
            self.set_font("dv", "", 8.2)
            self.set_text_color(*MUTED)
            self.cell(0, 4.8, "   " + right, new_x="LMARGIN", new_y="NEXT", align="L")
        else:
            self.cell(0, 4.8, title, new_x="LMARGIN", new_y="NEXT")

    def sub_head(self, text):
        self.set_x(self.l_margin)
        self.set_font("dv", "", 8.6)
        self.set_text_color(*TEAL)
        self.cell(0, 4.4, text, new_x="LMARGIN", new_y="NEXT")


r = Resume()

# ── header ────────────────────────────────────────────────
r.set_font("dv", "B", 21)
r.set_text_color(*NAVY)
r.cell(0, 9.5, "NIRAJ LAXMAN JADHAV", new_x="LMARGIN", new_y="NEXT", align="C")

r.set_font("dv", "B", 10.5)
r.set_text_color(*TEAL)
r.cell(0, 5.6, "D A T A   A N A L Y S T", new_x="LMARGIN", new_y="NEXT", align="C")

r.set_font("dv", "", 8.2)
r.set_text_color(*MUTED)
r.cell(0, 4.4, "Kopar, Mumbai  |  +91 72087 01481  |  jadhavniraj793@gmail.com", new_x="LMARGIN", new_y="NEXT", align="C")
r.cell(0, 4.4, "linkedin.com/in/niraj-jadhav-b313ba39a  |  github.com/jadhavniraj793-hue", new_x="LMARGIN", new_y="NEXT", align="C")

r.set_draw_color(*TEAL)
r.set_line_width(0.4)
r.line(r.l_margin, r.get_y() + 1.2, r.w - r.r_margin, r.get_y() + 1.2)
r.set_y(r.get_y() + 3.4)

# ── career summary ────────────────────────────────────────
r.section("Career Summary")
r.set_font("dv", "", 8.9)
r.set_text_color(*INK)
r.multi_cell(0, 4.4,
    "Detail-oriented and analytically minded Data Analyst with hands-on project experience in Excel, SQL, Python, "
    "Power BI, and Tableau. Skilled at cleaning, analyzing, and visualizing data to uncover trends and support "
    "data-driven decision-making. Certified across the core BI and analytics toolchain, with a strong foundation "
    "in statistics from a B.A. in Economics. Eager to apply analytical rigor and problem-solving skills to "
    "deliver measurable business insights.", new_x="LMARGIN", new_y="NEXT")

# ── core skills ───────────────────────────────────────────
r.section("Core Skills")
skills = [
    ("Data Analysis & Tools", "Excel (Pivot Tables, VLOOKUP, Charts), SQL (Joins, Aggregations, Subqueries), Python (Pandas, NumPy, Matplotlib, Seaborn)"),
    ("Business Intelligence", "Power BI, Tableau — interactive dashboards, data storytelling"),
    ("Techniques", "Data Cleaning, Data Transformation, Exploratory Data Analysis (EDA), Trend & Pattern Analysis"),
    ("Core Competencies", "Analytical Thinking, Problem Solving, Attention to Detail, Data Visualization, Quick Learning, Communication"),
]
for label, body in skills:
    r.set_x(r.l_margin)
    r.set_font("dv", "B", 8.8)
    r.set_text_color(*NAVY)
    r.cell(r.get_string_width(label + ":") + 1.2, 4.4, label + ":")
    r.set_font("dv", "", 8.8)
    r.set_text_color(*INK)
    r.multi_cell(0, 4.4, body, new_x="LMARGIN", new_y="NEXT")

# ── projects ──────────────────────────────────────────────
r.section("Projects")
projects = [
    ("Sales Data Analysis", "Excel & SQL  |  2024", [
        "Cleaned and analyzed a multi-region sales dataset to identify top-performing products, regions, and customer segments.",
        "Built pivot tables and charts in Excel to surface actionable insights for business stakeholders.",
        "Wrote SQL queries (joins, aggregations, filtering) to extract and analyze key sales metrics from relational tables.",
    ]),
    ("Customer Churn Analysis", "Python  |  2024", [
        "Performed data cleaning and exploratory data analysis (EDA) on a customer dataset to uncover churn drivers.",
        "Used Pandas, Matplotlib, and Seaborn to visualize churn patterns and customer behavior trends.",
        "Identified key factors influencing customer churn and proposed data-backed retention strategies.",
    ]),
    ("Economic Data Analysis", "Excel & Tableau  |  2023", [
        "Analyzed macroeconomic indicators and market trends to identify growth patterns using Excel.",
        "Designed interactive Tableau dashboards to present findings clearly to non-technical audiences.",
        "Delivered insights on economic growth factors to support academic and analytical conclusions.",
    ]),
]
for title, sub, bullets in projects:
    r.role_head(title, right=sub)
    for b in bullets:
        r.bullet(b)

# ── experience ────────────────────────────────────────────
r.section("Experience")
r.role_head("Aspiring Data Analyst", right="Independent Projects & Self-Learning  |  2025 – Present")
for b in [
    "Built hands-on proficiency in data analysis through self-directed projects and structured online coursework.",
    "Interpreted datasets to identify trends and patterns that support data-driven decision-making.",
    "Built dashboards and reports using Excel, SQL, Power BI, and Tableau for end-to-end analysis workflows.",
    "Practiced the full analytics pipeline: data cleaning, transformation, analysis, and visualization.",
]:
    r.bullet(b)

# ── education ─────────────────────────────────────────────
r.section("Education")
r.role_head("B.A. in Economics", right="2023 – 2025")
r.set_font("dv", "", 8.8)
r.set_text_color(*MUTED)
r.cell(0, 4.4, "K.V. Pendarkar College, Mumbai University", new_x="LMARGIN", new_y="NEXT")

# ── certifications (two columns) ──────────────────────────
r.section("Certifications")
certs = [
    "Microsoft Excel for Data Analysis — Coursera",
    "SQL for Data Analysis — Udemy",
    "Python for Data Analysis — Udemy",
    "Power BI for Business Intelligence — Microsoft Learn",
    "Data Visualization with Tableau — Coursera",
]
col_w = (r.w - r.l_margin - r.r_margin) / 2
rows = (len(certs) + 1) // 2
for i in range(rows):
    y = r.get_y()
    for j, idx in enumerate((i, i + rows)):
        if idx >= len(certs):
            continue
        r.set_xy(r.l_margin + j * col_w, y)
        r.set_font("dv", "", 8.8)
        r.set_text_color(*TEAL)
        r.cell(3.4, 4.3, "•")
        r.set_text_color(*INK)
        r.multi_cell(col_w - 3.4, 4.3, certs[idx])
    r.set_y(y + 4.3)

# ── interests ─────────────────────────────────────────────
r.section("Interests")
r.set_x(r.l_margin)
r.set_font("dv", "", 8.8)
r.set_text_color(*INK)
r.cell(0, 4.4, "Data Analysis & Visualization   •   Technology & Innovation   •   Continuous Learning in Analytics",
       new_x="LMARGIN", new_y="NEXT")

out = os.path.join(ROOT, "resume.pdf")
r.output(out)
size = os.path.getsize(out)
print(f"resume.pdf written ({size/1024:.1f} KB, {r.page_no()} page{'s' if r.page_no() > 1 else ''})")
if r.page_no() > 1:
    raise SystemExit("ERROR: resume spilled to a second page — tighten spacing")
