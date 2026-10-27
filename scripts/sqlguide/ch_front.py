"""Front matter: how to use the guide + table of contents."""
from .theme import *


def front():
    s = []
    s.append(Paragraph("How to use this guide", S["h2"]))
    s.append(lead(
        "This handbook is written for people who have to <b>choose</b> a data type and then live with "
        "that choice: analysts building tables, engineers reviewing schemas, and anyone who has ever "
        "wondered why a total came out as 0.30000000000000004. It runs from &ldquo;what is a type?&rdquo; "
        "to production edge cases, in the order you meet them."))

    s += cards([
        ("Read it in order",
         "Parts 1&ndash;5 build the mental model: foundations, numbers, text, dates, then boolean, binary "
         "and identifiers. If you are new to SQL, this is the path."),
        ("Read it as a reference",
         "Parts 6&ndash;8 are lookup material: structured and special types, casting and storage mechanics, "
         "then the cross-engine mapping tables. Jump straight to the engine you use."),
        ("Use it before a design review",
         "Part 9 is a checklist, a cheat sheet, 15 exercises with answers and a glossary. Print the "
         "cheat sheet and keep it beside your keyboard."),
        ("Follow the engine tags",
         "MySQL 8, PostgreSQL 16, SQL Server 2022, Oracle 23ai and SQLite 3 are all covered. Where they "
         "disagree, the disagreement is the lesson."),
    ])

    s.append(Paragraph("Conventions used in the examples", S["h3"]))
    s += bl([
        "Code blocks are real, runnable SQL. The small caption above each block names the engine when the "
        "syntax is engine-specific; otherwise the statement works on all five engines.",
        "Keywords are blue, type names teal, string literals amber, comments grey &mdash; so you can see at a "
        "glance which part of a declaration is the type.",
        "<b>NOTE</b> marks context you need once. <b>TIP</b> marks a shortcut. <b>WARNING</b> marks data loss. "
        "<b>COMMON TRAP</b> marks the mistake that shows up again and again in real schemas. "
        "<b>BEST PRACTICE</b> is the house rule to adopt. <b>GO DEEPER</b> is the advanced detail.",
        "Storage sizes are the <i>declared</i> sizes from each vendor's documentation. Real on-disk cost adds "
        "row headers, NULL bitmaps, alignment padding and index overhead &mdash; Part 7 shows how to estimate it.",
        "Ranges are inclusive at both ends unless stated. &plusmn; means a symmetric signed range. "
        "&ldquo;n&rdquo; always means the declared length or precision.",
    ])

    s.append(Paragraph("The five engines at a glance", S["h3"]))
    s += tbl(
        ["Engine", "Typing model", "Signature strength", "Signature surprise"],
        [["MySQL 8", "Static, per column", "DECIMAL, TINYINT UNSIGNED, ENUM, JSON",
          "No real BOOLEAN; INT(11) is a width, not a size"],
         ["PostgreSQL 16", "Static, strongly enforced", "UUID, JSONB, ARRAY, RANGE, custom types",
          "VARCHAR(n) has no performance benefit over TEXT"],
         ["SQL Server 2022", "Static, implicit-cast friendly", "DATETIME2, NVARCHAR, MONEY, hierarchyid",
          "Implicit conversion can silently kill an index"],
         ["Oracle 23ai", "Static, NUMBER-centric", "NUMBER(p,s), TIMESTAMP WITH TIME ZONE, VECTOR",
          "DATE includes a time but no fractional seconds"],
         ["SQLite 3", "Dynamic, five affinities", "Zero-config, one file, STRICT tables",
          "A column can hold any type; no DATE type at all"]],
        widths=[0.16, 0.24, 0.30, 0.30],
        caption="Table 0.1 &mdash; Knowing which model you are in explains most &ldquo;weird&rdquo; behaviour.")

    s += callout("tip", "One sentence to remember",
                 "A data type buys you correctness at the cost of constraints &mdash; the whole art is choosing "
                 "constraints that describe your data honestly.")

    s.append(PageBreak())

    # ── contents ────────────────────────────────────────────────────────────
    s.append(Paragraph("Contents", ParagraphStyle(
        "toctitle", fontName="DJ-B", fontSize=21, leading=25, textColor=NAVY, spaceAfter=2)))
    s.append(Paragraph("Nine parts &middot; foundations to production mechanics", ParagraphStyle(
        "tocsub", fontName="DJ", fontSize=9, leading=12, textColor=MUTED, spaceAfter=10)))
    s.append(Rule(TEAL, 1.6, 8))
    s.append(build_toc())
    s.append(PageBreak())
    return s
