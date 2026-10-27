"""Part 8 — Cross-engine type mapping."""
from .theme import *

P = "8"


def ch8():
    s = []
    s += part(P, "Types Across Engines", "The portability matrix: one concept, five spellings, zero surprises")
    s.append(lead(
        "This is the part you keep open during a migration. For every concept you need, it gives the type in "
        "each engine, the storage cost, and the note that prevents a broken migration. Read the three rules "
        "first &mdash; they resolve most questions without a table."))

    s.append(h2("8.1", "Three rules for mapping types"))
    s += cards([
        ("1 · Map the concept, not the name",
         "DECIMAL, NUMERIC, NUMBER and MONEY are not interchangeable: MONEY fixes four decimals and rounds "
         "differently. Ask what the value <i>means</i>, then pick the destination type that expresses it."),
        ("2 · Widen, never narrow",
         "If the source can hold 10 digits, the target must hold at least 10. VARCHAR(255) &rarr; VARCHAR(50) "
         "is a silent truncation waiting for a long value; INT &rarr; BIGINT is safe, the reverse is not."),
        ("3 · Text is not a universal adaptation layer",
         "Mapping every unknown type to TEXT 'for safety' pushes conversion errors into every downstream query. "
         "Store the closest native type, and quarantine the rows that do not convert."),
    ], per_row=1)
    s += callout("note", "What this part covers",
                 "MySQL 8.0/8.4, PostgreSQL 16/17, SQL Server 2022, Oracle 23ai and SQLite 3. Newer versions add "
                 "types (native JSON, VECTOR, native BOOLEAN in Oracle); the rows below are the stable core.")

    s.append(h2("8.2", "Numeric mapping"))
    s += tbl(
        ["Concept", "MySQL 8", "PostgreSQL 16", "SQL Server", "Oracle 23ai", "SQLite"],
        [["Boolean-ish 1-byte", "TINYINT UNSIGNED", "SMALLINT", "TINYINT", "NUMBER(3)", "INTEGER"],
         ["Small integer", "SMALLINT", "SMALLINT", "SMALLINT", "NUMBER(5)", "INTEGER"],
         ["Integer", "INT", "INTEGER", "INT", "NUMBER(10)", "INTEGER"],
         ["Large integer", "BIGINT", "BIGINT", "BIGINT", "NUMBER(19)", "INTEGER"],
         ["Exact decimal p,s", "DECIMAL(p,s)", "NUMERIC(p,s)", "DECIMAL(p,s)", "NUMBER(p,s)", "NUMERIC"],
         ["4-byte float", "FLOAT", "REAL", "REAL", "BINARY_FLOAT", "REAL"],
         ["8-byte float", "DOUBLE", "DOUBLE PRECISION", "FLOAT", "BINARY_DOUBLE", "REAL"],
         ["Currency", "DECIMAL(19,4)", "NUMERIC(19,4)", "DECIMAL(19,4) or MONEY", "NUMBER(19,4)", "INTEGER minor units"],
         ["Auto increment", "AUTO_INCREMENT", "GENERATED AS IDENTITY", "IDENTITY(1,1)", "GENERATED AS IDENTITY", "INTEGER PRIMARY KEY"]],
        widths=[0.20, 0.17, 0.20, 0.18, 0.15, 0.10], caption="Table 8.1 &mdash; Numeric concepts to concrete declarations.", size=7.3)
    s += bl([
        "Oracle has no integer types: NUMBER(p,0) is the idiom, and its storage is variable, so NUMBER(10) is "
        "often smaller on disk than an INT elsewhere.",
        "SQL Server has no UNSIGNED. A MySQL <font face='DM' size='7.8'>INT UNSIGNED</font> must become "
        "<font face='DM' size='7.8'>BIGINT</font> to preserve the full 0&ndash;4.29&nbsp;billion range.",
        "SQLite's NUMERIC affinity stores integers exactly and decimals as REAL &mdash; if exact money matters, store "
        "integer minor units.",
    ])

    s.append(h2("8.3", "Character and binary mapping"))
    s += tbl(
        ["Concept", "MySQL 8", "PostgreSQL 16", "SQL Server", "Oracle 23ai", "SQLite"],
        [["Fixed-length text", "CHAR(n)", "CHAR(n)", "CHAR(n)/NCHAR(n)", "CHAR(n)", "TEXT"],
         ["Variable text", "VARCHAR(n)", "VARCHAR(n)", "VARCHAR(n)", "VARCHAR2(n)", "TEXT"],
         ["Unicode text", "VARCHAR(n) utf8mb4", "VARCHAR(n) (UTF-8 db)", "NVARCHAR(n)", "NVARCHAR2(n)", "TEXT (UTF-8)"],
         ["Long text", "LONGTEXT", "TEXT", "NVARCHAR(MAX)", "CLOB / NCLOB", "TEXT"],
         ["Case-insensitive", "COLLATE ..._ai_ci", "citext", "COLLATE ..._CI", "NLS_SORT / LOWER index", "COLLATE NOCASE"],
         ["Fixed-length binary", "BINARY(n)", "BYTEA (no fixed)", "BINARY(n)", "RAW(n)", "BLOB"],
         ["Variable binary", "VARBINARY(n)", "BYTEA", "VARBINARY(n)", "RAW(n) / BLOB", "BLOB"],
         ["Large binary", "LONGBLOB", "BYTEA", "VARBINARY(MAX)", "BLOB", "BLOB"]],
        widths=[0.20, 0.17, 0.19, 0.18, 0.15, 0.11], caption="Table 8.2 &mdash; Text and binary concepts.", size=7.3)
    s += callout("warn", "The Unicode trap in every migration to SQL Server",
                 "A MySQL utf8mb4 VARCHAR(255) mapped to VARCHAR(255) drops non-Latin text. It must become "
                 "NVARCHAR(255) &mdash; and NVARCHAR counts characters in units of 2 bytes, so the 8,000-byte row "
                 "limit means NVARCHAR(4,000) at most. Size the destination for bytes, not for characters.")

    s.append(h2("8.4", "Temporal mapping"))
    s += tbl(
        ["Concept", "MySQL 8", "PostgreSQL 16", "SQL Server", "Oracle 23ai", "SQLite"],
        [["Calendar date", "DATE", "DATE", "DATE", "DATE (has time)", "TEXT or INTEGER"],
         ["Wall-clock date+time", "DATETIME(6)", "TIMESTAMP", "DATETIME2(7)", "TIMESTAMP", "TEXT"],
         ["Instant", "TIMESTAMP (2038 cap)", "TIMESTAMPTZ", "DATETIMEOFFSET", "TIMESTAMP WITH TIME ZONE", "TEXT (UTC)"],
         ["Time of day", "TIME", "TIME", "TIME", "INTERVAL DS / DATE", "TEXT"],
         ["Duration", "BIGINT seconds", "INTERVAL", "BIGINT seconds", "INTERVAL DAY TO SECOND", "INTEGER"],
         ["Year only", "YEAR / SMALLINT", "SMALLINT or DATE", "SMALLINT", "NUMBER(4)", "INTEGER"],
         ["Milliseconds", "DATETIME(3)", "TIMESTAMP (always µs)", "DATETIME2(3)", "TIMESTAMP(3)", "INTEGER epoch"]],
        widths=[0.20, 0.17, 0.19, 0.17, 0.16, 0.11], caption="Table 8.3 &mdash; Temporal concepts. Oracle's DATE includes a time, and has no sub-second part.", size=7.3)
    s += callout("trap", "Oracle DATE is not a date",
                 "Oracle DATE stores year, month, day, hour, minute and second in 7 bytes &mdash; no fractional "
                 "seconds and no time zone. Migrating a PostgreSQL DATE to Oracle DATE is safe; migrating a "
                 "TIMESTAMP(6) to Oracle DATE loses the microseconds, silently.")

    s.append(h2("8.5", "Identifiers and structured mapping"))
    s += tbl(
        ["Concept", "MySQL 8", "PostgreSQL 16", "SQL Server", "Oracle 23ai", "SQLite"],
        [["UUID", "BINARY(16) / CHAR(36)", "UUID", "UNIQUEIDENTIFIER", "RAW(16)", "TEXT / BLOB"],
         ["JSON document", "JSON", "JSONB", "NVARCHAR(MAX) + ISJSON", "JSON", "TEXT + json1"],
         ["XML", "No native (TEXT)", "XML", "XML", "XMLTYPE", "TEXT"],
         ["Array", "JSON array", "native array", "JSON + OPENJSON", "JSON array / nested table", "JSON"],
         ["Enum", "ENUM", "CREATE TYPE ... AS ENUM", "CHECK constraint", "CHECK or lookup table", "CHECK constraint"],
         ["Range", "No (2 columns)", "int4range, daterange, tstzrange", "No", "No", "No"],
         ["Spatial", "GEOMETRY + SRID", "GEOMETRY/GEOGRAPHY + GiST", "GEOMETRY/GEOGRAPHY", "SDO_GEOMETRY", "SpatiaLite"],
         ["Vector", "VECTOR (9+)", "pgvector VECTOR(n)", "VECTOR (2025)", "VECTOR(n)", "sqlite-vec"],
         ["Special/other", "SET, BIT", "INET, MACADDR, TSVECTOR, HSTORE, domain", "ROWVERSION, SQL_VARIANT", "Object types", "dynamic typing"]],
        widths=[0.19, 0.16, 0.20, 0.18, 0.16, 0.11], caption="Table 8.4 &mdash; Everything else, and the cheapest safe substitute.", size=7.2)

    s.append(h2("8.6", "SQLite: five affinities, no data types"))
    s.append(body(
        "SQLite has <b>storage classes</b> (NULL, INTEGER, REAL, TEXT, BLOB) and gives each declared type an "
        "<b>affinity</b> that guides conversion. A column declared DATE can hold the text 'hello'. That makes "
        "SQLite a poor authority on your schema &mdash; and a good reminder that in every engine the declared type "
        "is a promise the database may or may not keep."))
    s += tbl(
        ["Declared type contains", "Affinity", "How values are stored", "Example"],
        [["INT", "INTEGER", "Integer if convertible, else as given", "INT, BIGINT, TINYINT"],
         ["CHAR, CLOB, TEXT", "TEXT", "Text", "VARCHAR(20), NVARCHAR, TEXT"],
         ["BLOB or empty", "BLOB", "No conversion at all", "BLOB, or a column with no type"],
         ["REAL, FLOA, DOUB", "REAL", "Floating point", "REAL, DOUBLE, FLOAT"],
         ["Anything else (DECIMAL, DATE, BOOLEAN)", "NUMERIC", "Integer or real when lossless, else text", "DECIMAL(10,2), BOOLEAN, DATE"]],
        widths=[0.36, 0.16, 0.32, 0.16], caption="Table 8.5 &mdash; The five SQLite affinities that swallow every other type name.")
    s += code("""CREATE TABLE t (d DATE);           -- NUMERIC affinity, so '2026-10-27' stays TEXT
INSERT INTO t VALUES ('2026-10-27');    -- stored as text
INSERT INTO t VALUES (20261027);         -- stored as integer
SELECT typeof(d) FROM t;                 -- 'text' then 'integer' — both legal

-- STRICT tables (SQLite 3.37+) restore a real type system
CREATE TABLE t2 (id INTEGER PRIMARY KEY, d TEXT NOT NULL) STRICT;

-- Conventions for a portable SQLite schema
--   dates  : TEXT 'YYYY-MM-DD'
--   instants: TEXT ISO-8601 UTC with 'Z'
--   booleans: INTEGER 0/1 + CHECK
--   money   : INTEGER minor units""",
              title="sqlite · affinity in action, and how to defend against it")

    s.append(h2("8.7", "Migration pitfalls by direction"))
    s += tbl(
        ["Migration", "Pitfall", "Do this"],
        [["MySQL &rarr; PostgreSQL", "TINYINT(1) booleans become 0/1 integers; DATETIME has no zone",
          "Map to BOOLEAN and TIMESTAMPTZ explicitly; test every boolean predicate"],
         ["MySQL &rarr; SQL Server", "utf8mb4 text truncated by VARCHAR; UNSIGNED range overflow",
          "NVARCHAR(n) sized in bytes; BIGINT for unsigned INT"],
         ["Oracle &rarr; PostgreSQL", "NUMBER(38) with no scale becomes NUMERIC; DATE carries a time; empty string is NULL in Oracle",
          "Choose precision per column; split DATE into DATE + TIME; audit '' &rarr; NULL"],
         ["SQL Server &rarr; PostgreSQL", "NVARCHAR &rarr; VARCHAR (fine, UTF-8); DATETIMEOFFSET &rarr; TIMESTAMPTZ; MONEY &rarr; NUMERIC",
          "Verify offsets; MONEY needs a DECIMAL(19,4) decision, not a cast"],
         ["PostgreSQL &rarr; MySQL", "Arrays, JSONB operator set, ranges, domains have no direct equivalent",
          "Flatten arrays to junction tables; rewrite @> and ? operators as JSON_CONTAINS/JSON_EXTRACT"],
         ["Any &rarr; SQLite", "Everything becomes affinity; NUMERIC may store decimals as REAL",
          "Use STRICT tables and integer minor units for money"],
         ["Any &rarr; BigQuery/Snowflake", "No unsigned, no ENUM, NUMERIC precision caps (38), TIMESTAMP is UTC-only",
          "Check precision caps first; characterise each numeric column"]],
        widths=[0.20, 0.44, 0.36], caption="Table 8.6 &mdash; Seven migrations and the trap that waits in each.")

    s.append(h2("8.8", "The pre-migration checklist"))
    s += num([
        "Inventory every column with its type, precision, scale, length, nullability and default in the source.",
        "Classify each into a family, then apply the tables above &mdash; never map name to name.",
        "Compute the maximum length, precision and range actually present in the data: "
        "SELECT MAX(LENGTH(col)), MAX(col), MIN(col) per column.",
        "Identify the time columns and decide instant versus wall clock for each one, explicitly.",
        "Check charset coverage: scan for characters outside the target encoding before the migration, not after.",
        "Mock-load 1% of the data and compare row counts, sums and min/max per column between source and target.",
        "Verify booleans, zero dates, empty strings vs NULL, and 2038-dated values one by one.",
        "Keep a mapping document in the repository &mdash; the next migration starts from it.",
    ])
    s += callout("best", "Automate the type check",
                 "Write a script that reads information_schema on both sides and diffs the type families, "
                 "precision and nullability. A 60-line query catches the truncation, the unsigned overflow and the "
                 "time-zone loss before a single row reaches production.")
    return s
