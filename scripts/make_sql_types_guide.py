#!/usr/bin/env python3
"""Generate sql-data-types-guide.pdf — the complete SQL data types handbook.

Run:  python3 scripts/make_sql_types_guide.py      (requires reportlab + DejaVu fonts)
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "scripts"))

from reportlab.platypus import NextPageTemplate, PageBreak  # noqa: E402

from sqlguide.theme import Guide, NotesFill  # noqa: E402
from sqlguide.ch_front import front  # noqa: E402
from sqlguide.ch1_foundations import ch1  # noqa: E402
from sqlguide.ch2_numeric import ch2  # noqa: E402
from sqlguide.ch3_strings import ch3  # noqa: E402
from sqlguide.ch4_temporal import ch4  # noqa: E402
from sqlguide.ch5_boolean_binary import ch5  # noqa: E402
from sqlguide.ch6_structured import ch6  # noqa: E402
from sqlguide.ch7_mechanics import ch7  # noqa: E402
from sqlguide.ch8_mapping import ch8  # noqa: E402
from sqlguide.ch9_practice import ch9  # noqa: E402


def main(out):
    story = [NextPageTemplate("body"), PageBreak()]   # page 1 = cover
    story += front()
    labels = ["Part 1 · Foundations", "Part 2 · Numeric", "Part 3 · Character",
              "Part 4 · Date & time", "Part 5 · Boolean & binary", "Part 6 · Structured",
              "Part 7 · Casting & storage", "Part 8 · Engine mapping", "Part 9 · Practice"]
    for chapter, label in zip((ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9), labels):
        story += chapter()
        story.append(NotesFill(label))
        story.append(PageBreak())
    doc = Guide(out)
    doc.multiBuild(story)
    print("wrote", out, "pages:", doc.page)


if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "sql-data-types-guide.pdf")
    main(target)
