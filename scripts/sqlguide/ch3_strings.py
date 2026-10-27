"""Part 3 — Character and string types."""
from .theme import *

P = "3"


def ch3():
    s = []
    s += part(P, "Character & String Types", "Fixed, variable, unlimited — plus charsets, collations and search")
    s.append(lead(
        "Text looks like the simplest type and is the source of the most surprising behaviour: limits counted "
        "in bytes instead of characters, trailing spaces that break equality, case-insensitive collations, "
        "emoji that need four bytes, and indexes that silently do not apply. This part makes all of it "
        "predictable."))

    s.append(h2("3.1", "The three text shapes"))
    s += tbl(
        ["Shape", "Declaration", "Storage", "Semantics", "Use for"],
        [["Fixed", "CHAR(n) / NCHAR(n)", "Exactly n characters, space-padded",
          "Pad-and-compare: 'A' = 'A&nbsp;&nbsp;&nbsp;'",
          "True fixed-width codes: ISO country CHAR(2), currency CHAR(3)"],
         ["Variable, bounded", "VARCHAR(n) / NVARCHAR(n)", "Length prefix + actual characters",
          "Trailing spaces kept as written (MySQL trims on write for CHAR only)",
          "Codes, names, emails, labels &mdash; anything with a known ceiling"],
         ["Variable, large", "TEXT / LONGTEXT / VARCHAR(MAX) / CLOB", "Pointer in row, payload off-page",
          "Same comparison rules, different I/O cost",
          "Descriptions, comments, JSON snapshots, log payloads"]],
        widths=[0.13, 0.22, 0.22, 0.22, 0.21], caption="Table 3.1 &mdash; Three shapes cover every text column you will design.")

    s.append(h2("3.2", "CHAR versus VARCHAR: the padding problem"))
    s.append(body(
        "CHAR(n) pads shorter values with spaces. Standard SQL says the padding is not significant for "
        "comparison, which means 'AB' = 'AB&nbsp;&nbsp;' is TRUE. Engines implement this differently, and the "
        "difference bites when you move data or compare across joins."))
    s += code("""-- MySQL: CHAR pads and strips trailing spaces on retrieval
CREATE TABLE t (code CHAR(4));
INSERT INTO t VALUES ('AB');
SELECT CONCAT('[', code, ']') FROM t;   -- [AB]      (padding stripped on read)
SELECT LENGTH(code) FROM t;              -- 2

-- PostgreSQL: CHAR pads and keeps padding; comparisons ignore it
SELECT 'AB'::char(4) = 'AB';             -- true
SELECT length('AB'::char(4));            -- 2  (bpchar strips trailing spaces in length)
SELECT octet_length('AB'::char(4));      -- 4

-- SQL Server: CHAR pads, and trailing spaces are ignored in comparisons
-- Oracle: CHAR pads to the declared length on storage and on read
SELECT DUMP(code) FROM t;                -- shows 'AB  ' with two spaces""",
              title="universal · same declaration, three behaviours")
    s += callout("best", "Use VARCHAR(n) unless the value is genuinely fixed-width",
                 "CHAR(2) for ISO country codes is correct and self-documenting. CHAR(50) for a name is a bug: it "
                 "wastes space, makes every row the same width, and produces trailing-space comparisons that "
                 "break equality in application code.")

    s.append(h2("3.3", "Bytes, characters and the utf8mb4 rule"))
    s.append(body(
        "VARCHAR(n) counts <i>characters</i> in standard SQL, but MySQL's limit is expressed in bytes, so a "
        "VARCHAR(255) in utf8mb4 can occupy up to 1,020 bytes. This is why some ALTERs and index creations fail "
        "with &ldquo;specified key was too long&rdquo;."))
    s += tbl(
        ["Charset", "Bytes per character", "Can store", "Cannot store"],
        [["latin1", "1", "Western European text", "Devanagari, CJK, emoji, curly quotes"],
         ["utf8mb3 (MySQL &ldquo;utf8&rdquo;)", "1&ndash;3", "Most BMP characters", "Emoji, supplementary planes"],
         ["utf8mb4", "1&ndash;4", "Everything, including emoji and Indic scripts", "&mdash;"],
         ["UTF-16 (NVARCHAR in SQL Server)", "2&ndash;4", "Full Unicode", "&mdash;"],
         ["AL32UTF8 (Oracle)", "1&ndash;4", "Full Unicode", "&mdash;"]],
        widths=[0.28, 0.18, 0.32, 0.22], caption="Table 3.2 &mdash; Choose utf8mb4 and never think about it again.")
    s += bl([
        "<b>MySQL:</b> set the database, table and connection to utf8mb4. The old &ldquo;utf8&rdquo; alias is "
        "utf8mb3 and cannot store emoji &mdash; the classic &ldquo;Incorrect string value&rdquo; error.",
        "<b>SQL Server:</b> VARCHAR is single-byte (code page dependent) and NVARCHAR is Unicode. Any multilingual "
        "or emoji-bearing column must be NVARCHAR &mdash; there is no way to add Unicode later without a rewrite.",
        "<b>Oracle:</b> VARCHAR2 length semantics are BYTE by default; use VARCHAR2(50 CHAR) or set "
        "NLS_LENGTH_SEMANTICS=CHAR.",
        "<b>SQLite &amp; PostgreSQL:</b> UTF-8 always. PostgreSQL databases are created with an encoding that "
        "cannot be changed without a dump and reload, so create with UTF8 from the start.",
    ])
    s += code("""-- MySQL: mixing charsets is the classic mojibake source
SHOW VARIABLES LIKE 'character_set%';
CREATE TABLE messages (
    body VARCHAR(280) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci
) DEFAULT CHARSET = utf8mb4;

-- SQL Server: the N prefix is required for Unicode literals
SELECT * FROM messages WHERE body = N'नमस्ते';
-- ⚠ without the N prefix, the literal is converted to the database code page

-- Oracle: count characters, not bytes
CREATE TABLE t (name VARCHAR2(50 CHAR));""",
              title="engine-specific · charset declarations that prevent mojibake")
    s += callout("warn", "Changing a charset is a table rebuild",
                 "Converting latin1 to utf8mb4 rewrites every row and rebuilds every index. Do it while you can, "
                 "on a new schema where possible. On a large production table it is a maintenance-window job, "
                 "which is exactly why the choice must be right on day one.")

    s.append(h2("3.4", "Collation: how text sorts and compares"))
    s.append(body(
        "Collation decides case sensitivity, accent sensitivity and sort order. It is part of the column's "
        "behaviour, not just its storage, so two columns of the same type can compare differently."))
    s += tbl(
        ["Collation (MySQL)", "Case", "Accents", "Typical behaviour"],
        [["utf8mb4_0900_ai_ci", "Insensitive", "Insensitive", "Default in MySQL 8; 'Mumbai' = 'mumbai'"],
         ["utf8mb4_0900_as_cs", "Sensitive", "Sensitive", "Exact byte-ish comparison"],
         ["utf8mb4_bin", "Sensitive", "Sensitive", "Binary comparison, fastest but locale-blind"],
         ["utf8mb4_0900_ai_ci + unicode_ci", "Insensitive", "Insensitive", "Language-aware sorting"]],
        widths=[0.32, 0.13, 0.13, 0.42], caption="Table 3.3 &mdash; MySQL 8 collations you will meet. PostgreSQL and "
        "SQL Server use similar naming schemes with different defaults.")
    s += code("""-- Case sensitivity is a collation decision, not a coding style
CREATE TABLE users (email VARCHAR(254) COLLATE utf8mb4_0900_ai_ci UNIQUE);  -- dedupes Foo@x and foo@x
CREATE TABLE codes (code VARCHAR(10) COLLATE utf8mb4_bin UNIQUE);          -- keeps case distinct

-- Cross-engine equivalents
-- PostgreSQL: CREATE COLLATION or citext extension
CREATE EXTENSION IF NOT EXISTS citext;
CREATE TABLE users (email CITEXT UNIQUE);            -- case-insensitive comparisons

-- SQL Server: choose at database/column level
email NVARCHAR(254) COLLATE Latin1_General_CI_AS    -- CI = case-insensitive, AS = accent-sensitive

-- Oracle: NLS_COMP / NLS_SORT, or a function-based unique index
CREATE UNIQUE INDEX ux_email ON users (LOWER(email));""",
              title="universal · case-insensitive uniqueness, five ways")
    s += callout("trap", "Mixing collations breaks indexes and joins",
                 "Comparing a Latin1_General_CI_AS column with a Latin1_General_CS_AS column in SQL Server raises "
                 "&ldquo;cannot resolve the collation conflict&rdquo;. In MySQL, a join between a utf8mb4 column and "
                 "a utf8mb3 column forces a conversion and can disable the index. Keep one collation per database.")

    s.append(h2("3.5", "Length semantics: LENGTH, CHAR_LENGTH and the 65,535 limit"))
    s += code("""SELECT LENGTH('नमस्ते');        -- MySQL: 18 bytes   PostgreSQL: 18 bytes
SELECT CHAR_LENGTH('नमस्ते');  -- 6 characters (MySQL, PostgreSQL)
-- SQL Server: LEN counts characters but ignores trailing spaces; DATALENGTH counts bytes
-- Oracle: LENGTH counts characters, LENGTHB counts bytes

-- MySQL limits by type (bytes, before charset multiplication)
VARCHAR(n)      n ≤ 65,535 per row, row limit 65,535 bytes overall
TINYTEXT        255 bytes
TEXT            65,535 bytes
MEDIUMTEXT      16,777,215 bytes
LONGTEXT        4,294,967,295 bytes

-- SQL Server
VARCHAR(n)      n ≤ 8,000          NVARCHAR(n) n ≤ 4,000
VARCHAR(MAX)    2 GB               NVARCHAR(MAX) 2 GB

-- PostgreSQL
VARCHAR(n) / TEXT   effectively unlimited (1 GB per field)
CHAR(n)             n ≤ 10,485,760, blank-padded""",
              title="universal · limits and length functions")
    s += callout("deep", "Why PostgreSQL VARCHAR(n) does not save space",
                 "In PostgreSQL, VARCHAR(n), VARCHAR and TEXT have identical storage and identical performance: "
                 "the length is a constraint, not an allocation. Use VARCHAR(n) when the limit documents the "
                 "domain; never use it hoping for speed. In MySQL the limit changes the maximum row size, so "
                 "there it does affect layout.")

    s.append(h2("3.6", "Text search: LIKE, regex and full-text"))
    s += tbl(
        ["Pattern", "Sargable?", "Notes"],
        [["col = 'value'", "Yes", "Index seek if the collation matches"],
         ["col LIKE 'abc%'", "Yes", "Left-anchored prefix can use a B-tree index"],
         ["col LIKE '%abc%'", "No", "Full scan on every engine; use a trigram/full-text index"],
         ["LOWER(col) = 'abc'", "No", "Unless you create an expression index on LOWER(col)"],
         ["col ~ 'regex'", "No", "Regex is a scan; PostgreSQL can use pg_trgm for some patterns"],
         ["FULLTEXT / tsvector", "Specialised", "Inverted index; language-aware stemming"]],
        widths=[0.24, 0.16, 0.60], caption="Table 3.4 &mdash; What keeps an index usable.")
    s += code("""-- Expression index keeps case-insensitive search sargable (PostgreSQL)
CREATE INDEX ix_users_email_lower ON users (LOWER(email));
SELECT * FROM users WHERE LOWER(email) = 'foo@x.com';      -- uses the index

-- MySQL 8 functional index
ALTER TABLE users ADD INDEX ix_email_lower ((LOWER(email)));

-- Full-text search
-- MySQL
CREATE FULLTEXT INDEX ft_body ON articles (body);
SELECT * FROM articles WHERE MATCH(body) AGAINST ('data type' IN NATURAL LANGUAGE MODE);

-- PostgreSQL
CREATE INDEX ix_body_fts ON articles USING GIN (to_tsvector('english', body));
SELECT * FROM articles WHERE to_tsvector('english', body) @@ plainto_tsquery('english','data type');""",
              title="engine-specific · making text search fast")

    s.append(h2("3.7", "Practical rules for text columns"))
    s += tbl(
        ["Rule", "Reason"],
        [["Use VARCHAR(n) with a limit that means something", "254 for emails, 2/3 for ISO codes, 120 for names &mdash; the limit is documentation"],
         ["Never use CHAR(n) for names or free text", "Padding, wasted bytes, trailing-space comparisons"],
         ["Keep TEXT/CLOB out of the hot table", "Off-page reads; move to a detail table if rarely selected"],
         ["Always specify the charset explicitly on MySQL", "The server default silently changes with upgrades and dumps"],
         ["Prefer unicode everywhere, once", "NVARCHAR/utf8mb4 from day one; conversions are rebuilds"],
         ["Store one value per column", "'Delhi, Mumbai' in a city column removes every filter and group-by"],
         ["Normalise obvious lookups", "Status and country values belong in a lookup table, not free text"],
         ["Do not put numbers and dates in VARCHAR", "Sorting becomes lexical: '10' < '9', 'Apr' < 'Mar'"],
         ["Trim on write, not on read", "TRIM() inside a WHERE clause disables the index"]],
        widths=[0.42, 0.58], caption="Table 3.5 &mdash; Nine rules that prevent most text-type defects.")

    s.append(h2("3.8", "Engine cheat sheet: character types"))
    s += tbl(
        ["Need", "MySQL 8", "PostgreSQL 16", "SQL Server", "Oracle 23ai", "SQLite"],
        [["Fixed length", "CHAR(n)", "CHAR(n)", "CHAR(n) / NCHAR(n)", "CHAR(n)", "TEXT"],
         ["Bounded variable", "VARCHAR(n)", "VARCHAR(n)", "VARCHAR(n) / NVARCHAR(n)", "VARCHAR2(n)", "TEXT"],
         ["Unbounded text", "TEXT / LONGTEXT", "TEXT", "VARCHAR(MAX) / NVARCHAR(MAX)", "CLOB / NCLOB", "TEXT"],
         ["Unicode", "utf8mb4 collation", "UTF-8 database", "NVARCHAR / NCHAR", "NVARCHAR2 / AL32UTF8", "always UTF-8"],
         ["Binary text", "BLOB / VARBINARY", "BYTEA", "VARBINARY(MAX)", "BLOB / RAW", "BLOB"],
         ["Case-insensitive", "collation ..._ci", "citext extension", "collation ..._CI", "NLS_SORT setting", "COLLATE NOCASE"]],
        widths=[0.18, 0.18, 0.16, 0.20, 0.16, 0.12], caption="Table 3.6 &mdash; Character types across engines.", size=7.4)
    s += callout("tip", "Try it",
                 "Insert an emoji into a utf8mb3 and a utf8mb4 column in MySQL and compare the errors. Then insert "
                 "'A' into CHAR(4) and VARCHAR(4) on PostgreSQL and compare octet_length(). The difference is the "
                 "whole lesson of this part.")
    return s
