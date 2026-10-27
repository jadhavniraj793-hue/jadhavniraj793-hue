"""Part 9 — Cheat sheet, exercises, glossary."""
from .theme import *

P = "9"


def ch9():
    s = []
    s += part(P, "Cheat Sheet & Practice", "One-page reference, 15 exercises with answers, and a glossary")
    s.append(lead(
        "Everything in this guide, compressed. Print this part first: the cheat sheet answers 90% of everyday "
        "questions, the exercises tell you whether you actually understood Parts 1&ndash;8, and the glossary gives "
        "you the words to argue with a DBA."))

    s.append(h2("9.1", "The one-page cheat sheet"))
    s += tbl(
        ["If you need&hellip;", "Use this", "Never this"],
        [["Money, tax, totals", "DECIMAL(19,4) or DECIMAL(12,2) + CHAR(3) currency", "FLOAT, DOUBLE, MONEY"],
         ["A counter or ID", "BIGINT (INT only if the table stays under 2.1 B rows)", "TINYINT, SMALLINT"],
         ["A percentage", "DECIMAL(5,2) with a CHECK between 0 and 100", "FLOAT, or INT (0% forever)"],
         ["A rating 1&ndash;5", "TINYINT + CHECK", "VARCHAR('4 stars')"],
         ["Currency, country, state codes", "CHAR(2) / CHAR(3) with a lookup", "VARCHAR(50) free text"],
         ["A name, label, email", "VARCHAR(n) with a meaningful n (254 for email)", "CHAR(50), TEXT for everything"],
         ["Long prose", "TEXT/CLOB in a detail table", "TEXT in the fact table"],
         ["An event time", "TIMESTAMPTZ / DATETIMEOFFSET / TIMESTAMP (MySQL)", "DATETIME, or an unqualified TIMESTAMP"],
         ["A business date", "DATE, computed in the business zone", "DATETIME at midnight"],
         ["A duration", "INTERVAL, or BIGINT seconds with a unit in the name", "Two timestamps and mental arithmetic"],
         ["A true/false flag", "BOOLEAN (native or BIT/TINYINT(1)) NOT NULL", "Nullable flag, CHAR(1) 'Y'/'N'"],
         ["A status with fixed values", "ENUM, or VARCHAR + CHECK", "Free text, integer codes with no table"],
         ["A hash or token", "BINARY(32) / BYTEA / RAW(16)", "VARCHAR(255) with a case-insensitive collation"],
         ["Sparse attributes", "JSONB / JSON, indexed on the paths you query", "One giant NVARCHAR blob"],
         ["A list you join on", "Junction table", "Comma-separated string, array"],
         ["A globally unique key", "BIGINT identity + UUID public key", "Random UUID alone as a clustered key"],
         ["A file or image", "Object storage + pointer column", "BLOB in the hot table"]],
        widths=[0.30, 0.44, 0.26], caption="Table 9.1 &mdash; The right column versus the tempting column.")

    s.append(h3("Five declarations to memorise"))
    s += code("""-- Analytics fact table (PostgreSQL)
sale_id BIGINT PRIMARY KEY,
sold_at TIMESTAMPTZ NOT NULL,
business_date DATE NOT NULL,
amount DECIMAL(14,2) NOT NULL,
currency CHAR(3) NOT NULL,
customer_sk INTEGER NOT NULL,
quantity INTEGER NOT NULL CHECK (quantity > 0)

-- Slowly changing dimension
customer_id VARCHAR(20) NOT NULL UNIQUE,
valid_from TIMESTAMPTZ NOT NULL,
valid_to   TIMESTAMPTZ,                 -- NULL = current row
is_current BOOLEAN NOT NULL DEFAULT TRUE

-- Event log
event_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
payload JSONB NOT NULL DEFAULT '{}'::jsonb

-- Audit-safe money with minor units (portable, SQLite-friendly)
amount_minor BIGINT NOT NULL,            -- paise
currency     CHAR(3) NOT NULL            -- 'INR'

-- Case-insensitive email uniqueness
email VARCHAR(254) NOT NULL UNIQUE       -- with a _ci collation or a LOWER() index""",
              title="universal · copy, adapt, ship")

    s.append(h2("9.2", "Fifteen exercises"))
    s.append(body(
        "Each exercise has one clearly best answer, given in 9.3. Try to justify the choice before you read it &mdash; "
        "the reasoning is the skill, not the type name."))
    s += tbl(
        ["#", "Design task"],
        [["1", "A table of Indian PIN codes (6 digits, may start with 0) with the state name."],
         ["2", "A payment table for a business operating in INR, USD and EUR, reconciled to the cent."],
         ["3", "A user table where emails must be unique regardless of case, and no email may be missing."],
         ["4", "An orders table for a marketplace expected to reach 5 billion orders over its lifetime."],
         ["5", "A global event stream where the same event must never get the same ID on two continents."],
         ["6", "A store's opening hours: 09:00&ndash;21:00 Monday to Saturday, closed Sunday."],
         ["7", "A subscription with a billing anchor day; reports must show MRR by calendar month in IST."],
         ["8", "A product catalogue where 40 attributes differ by category and three of them are filtered on."],
         ["9", "A table of 20 million sensor readings: device, timestamp, numeric value, quality flag."],
         ["10", "An audit log of API requests, each with a variable JSON response body, retained 90 days."],
         ["11", "A conference room booking system that must prevent overlapping bookings."],
         ["12", "A customer dimension with history: address changes must not overwrite the past."],
         ["13", "A user table for a global app with users in Devanagari, Arabic and Chinese scripts."],
         ["14", "A report joining a fact table to a dimension, which runs 40&times; slower after a migration."],
         ["15", "A hash column for deduplicating uploaded files, compared case-sensitively and exactly."]],
        widths=[0.06, 0.94], caption="Table 9.2 &mdash; Design tasks, elementary to advanced.")

    s.append(h2("9.3", "Answers, with reasoning"))
    answers = [
        ("1", "PIN code must be text",
         "A PIN code is an identifier, not a number: leading zeros exist, arithmetic is meaningless, and sorting by "
         "value is meaningless. " + mono("pin_code CHAR(6) NOT NULL CHECK (pin_code ~ '^[0-9]{6}$')") +
         " plus a state lookup table or a VARCHAR(40)."),
        ("2", "DECIMAL money with a currency column",
         "amount DECIMAL(19,4), currency CHAR(3) CHECK (currency IN ('INR','USD','EUR')), plus an "
         "exchange_rate DECIMAL(18,8) and a reporting_amount DECIMAL(19,4). Never FLOAT; never two amounts in one "
         "column without the currency."),
        ("3", "Unique with a case-insensitive collation",
         "email VARCHAR(254) COLLATE utf8mb4_0900_ai_ci NOT NULL UNIQUE (MySQL), CITEXT or a LOWER() unique index "
         "(PostgreSQL), NVARCHAR(254) with a _CI collation (SQL Server). Doing the dedupe in application code "
         "fails as soon as a second writer exists."),
        ("4", "BIGINT identity, plus partitioning",
         "INT overflows at 2.1 billion; 5 billion rows is BIGINT territory. "
         "order_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, and range partition by order date so old "
         "partitions can be archived."),
        ("5", "Time-ordered global IDs",
         "UUIDv7 or ULID (16 bytes, time-ordered), or a Snowflake-style BIGINT (machine id + timestamp + sequence). "
         "UUIDv4 works but fragments the index; store it as BINARY(16)/UUID, not CHAR(36)."),
        ("6", "Wall-clock TIME, not an instant",
         "day_of_week TINYINT, opens_at TIME, closes_at TIME. Opening hours are wall-clock values in the store's "
         "zone; an instant would shift when DST rules change. Add a zone column if stores span zones."),
        ("7", "Instant for events, DATE for the accounting period",
         "created_at TIMESTAMPTZ, anchor_day SMALLINT, and a generated business_month DATE computed in IST. MRR by "
         "month must group on the IST-derived date, not on the UTC month &mdash; otherwise the last 5.5 hours of every "
         "month land in the wrong period."),
        ("8", "JSONB for the long tail, columns for the hot paths",
         "attributes JSONB for the 40, plus STORED generated columns and B-tree indexes for the three filtered "
         "attributes, plus a GIN index for containment queries. If a fourth attribute becomes hot, promote it too."),
        ("9", "Narrow types with a composite primary key",
         "device_id INT, reading_ts TIMESTAMPTZ (or BIGINT epoch if you need compactness), value DECIMAL(10,4) or "
         "DOUBLE if the sensor is inherently approximate, is_valid BOOLEAN. Only 4&ndash;8 bytes of flag; 20 M rows × "
         "indexes is where the cost lives. Partition by month."),
        ("10", "JSONB in a partitioned table",
         "request_id BIGINT, at TIMESTAMPTZ, status SMALLINT, body JSONB. Retain 90 days by dropping monthly "
         "partitions instead of DELETE &mdash; the type of the partition key is what makes that possible."),
        ("11", "Range type with an exclusion constraint",
         "PostgreSQL: during TSTZRANGE plus EXCLUDE USING GIST (room WITH =, during WITH &&). Not achievable "
         "declaratively elsewhere: elsewhere you need a unique index on a bucketed slot or row-level locking in "
         "the application."),
        ("12", "Type-2 slowly changing dimension",
         "Surrogate INTEGER key, natural customer_id with a UNIQUE index, valid_from/valid_to TIMESTAMPTZ, "
         "is_current BOOLEAN, plus a partial unique index on (customer_id) WHERE is_current to guarantee one "
         "current row."),
        ("13", "Unicode storage chosen once",
         "MySQL: utf8mb4 on the column, table and connection. SQL Server: NVARCHAR(n) (VARCHAR will lose the "
         "characters). PostgreSQL/Oracle: UTF-8 database / AL32UTF8. Size in characters but verify the byte budget "
         "&mdash; 3 bytes per Devanagari character, 4 for emoji."),
        ("14", "Find the type mismatch, not a faster query",
         "Compare the join columns' types on both sides and look for an implicit conversion (VARCHAR parameter "
         "against an INT key, or a different collation). Then check for a function on a filtered column. Add "
         "matching types, an expression index if needed, and only then consider partitioning."),
        ("15", "Fixed-width binary",
         "sha256 BINARY(32) / BYTEA / RAW(32) with a CHECK on length. Binary comparison is byte-exact and "
         "case-sensitive, unlike VARCHAR under a case-insensitive collation, and 32 bytes versus 64 characters "
         "halves the index."),
    ]
    for number, title, text in answers:
        s.append(Paragraph('<font color="#0E7490"><b>%s</b></font>  %s' % (number, escape(title)), S["h3"]))
        s.append(body(text))

    s.append(h2("9.4", "Glossary"))
    s += tbl(
        ["Term", "Meaning"],
        [["Affinity (SQLite)", "The storage class a declared type is converted to; there are only five."],
         ["Cardinality", "The number of distinct values in a column; drives index and histogram usefulness."],
         ["Cast", "An explicit conversion between types (CAST, ::, CONVERT)."],
         ["Collation", "Rules for comparing and sorting text: case, accent and language behaviour."],
         ["Covering index", "An index that contains every column a query needs, so the table is never read."],
         ["Domain (PostgreSQL)", "A named type with built-in CHECK constraints, reusable across columns."],
         ["Implicit conversion", "An automatic conversion the engine performs; the usual cause of disabled indexes."],
         ["Fixed-width", "A type that always occupies its declared size (INT, CHAR, DATE)."],
         ["Off-page storage", "Mechanism that moves large values to overflow pages (TOAST, row-overflow, BLOB pages)."],
         ["Precision (p)", "Total number of significant digits a decimal type can hold."],
         ["Scale (s)", "Number of digits to the right of the decimal point."],
         ["Sargable", "A predicate the optimiser can answer with an index seek instead of a scan."],
         ["Storage class", "SQLite's actual on-disk categories: NULL, INTEGER, REAL, TEXT, BLOB."],
         ["SRID", "Spatial reference identifier: the coordinate system of a geometry."],
         ["Three-valued logic", "TRUE, FALSE and UNKNOWN, the last arising from NULL comparisons."],
         ["TOAST", "PostgreSQL's mechanism for storing large values outside the main row."],
         ["Type affinity", "See affinity; the reason a DATE column in SQLite can hold text."],
         ["Unsigned", "A numeric modifier (MySQL) that removes negative values and doubles the positive range."],
         ["Variable-width", "A type that stores only the bytes needed plus a length prefix (VARCHAR, DECIMAL)."],
         ["Vector (embedding)", "A fixed-length float array used for semantic similarity search."],
         ["Widening conversion", "A conversion that cannot lose data (INT to BIGINT); the only safe direction."]],
        widths=[0.28, 0.72], caption="Table 9.3 &mdash; Twenty-one terms that come up in every schema review.")

    s.append(h2("9.5", "The last checklist"))
    s += tbl(
        ["Before you commit a schema", "Why"],
        [["Every column has the narrowest type that cannot overflow", "Storage and index cost are permanent"],
         ["Money, percentages and counts are exact types", "Floating point error is invisible until it is expensive"],
         ["Every temporal column is explicitly instant or wall clock", "The only decision that cannot be fixed later"],
         ["Every text column declares a charset and a collation", "Silent truncation and mojibake start here"],
         ["Booleans are NOT NULL with a default", "Three-valued logic spreads through every consumer"],
         ["Keys are BIGINT unless proven small; public IDs are separate", "Overflow and index fragmentation are years-long problems"],
         ["Blobs and huge text live outside the hot table", "Row width is read cost, even when you do not select it"],
         ["Structured types are indexed on the paths you query", "Otherwise every JSON query is a scan with parsing"],
         ["A mapping document exists for every migration", "The next engineer needs your reasoning, not just your DDL"],
         ["The schema is reviewed by someone who will run the queries", "The person reading rows sees what the designer cannot"]],
        widths=[0.56, 0.44], caption="Table 9.4 &mdash; Ten checks, thirty seconds each.")

    s.append(Rule(TEAL, 1.2, 10))
    s.append(Paragraph("Closing note", S["h2"]))
    s.append(body(
        "Data types are where intent becomes behaviour. A schema is a set of promises about what the data means, "
        "and the database will hold you to those promises long after the person who wrote them has moved teams. "
        "That is why this guide spends more time on <i>why</i> than on <i>which</i>: the type names change between "
        "engines and versions, but the decisions &mdash; exact or approximate, instant or wall clock, bounded or "
        "unbounded, one column or many &mdash; do not."))
    s.append(body(
        "If you take one habit from these pages, take this one: before writing a CREATE TABLE, say out loud what "
        "each column means and who will never be able to change it. The types follow almost by themselves."))
    s += cards([
        ("Keep practising", "Rebuild one of your existing tables with the types this guide recommends and diff the "
                            "row sizes and query plans. Real schemas teach faster than examples."),
        ("Read the docs by type", "Every engine documents each type with storage, range and index notes. Use those "
                                  "pages as the source of truth for version-specific details."),
        ("Write it down", "One page per table: what each column means, why the type was chosen, what cannot change. "
                          "That document outlives every migration."),
        ("Share it", "The fastest way to learn a type system is to review someone else's schema with it by your side."),
    ])
    s.append(Spacer(1, 8))
    s.append(Paragraph("About this guide", S["h3"]))
    s.append(body(
        "Prepared by <b>Niraj Laxman Jadhav</b>, data analyst &mdash; Excel, SQL, Power BI and Python &mdash; as a "
        "practical reference for analysts and engineers who design, review and migrate schemas. Version 1.0, "
        "October 2026. Typeset in DejaVu Sans and DejaVu Sans Mono; generated programmatically with ReportLab so "
        "every table, page number and contents entry stays consistent."))
    return s
