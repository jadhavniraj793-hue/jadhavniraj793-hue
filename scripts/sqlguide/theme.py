"""Layout engine, palette and reusable building blocks for the SQL types guide."""
import re
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, Flowable, Frame, KeepTogether,
                                NextPageTemplate, PageBreak, PageTemplate, Paragraph,
                                Spacer, Table, TableStyle)
from reportlab.platypus.tableofcontents import TableOfContents

# ── geometry ────────────────────────────────────────────────────────────────
PAGE = A4
MARGIN = 17 * mm
W = PAGE[0] - 2 * MARGIN          # usable width  ≈ 493 pt
TOP_Y = PAGE[1] - 17 * mm
BOT_Y = 17 * mm
W_FRAC = W / 174.0                # helper for mm-ish widths

FONTS = "/usr/share/fonts/truetype/dejavu"
pdfmetrics.registerFont(TTFont("DJ", f"{FONTS}/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("DJ-B", f"{FONTS}/DejaVuSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("DM", f"{FONTS}/DejaVuSansMono.ttf"))
pdfmetrics.registerFont(TTFont("DM-B", f"{FONTS}/DejaVuSansMono-Bold.ttf"))
pdfmetrics.registerFontFamily("DJ", normal="DJ", bold="DJ-B", italic="DJ", boldItalic="DJ-B")
pdfmetrics.registerFontFamily("DM", normal="DM", bold="DM-B", italic="DM", boldItalic="DM-B")

# ── palette ─────────────────────────────────────────────────────────────────
NAVY = colors.HexColor("#0D1430")
NAVY_2 = colors.HexColor("#17224C")
NAVY_SOFT = colors.HexColor("#28325C")
TEAL = colors.HexColor("#0891B2")
TEAL_D = colors.HexColor("#0E7490")
TEAL_BG = colors.HexColor("#EAF7FA")
TEAL_LINE = colors.HexColor("#BFE6EE")
INK = colors.HexColor("#23293E")
MUTED = colors.HexColor("#5F6982")
LINE = colors.HexColor("#D2D8E6")
SOFT = colors.HexColor("#F4F7FB")
WHITE = colors.white
AMBER = colors.HexColor("#B45309")
AMBER_BG = colors.HexColor("#FEF6E7")
RED = colors.HexColor("#B91C1C")
RED_BG = colors.HexColor("#FDEDED")
GREEN = colors.HexColor("#047857")
GREEN_BG = colors.HexColor("#ECFDF5")
PURPLE = colors.HexColor("#6D28D9")
PURPLE_BG = colors.HexColor("#F4F0FE")
CODE_BG = colors.HexColor("#F6F8FC")

# ── paragraph styles ────────────────────────────────────────────────────────
S = {}
S["body"] = ParagraphStyle("body", fontName="DJ", fontSize=9.2, leading=14.0,
                           textColor=INK, spaceAfter=4.6, alignment=TA_JUSTIFY)
S["lead"] = ParagraphStyle("lead", parent=S["body"], fontSize=10.0, leading=15.4,
                           textColor=colors.HexColor("#2C3350"), spaceAfter=7)
S["h2"] = ParagraphStyle("h2", fontName="DJ-B", fontSize=12.6, leading=15.5,
                         textColor=NAVY, spaceBefore=13, spaceAfter=5, keepWithNext=1)
S["h3"] = ParagraphStyle("h3", fontName="DJ-B", fontSize=9.8, leading=12.6,
                         textColor=TEAL_D, spaceBefore=9, spaceAfter=3, keepWithNext=1)
S["bullet"] = ParagraphStyle("bullet", parent=S["body"], leftIndent=11.5,
                             bulletIndent=1.5, spaceAfter=2.0, alignment=TA_LEFT)
S["table"] = ParagraphStyle("tc", fontName="DJ", fontSize=7.9, leading=10.2, textColor=INK)
S["tableb"] = ParagraphStyle("tcb", parent=S["table"], fontName="DJ-B")
S["th"] = ParagraphStyle("th", fontName="DJ-B", fontSize=7.9, leading=10.0, textColor=WHITE)
S["code"] = ParagraphStyle("code", fontName="DM", fontSize=7.35, leading=10.05,
                           textColor=INK)
S["codetitle"] = ParagraphStyle("ct", fontName="DM", fontSize=6.9, leading=8.5,
                                textColor=MUTED, spaceAfter=1.5)
S["caption"] = ParagraphStyle("cap", fontName="DJ", fontSize=7.4, leading=9.6,
                              textColor=MUTED, spaceBefore=2.5, spaceAfter=6)
S["callout"] = ParagraphStyle("co", parent=S["body"], fontSize=8.6, leading=12.4,
                              spaceAfter=0, alignment=TA_LEFT)
S["callout_t"] = ParagraphStyle("cot", fontName="DJ-B", fontSize=8.4, leading=10.6,
                                spaceAfter=2)
S["toch1"] = ParagraphStyle("toch1", fontName="DJ-B", fontSize=9.2, leading=17,
                            textColor=NAVY, leftIndent=0, firstLineIndent=0,
                            spaceBefore=6, spaceAfter=0)
S["toch2"] = ParagraphStyle("toch2", fontName="DJ", fontSize=8.5, leading=13.4,
                            textColor=INK, leftIndent=14, firstLineIndent=0,
                            spaceBefore=0, spaceAfter=0)

# ── inline markup helpers ───────────────────────────────────────────────────
_KW = """ADD ALL ALTER AND ANY AS ASC AUTO_INCREMENT BEFORE BEGIN BETWEEN BOTH BY
CASCADE CASE CAST CHECK COLLATE COLUMN COMMENT COMMIT CONSTRAINT CONVERT CREATE
CROSS CURRENT_DATE CURRENT_TIMESTAMP CURRENT_TIME DATABASE DEFAULT DELETE DESC
DISTINCT DIV DO DROP ELSE END ENGINE EXCEPT EXISTS EXPLAIN FALSE FETCH FOR FOREIGN
FROM FULL GENERATED GLOBAL GRANT GROUP HAVING IF IGNORE IN INDEX INNER INSERT
INTERSECT INTO IS JOIN KEY LEFT LIKE LIMIT LOCALTIME LOCALTIMESTAMP LOCK NOT NULL
OFFSET ON ONLY OR ORDER OUTER OVER PARTITION PRECISION PRIMARY PROCEDURE RANGE
REFERENCES RENAME REPLACE RESTRICT RETURNING RIGHT ROLLBACK ROW ROWS SELECT SET
SHOW STORED TABLE TABLESPACE TEMPORARY THEN TO TRANSACTION TRIGGER TRUE TRUNCATE
UNION UNIQUE UNSIGNED UPDATE USE USING VALUES VIEW VIRTUAL WHEN WHERE WHILE WITH
WITHOUT ZONE ZEROFILL ALWAYS IDENTITY SEQUENCE DOMAIN ENUM EXTENSION AT TIME
ADMIN AUTHORIZATION LANGUAGE CYCLE INCREMENT MINVALUE MAXVALUE OWNED
""".split()
_TYPES = """BIGINT BINARY BIT BLOB BOOL BOOLEAN BYTEA CHAR CHARACTER CLOB DATE DATETIME
DATETIME2 DATETIMEOFFSET DEC DECIMAL DOUBLE FLOAT INT INT2 INT4 INT8 INTEGER INTERVAL
JSON JSONB LONG LONGTEXT MEDIUMINT MEDIUMTEXT MONEY NCHAR NTEXT NUMBER NUMERIC
NVARCHAR NVARCHAR2 RAW REAL ROWVERSION SERIAL BIGSERIAL SMALLSERIAL SET SMALLDATETIME
SMALLINT SMALLMONEY TEXT TIME TIMESTAMP TIMESTAMPTZ TINYINT TINYTEXT UUID
UNIQUEIDENTIFIER VARBINARY VARCHAR VARCHAR2 XML YEAR GEOMETRY GEOGRAPHY INET CIDR
MACADDR TSVECTOR VECTOR ARRAY RANGE HSTORE IMAGE NTEXT NCLOB XMLTYPE IDENTITY
""".split()
SET_KW, SET_TY = set(_KW), set(_TYPES)
_TOK = re.compile(r"('(?:[^']|'')*'|--[^\n]*|/\*.*?\*/|\b\d+(?:\.\d+)?\b)"
                  r"|([A-Za-z_][A-Za-z0-9_$]*)|(\s+)|(.)", re.S)


def hl(line, keep_spaces=False):
    """Tiny SQL highlighter: keywords blue, types teal, strings amber, comments grey."""
    if "--" in line and line.lstrip().startswith("--"):
        return '<font color="#7A8699">%s</font>' % escape(line)
    out = []
    for m in _TOK.finditer(line):
        tok = m.group(0)
        if m.group(1):                                   # string / number / comment
            if tok.startswith("--") or tok.startswith("/*"):
                out.append('<font color="#7A8699">%s</font>' % escape(tok))
            elif tok.startswith("'"):
                out.append('<font color="#A2470B">%s</font>' % escape(tok))
            else:
                out.append('<font color="#7B2D8E">%s</font>' % escape(tok))
        elif m.group(2):
            t = escape(tok)
            if tok in SET_KW:
                out.append('<font color="#0B5FA5">%s</font>' % t)
            elif tok in SET_TY:
                out.append('<font color="#0E7490">%s</font>' % t)
            else:
                out.append(t)
        elif m.group(3) and keep_spaces:
            out.append("&nbsp;" * len(tok))
        else:
            out.append(escape(tok))
    return "".join(out)


def mono(t):
    return '<font face="DM" size="8.1">%s</font>' % escape(t)


def b(t):
    return "<b>%s</b>" % t


def teal(t):
    return '<font color="#0E7490"><b>%s</b></font>' % t


# ── flowables ───────────────────────────────────────────────────────────────
class PartBanner(Flowable):
    """Full-width navy section banner (also drives TOC + PDF outline)."""
    _n = 0

    def __init__(self, number, title, blurb=""):
        Flowable.__init__(self)
        PartBanner._n += 1
        self.key = "sec%d" % PartBanner._n
        self.number, self.title, self.blurb = number, title, blurb
        self.toc_text = "Part %s · %s" % (number, title)
        self.width, self.height = W, 0

    def wrap(self, aw, ah):
        self.width = aw
        self.height = 30 * mm if self.blurb else 24 * mm
        if ah < self.height + 90:
            return self.width, ah + 1
        return self.width, self.height

    def draw(self):
        c = self.canv
        h = self.height
        c.saveState()
        c.setFillColor(NAVY)
        c.roundRect(0, 0, self.width, h, 7, stroke=0, fill=1)
        # decorative faint rings (clipped to the banner)
        c.saveState()
        clip = c.beginPath()
        clip.roundRect(0, 0, self.width, h, 7)
        c.clipPath(clip, stroke=0, fill=0)
        c.setStrokeColor(colors.HexColor("#22305E"))
        c.setLineWidth(0.9)
        for r in (16, 27, 38, 49):
            c.circle(self.width - 4, h - 6, r, stroke=1, fill=0)
        c.restoreState()
        # teal edge
        c.setFillColor(TEAL)
        c.roundRect(0, 0, 4.2, h, 2, stroke=0, fill=1)
        c.setFillColor(TEAL)
        c.setFont("DJ-B", 7.6)
        c.drawString(16, h - 12.5, "PART %s" % self.number)
        size, avail = 19.5, self.width - 74
        while pdfmetrics.stringWidth(self.title, "DJ-B", size) > avail and size > 12.5:
            size -= 0.5
        c.setFillColor(WHITE)
        c.setFont("DJ-B", size)
        c.drawString(15.2, h - 28.5, self.title)
        if self.blurb:
            c.setFillColor(colors.HexColor("#A9B6D6"))
            c.setFont("DJ", 8.4)
            c.drawString(16, h - 41, self.blurb)
        c.restoreState()
        c.bookmarkPage(self.key)


class SubHead(Flowable):
    """Numbered H2: small teal tick + title, with a hairline rule."""
    _n = 0

    def __init__(self, number, title):
        Flowable.__init__(self)
        SubHead._n += 1
        self.key = "sub%d" % SubHead._n
        self.number, self.title = str(number), title
        self.toc_text = "%s  %s" % (self.number, title)

    def wrap(self, aw, ah):
        self.width = aw
        self.height = 20
        if ah < 78:                      # leave room for at least a paragraph below
            return self.width, ah + 1
        return self.width, self.height

    def draw(self):
        c = self.canv
        c.saveState()
        c.setFillColor(TEAL)
        c.rect(0, 5.5, 2.6, 10.5, stroke=0, fill=1)
        c.setFillColor(NAVY)
        c.setFont("DJ-B", 12.2)
        label = "%s   %s" % (self.number, self.title)
        c.drawString(8, 7.6, label)
        c.setStrokeColor(LINE)
        c.setLineWidth(0.6)
        c.setDash(1.6, 1.8)
        c.line(8 + c.stringWidth(label, "DJ-B", 12.2) + 8, 10.5, self.width, 10.5)
        c.restoreState()
        c.bookmarkPage(self.key)


class Rule(Flowable):
    def __init__(self, color=LINE, thickness=0.6, space=4, dash=None):
        Flowable.__init__(self)
        self.color, self.thickness, self.space, self.dash = color, thickness, space, dash

    def wrap(self, aw, ah):
        self.width = aw
        self.height = self.space
        return aw, self.space

    def draw(self):
        c = self.canv
        c.saveState()
        c.setStrokeColor(self.color)
        c.setLineWidth(self.thickness)
        if self.dash:
            c.setDash(*self.dash)
        c.line(0, self.space / 2, self.width, self.space / 2)
        c.restoreState()


# ── public building blocks ──────────────────────────────────────────────────
def part(number, title, blurb=""):
    return [Spacer(1, 6), PartBanner(number, title, blurb), Spacer(1, 4)]


def h2(number, title):
    return SubHead(number, title)


def h3(title):
    return Paragraph(escape(title), S["h3"])


def body(text, style="body"):
    return Paragraph(text, S[style])


def lead(text):
    return Paragraph(text, S["lead"])


def bl(items, style="bullet"):
    out = []
    for it in items:
        out.append(Paragraph(it, S[style], bulletText="•"))
    return out


S["num"] = ParagraphStyle("num", parent=S["bullet"], leftIndent=15, bulletIndent=1.5,
                          bulletFontName="DJ-B", bulletFontSize=8.4)


def num(items):
    out = []
    for i, it in enumerate(items, 1):
        out.append(Paragraph(it, S["num"], bulletText="%d." % i))
    return out


def tbl(headers, rows, widths=None, caption=None, size=7.9, first_bold=True,
        zebra=True, header=True, align="LEFT"):
    st_body = S["table"] if size == 7.9 else ParagraphStyle(
        "tb%03d" % int(size * 100), fontName="DJ", fontSize=size, leading=size * 1.29, textColor=INK)
    st_bold = S["tableb"] if size == 7.9 else ParagraphStyle(
        "tbb%03d" % int(size * 100), parent=st_body, fontName="DJ-B")
    st_head = S["th"] if size == 7.9 else ParagraphStyle(
        "thh%03d" % int(size * 100), fontName="DJ-B", fontSize=size, leading=size * 1.26, textColor=WHITE)

    def cell(v, style):
        if isinstance(v, Flowable):
            return v
        return Paragraph(str(v), style)

    data = []
    if header:
        data.append([cell(h, st_head) for h in headers])
    for r in rows:
        data.append([cell(v, st_bold if (first_bold and i == 0) else st_body)
                     for i, v in enumerate(r)])
    ncol = len(data[0])
    if widths is None:
        weights = []
        for c in range(ncol):
            longest = 6
            for row in rows:
                if isinstance(row, list) and c < len(row):
                    txt = re.sub(r"<[^>]+>", "", str(row[c]))
                    longest = max(longest, min(len(txt), 46))
            weights.append(longest)
        tot = float(sum(weights))
        widths = [W * w / tot for w in weights]
    else:
        widths = [w * W if w <= 1.0 else w for w in widths]
    t = Table(data, colWidths=widths, repeatRows=1 if header else 0, hAlign="LEFT")
    st = [
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 3.2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3.4),
        ("LEFTPADDING", (0, 0), (-1, -1), 4.6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4.6),
        ("LINEBELOW", (0, 0), (-1, -1), 0.35, colors.HexColor("#E4E8F1")),
        ("BOX", (0, 0), (-1, -1), 0.6, LINE),
    ]
    if header:
        st += [("BACKGROUND", (0, 0), (-1, 0), NAVY),
               ("TOPPADDING", (0, 0), (-1, 0), 4.4),
               ("BOTTOMPADDING", (0, 0), (-1, 0), 4.6)]
    if zebra:
        start = 1 if header else 0
        for i in range(start, len(data)):
            st.append(("BACKGROUND", (0, i), (-1, i),
                       colors.HexColor("#FBFCFE") if (i - start) % 2 else WHITE))
    t.setStyle(TableStyle(st))
    cap = Paragraph(caption, S["caption"]) if caption else Spacer(1, 6)
    _, h = t.wrap(W, 10000)
    if h + 24 <= 330:                     # short table: never leave a stub behind
        return [KeepTogether([t, cap])]
    return [t, cap]


def code(src, title=None, size=7.35):
    """Syntax-highlighted code block that can split across pages line by line."""
    lines = src.strip("\n").split("\n")
    style = S["code"] if size == 7.35 else ParagraphStyle(
        "c%d" % int(size * 10), parent=S["code"], fontSize=size, leading=size * 1.36)
    rows = [[Paragraph(hl(ln, len(ln) <= 100) if ln.strip() else "&nbsp;", style)]
            for ln in lines]
    t = Table(rows, colWidths=[W], splitByRow=1, repeatRows=0)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), CODE_BG),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#DCE3F0")),
        ("LINEBEFORE", (0, 0), (0, -1), 2.2, TEAL),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 0.6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1.6),
        ("TOPPADDING", (0, 0), (-1, 0), 5),
        ("BOTTOMPADDING", (0, -1), (-1, -1), 5.5),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    out = []
    if title:
        out.append(Paragraph(escape(title), S["codetitle"]))
    out.append(t)
    out.append(Spacer(1, 7))
    return out


_KINDS = {
    "note": ("NOTE", TEAL, TEAL_BG, "#BFE6EE"),
    "tip": ("TIP", GREEN, GREEN_BG, "#B9E7D4"),
    "warn": ("WARNING", AMBER, AMBER_BG, "#F3D9A6"),
    "best": ("BEST PRACTICE", GREEN, GREEN_BG, "#B9E7D4"),
    "deep": ("GO DEEPER", PURPLE, PURPLE_BG, "#D9CCFB"),
    "trap": ("COMMON TRAP", RED, RED_BG, "#F3C6C6"),
}


def callout(kind, title, text):
    label, accent, bg, edge = _KINDS[kind]
    head = Paragraph('<font color="%s">%s · %s</font>' % (accent.hexval().replace("0x", "#"),
                                                          label, escape(title)),
                     S["callout_t"])
    inner = [head, Paragraph(text, S["callout"])]
    t = Table([[inner]], colWidths=[W])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("BOX", (0, 0), (-1, -1), 0.5, edge),
        ("LINEBEFORE", (0, 0), (0, -1), 2.6, accent),
        ("LEFTPADDING", (0, 0), (-1, -1), 9),
        ("RIGHTPADDING", (0, 0), (-1, -1), 9),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    return [t, Spacer(1, 7)]


def cards(items, per_row=2):
    if len(items) % per_row and per_row > 1 and len(items) < per_row * 2:
        per_row = 1 if len(items) < 3 else per_row
    """items: list of (title, text) → small teal-headed info cards."""
    rows, row = [], []
    for title, text in items:
        cell = [Paragraph(escape(title), ParagraphStyle(
            "cardt", fontName="DJ-B", fontSize=8.6, leading=11, textColor=NAVY,
            spaceAfter=2)),
            Paragraph(text, ParagraphStyle("cardb", fontName="DJ", fontSize=7.9,
                                           leading=11, textColor=INK))]
        row.append(cell)
        if len(row) == per_row:
            rows.append(row)
            row = []
    if row:
        while len(row) < per_row:
            row.append("")
        rows.append(row)
    widths = [W / per_row] * per_row
    t = Table(rows, colWidths=widths, hAlign="LEFT")
    st = [("VALIGN", (0, 0), (-1, -1), "TOP"),
          ("LEFTPADDING", (0, 0), (-1, -1), 7), ("RIGHTPADDING", (0, 0), (-1, -1), 7),
          ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
          ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FBFCFE")),
          ("BOX", (0, 0), (-1, -1), 0.6, LINE),
          ("INNERGRID", (0, 0), (-1, -1), 0.6, LINE),
          ("LINEABOVE", (0, 0), (-1, 0), 2.2, TEAL)]
    t.setStyle(TableStyle(st))
    return [t, Spacer(1, 8)]


# ── document template ───────────────────────────────────────────────────────
class Guide(BaseDocTemplate):
    def __init__(self, path, **kw):
        BaseDocTemplate.__init__(self, path, pagesize=PAGE,
                                 leftMargin=MARGIN, rightMargin=MARGIN,
                                 topMargin=17 * mm, bottomMargin=17 * mm,
                                 title="SQL Data Types — The Complete Guide",
                                 author="Niraj Laxman Jadhav",
                                 subject="SQL data types from basic to advanced "
                                         "(MySQL, PostgreSQL, SQL Server, Oracle, SQLite)",
                                 keywords="SQL, data types, MySQL, PostgreSQL, SQL Server, "
                                          "Oracle, SQLite, database, analytics",
                                 creator="Arena.ai Agent Mode")
        cover = PageTemplate("cover", [Frame(0, 0, PAGE[0], PAGE[1], 0, 0, 0, 0)],
                             onPage=_cover)
        body = PageTemplate("body",
                           [Frame(MARGIN, BOT_Y, W, TOP_Y - BOT_Y, id="main")],
                           onPage=_decor)
        self.addPageTemplates([cover, body])

    def afterFlowable(self, f):
        if isinstance(f, PartBanner):
            self.canv.addOutlineEntry(f.toc_text, f.key, 0, False)
            self.notify("TOCEntry", (0, f.toc_text, self.page, f.key))
        elif isinstance(f, SubHead):
            self.canv.addOutlineEntry(f.toc_text, f.key, 1, True)
            self.notify("TOCEntry", (1, f.toc_text, self.page, f.key))


def _decor(c, doc):
    c.saveState()
    c.setStrokeColor(LINE)
    c.setLineWidth(0.6)
    c.line(MARGIN, TOP_Y + 8, PAGE[0] - MARGIN, TOP_Y + 8)
    c.setFont("DJ-B", 6.9)
    c.setFillColor(TEAL_D)
    c.drawString(MARGIN, TOP_Y + 11.5, "SQL DATA TYPES")
    c.setFont("DJ", 6.9)
    c.setFillColor(MUTED)
    c.drawString(MARGIN + 62, TOP_Y + 11.5, "·  THE COMPLETE REFERENCE")
    c.drawRightString(PAGE[0] - MARGIN, TOP_Y + 11.5, "MySQL · PostgreSQL · SQL Server · Oracle · SQLite")
    # footer
    c.setStrokeColor(LINE)
    c.line(MARGIN, BOT_Y - 9, PAGE[0] - MARGIN, BOT_Y - 9)
    c.setFont("DJ", 6.9)
    c.setFillColor(MUTED)
    c.drawString(MARGIN, BOT_Y - 17, "Niraj Laxman Jadhav  ·  Data Analyst")
    c.setFillColor(TEAL_D)
    c.setFont("DJ-B", 7.6)
    c.drawRightString(PAGE[0] - MARGIN, BOT_Y - 17, "%d" % doc.page)
    c.restoreState()


def _cover(c, doc):
    """Designed cover page, painted straight onto the canvas."""
    c.saveState()
    # vertical gradient
    strips = 160
    top, bot = (0x0B, 0x11, 0x2C), (0x16, 0x28, 0x55)
    for i in range(strips):
        f = i / float(strips - 1)
        col = colors.Color(*[(top[j] + (bot[j] - top[j]) * f) / 255.0 for j in range(3)])
        c.setFillColor(col)
        c.rect(0, PAGE[1] * i / strips, PAGE[0], PAGE[1] / strips + 1, stroke=0, fill=1)
    # faint type-name texture
    c.setFillColor(colors.Color(1, 1, 1, alpha=0.04))
    c.setFont("DM", 11)
    words = ["VARCHAR(255)", "DECIMAL(10,2)", "TIMESTAMPTZ", "BIGINT", "JSONB", "BOOLEAN",
             "NUMERIC", "UUID", "INTERVAL", "BLOB", "DATETIME2(3)", "SMALLINT", "TEXT",
             "NVARCHAR(MAX)", "ARRAY", "GEOMETRY", "BYTEA", "TINYINT", "DATE", "ENUM"]
    import math
    for i, wd in enumerate(words * 3):
        col = i % 4
        row = i // 4
        x = 12 + col * 95 + (18 if row % 2 else 0)
        y = 34 + row * 33
        c.saveState()
        c.translate(x, y)
        c.rotate(90)
        c.drawString(0, 0, wd)
        c.restoreState()
    # top rule + badge
    c.setFillColor(TEAL)
    c.rect(20 * mm, PAGE[1] - 30 * mm, 26 * mm, 3.2, stroke=0, fill=1)
    c.setFillColor(colors.HexColor("#8FE3F2"))
    c.setFont("DJ-B", 8.2)
    c.drawString(20 * mm, PAGE[1] - 39 * mm, "MASTER  REFERENCE  ·  2026  EDITION")
    # title
    c.setFillColor(WHITE)
    c.setFont("DJ-B", 46)
    c.drawString(19 * mm, PAGE[1] - 66 * mm, "SQL Data Types")
    c.setFillColor(colors.HexColor("#22D3EE"))
    c.setFont("DJ-B", 17)
    c.drawString(20 * mm, PAGE[1] - 78 * mm, "From basic to advanced — the complete guide")
    c.setStrokeColor(colors.HexColor("#2C3A66"))
    c.setLineWidth(1)
    c.line(20 * mm, PAGE[1] - 87 * mm, PAGE[0] - 20 * mm, PAGE[1] - 87 * mm)
    para = ("Every type family explained from first principles to production edge cases: "
            "storage, range, precision, implicit conversion, indexing cost and the exact "
            "syntax for the five engines analysts meet most.")
    c.setFillColor(colors.HexColor("#C3CCE4"))
    c.setFont("DJ", 9.6)
    from reportlab.platypus import Paragraph as _P
    pw = PAGE[0] - 44 * mm
    p = _P(para, ParagraphStyle("cv", fontName="DJ", fontSize=9.6, leading=14.6,
                                textColor=colors.HexColor("#C3CCE4")))
    p.wrap(pw, 200)
    p.drawOn(c, 20 * mm, PAGE[1] - 112 * mm)
    # engine chips
    y = PAGE[1] - 205 * mm
    x = 20 * mm
    c.setFont("DJ-B", 7.4)
    for name in ["MySQL 8", "PostgreSQL 16", "SQL Server", "Oracle", "SQLite"]:
        w = c.stringWidth(name, "DJ-B", 7.4) + 16
        c.setFillColor(colors.Color(1, 1, 1, alpha=0.06))
        c.setStrokeColor(colors.HexColor("#3A4878"))
        c.roundRect(x, y, w, 17, 6, stroke=1, fill=1)
        c.setFillColor(colors.HexColor("#DCE4F7"))
        c.drawCentredString(x + w / 2, y + 5.6, name)
        x += w + 7
    # bottom block
    c.setFillColor(colors.HexColor("#8FE3F2"))
    c.setFont("DJ-B", 7.6)
    c.drawString(20 * mm, 40 * mm, "PREPARED BY")
    c.setFillColor(WHITE)
    c.setFont("DJ-B", 13.5)
    c.drawString(20 * mm, 31 * mm, "Niraj Laxman Jadhav")
    c.setFillColor(colors.HexColor("#A9B6D6"))
    c.setFont("DJ", 8.8)
    c.drawString(20 * mm, 24.5 * mm, "Data Analyst  ·  Excel · SQL · Power BI · Python")
    c.drawRightString(PAGE[0] - 20 * mm, 31 * mm, "Version 1.0")
    c.setFont("DJ", 8.4)
    c.drawRightString(PAGE[0] - 20 * mm, 24.5 * mm, "October 2026")
    # teal corner accent
    c.setFillColor(TEAL)
    c.rect(PAGE[0] - 20 * mm, 50 * mm, 3, 22 * mm, stroke=0, fill=1)
    c.restoreState()


def build_toc():
    toc = TableOfContents()
    toc.levelStyles = [S["toch1"], S["toch2"]]
    toc.dotsMinLevel = 0
    toc.tableStyle = TableStyle([
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ])
    return toc


class NotesFill(Flowable):
    """Ruled 'Notes' panel that absorbs whatever space is left on the page."""

    def __init__(self, label=""):
        Flowable.__init__(self)
        self.label = label

    def wrap(self, aw, ah):
        self.width = aw
        self.height = ah if ah > 150 else 0
        return self.width, self.height

    def draw(self):
        if self.height <= 0:
            return
        c = self.canv
        h = self.height
        c.saveState()
        c.setStrokeColor(LINE)
        c.setLineWidth(0.6)
        y = h - 26
        c.setFillColor(MUTED)
        c.setFont("DJ-B", 7.2)
        c.drawString(0, h - 14, "NOTES" + ("  ·  " + self.label.upper() if self.label else ""))
        c.setFillColor(TEAL)
        c.rect(0, h - 19, 18, 2, stroke=0, fill=1)
        while y > 6:
            c.setStrokeColor(colors.HexColor("#E1E6F0"))
            c.setLineWidth(0.5)
            c.line(0, y, self.width, y)
            y -= 21
        c.restoreState()
