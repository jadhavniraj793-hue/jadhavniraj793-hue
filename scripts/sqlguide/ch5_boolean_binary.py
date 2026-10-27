"""Part 5 — Boolean, binary and identifier types."""
from .theme import *

P = "5"


def ch5():
    s = []
    s += part(P, "Boolean, Binary & Identifiers", "Two-state logic, raw bytes and the keys that identify a row")
    s.append(lead(
        "This part covers the types that are small in bytes and large in consequences: booleans that decide "
        "which rows exist, binary columns that hold hashes, keys and files, and identifier types where the "
        "choice between BIGINT and UUID shapes your index for years."))

    s.append(h2("5.1", "BOOLEAN and its four impersonations"))
    s += tbl(
        ["Engine", "True boolean", "Common emulation", "Notes"],
        [["PostgreSQL", "BOOLEAN", "&mdash;", "Accepts TRUE/FALSE, 't'/'f', 'yes'/'no', 1/0; prints t/f"],
         ["MySQL", "None (TINYINT(1))", "TINYINT(1), ENUM('Y','N'), CHAR(1)", "TRUE and FALSE are aliases for 1 and 0"],
         ["SQL Server", "BIT", "CHAR(1), TINYINT", "BIT stores 0, 1 or NULL; up to 8 BIT columns share a byte"],
         ["Oracle", "BOOLEAN (23ai)", "NUMBER(1), CHAR(1)", "Before 23ai, BOOLEAN existed only in PL/SQL"],
         ["SQLite", "None", "INTEGER 0/1", "Any value can be stored; CHECK (flag IN (0,1)) enforces it"]],
        widths=[0.15, 0.18, 0.27, 0.40], caption="Table 5.1 &mdash; Boolean support is the least portable thing in SQL.")
    s += code("""-- PostgreSQL: a real boolean, with the natural syntax
CREATE TABLE users (is_active BOOLEAN NOT NULL DEFAULT TRUE);
SELECT * FROM users WHERE is_active;                  -- no = TRUE needed
SELECT * FROM users WHERE NOT is_active;

-- MySQL: TINYINT(1) by convention, 1/0 by necessity
CREATE TABLE users (is_active TINYINT(1) NOT NULL DEFAULT 1 CHECK (is_active IN (0,1)));
SELECT * FROM users WHERE is_active = 1;

-- SQL Server: BIT
CREATE TABLE users (is_active BIT NOT NULL DEFAULT 1);
SELECT * FROM users WHERE is_active = 1;

-- Oracle 23ai: native BOOLEAN in SQL
CREATE TABLE users (is_active BOOLEAN DEFAULT TRUE);""",
              title="universal · one flag, four declarations")
    s += callout("trap", "TINYINT(1) is not a boolean",
                 "In MySQL, the (1) is a display width: a TINYINT(1) column will happily store 42, -7 or 100. If "
                 "the column means &ldquo;yes or no&rdquo;, add CHECK (col IN (0,1)) or use an ENUM. The width does "
                 "not enforce anything and is deprecated in MySQL 8.0.17+.")

    s.append(h3("Three-valued logic in practice"))
    s += code("""-- With NULL flags, three states exist: TRUE, FALSE, UNKNOWN
SELECT COUNT(*) AS total,
       COUNT(*) FILTER (WHERE is_active)      AS active,        -- PostgreSQL
       COUNT(*) FILTER (WHERE NOT is_active)  AS inactive,
       COUNT(*) FILTER (WHERE is_active IS NULL) AS unknown
FROM users;

-- MySQL equivalent
SELECT SUM(is_active = 1), SUM(is_active = 0), SUM(is_active IS NULL) FROM users;

-- Dangerous: NOT IN with a nullable boolean
WHERE status NOT IN (SELECT flag FROM flags)   -- returns nothing if any flag is NULL

-- Safe: explicit exclusion of NULLs
WHERE status NOT IN (SELECT flag FROM flags WHERE flag IS NOT NULL)""",
              title="universal · flags have three states unless you forbid the third")
    s += callout("best", "Make flags NOT NULL",
                 "A nullable boolean has three meanings and every consumer guesses differently: the dashboard "
                 "treats NULL as false, the API sends null, the filter drops the row. Default to NOT NULL with an "
                 "explicit default, and only allow NULL when &ldquo;unknown&rdquo; is a genuine business state.")

    s.append(h2("5.2", "Binary types: BINARY, VARBINARY, BLOB, BYTEA, RAW"))
    s += tbl(
        ["Type", "Engine", "Storage", "Max size", "Use for"],
        [["BINARY(n)", "MySQL, SQL Server", "Fixed, zero-padded to n", "255 / 8,000", "Fixed hashes, fixed keys"],
         ["VARBINARY(n)", "MySQL, SQL Server", "Variable + length prefix", "65,535 / 8,000", "Tokens, small payloads"],
         ["VARBINARY(MAX)", "SQL Server", "Off-row above 8 KB", "2 GB", "Files, images, serialised objects"],
         ["BLOB", "MySQL, Oracle, SQLite", "Off-page pointer + payload", "64 KB &ndash; 4 GB (by variant)", "Documents, images"],
         ["BYTEA", "PostgreSQL", "Variable, TOAST-compressed", "1 GB", "Binary payloads of any kind"],
         ["RAW(n)", "Oracle", "Fixed, not converted", "2,000 bytes", "Keys, hashes"],
         ["IMAGE / LONG RAW", "SQL Server / Oracle", "Deprecated", "&mdash;", "Legacy; migrate to VARBINARY(MAX)/BLOB"]],
        widths=[0.17, 0.20, 0.24, 0.16, 0.23], caption="Table 5.2 &mdash; Binary types and what they cost.")
    s += code("""-- Storing a SHA-256 hash: the fixed-width case
-- PostgreSQL
CREATE TABLE files (sha256 BYTEA NOT NULL CHECK (octet_length(sha256) = 32));
-- MySQL
CREATE TABLE files (sha256 BINARY(32) NOT NULL);
-- SQL Server
CREATE TABLE files (sha256 BINARY(32) NOT NULL);

-- Hex literals differ by engine
INSERT INTO files VALUES (DECODE('9f86d081...', 'hex'));   -- Oracle
INSERT INTO files VALUES (UNHEX('9f86d081...'));           -- MySQL
INSERT INTO files VALUES ('\\x9f86d081...'::bytea);        -- PostgreSQL
INSERT INTO files VALUES (0x9F86D081...);                  -- SQL Server

-- Readable output
SELECT encode(sha256, 'hex') FROM files;   -- PostgreSQL
SELECT HEX(sha256) FROM files;             -- MySQL
SELECT CONVERT(VARCHAR(64), sha256, 2) FROM files;  -- SQL Server""",
              title="universal · the same hash, four literal syntaxes")
    s += bl([
        "<b>Binary comparisons are byte-exact and case-sensitive</b> &mdash; unlike CHAR with a case-insensitive "
        "collation. That makes BINARY(32) the right home for hashes, tokens and checksums.",
        "<b>Zero padding surprises.</b> BINARY(n) pads with 0x00, so BINARY(4) 'AB' &ne; BINARY(2) 'AB'. Use "
        "VARBINARY unless the length is guaranteed.",
        "<b>Do not store large files in the database by default.</b> Blobs inflate backups, break streaming "
        "replication patterns, and are invisible to BI tools. Store them in object storage and keep the pointer "
        "in the row &mdash; unless transactional consistency with the row is a hard requirement.",
        "<b>Encryption and hashing live here.</b> Password hashes, PII tokenisation and column-level encryption "
        "payloads are all binary. Size the column for the algorithm's output, not for today's data.",
    ])

    s.append(h2("5.3", "Identifiers: BIGINT, UUID, ULID and natural keys"))
    s += tbl(
        ["Key type", "Bytes", "Ordering", "Insert locality", "Portable", "Best for"],
        [["INT identity", "4", "Sequential", "Excellent", "Yes", "Small tables, dimension keys"],
         ["BIGINT identity", "8", "Sequential", "Excellent", "Yes", "Fact tables, event streams"],
         ["UUIDv4", "16", "Random", "Poor (page splits)", "Yes", "Distributed writes, public IDs"],
         ["UUIDv7 / ULID", "16", "Time-ordered", "Good", "Mostly", "Distributed writes with range scans"],
         ["Snowflake ID", "8", "Time-ordered", "Good", "Manual", "High-volume distributed systems"],
         ["Natural key (email)", "20&ndash;254", "Depends", "Good but wide", "Yes", "Dimensions, with a surrogate PK"],
         ["Composite key", "Sum", "Depends", "Good", "Yes", "Junction tables, no surrogate needed"]],
        widths=[0.18, 0.09, 0.12, 0.16, 0.10, 0.35], caption="Table 5.3 &mdash; Keys are the most consequential type decision in a schema.")
    s += code("""-- PostgreSQL: native UUID, with generation strategies
CREATE TABLE orders (
    id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),      -- v4: random
    -- id UUID PRIMARY KEY DEFAULT uuidv7(),             -- PG 18+: time-ordered
    ref BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE       -- human-friendly invoice number
);

-- SQL Server: UNIQUEIDENTIFIER, with a sequential default worth knowing
CREATE TABLE orders (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID()
    -- NEWID() is random and fragments the clustered index;
    -- NEWSEQUENTIALID() is monotonic within the machine.
);

-- MySQL: UUID stored as BINARY(16) or as text
CREATE TABLE orders (
    id      BINARY(16) PRIMARY KEY,                      -- 16 bytes instead of 36
    id_text CHAR(36) GENERATED ALWAYS AS (
              INSERT(BIN_TO_UUID(id), 1, 1, '-')
            ) VIRTUAL
);
-- UUID_TO_BIN(uuid, 1) reorders the time fields for better index locality

-- Oracle
CREATE TABLE orders (id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY);""",
              title="universal · UUIDs, and how to keep them from wrecking an index")
    s += callout("deep", "Why random UUIDs hurt",
                 "A clustered or B-tree index keeps keys in order. Random 16-byte keys insert into random leaf "
                 "pages: more page splits, more I/O, a larger and more fragmented index. Time-ordered UUIDs "
                 "(UUIDv7, ULID) and MySQL's UUID_TO_BIN(x, 1) restore locality while keeping global uniqueness. "
                 "On PostgreSQL with a separate primary key index the effect is smaller but still measurable at "
                 "scale.")
    s += callout("best", "The two-key pattern",
                 "Keep a compact surrogate key (BIGINT) for joins and storage, plus a natural or public key "
                 "(UUID, order code, email) with a UNIQUE index for lookups and external references. Joins stay "
                 "narrow, external identifiers stay opaque and safe to expose.")

    s.append(h2("5.4", "Special-purpose types you will meet in schemas"))
    s += tbl(
        ["Type", "Engine", "What it does", "When to use"],
        [["ROWVERSION / TIMESTAMP", "SQL Server", "8-byte binary that changes on update", "Optimistic concurrency, change detection"],
         ["SQL_VARIANT", "SQL Server", "Holds any type in one column", "Avoid: opaque, slow, unindexable in practice"],
         ["SYS_GUID() / RAW(16)", "Oracle", "16-byte globally unique identifier", "Surrogate keys without sequences"],
         ["OID", "PostgreSQL", "Object identifier", "Internal; do not design with it"],
         ["HSTORE", "PostgreSQL", "Key-value text pairs", "Sparse attributes; JSONB is usually better"],
         ["VECTOR", "pgvector, Oracle 23ai, MySQL 9", "Embeddings of n dimensions", "Similarity search over ML embeddings"],
         ["INET / CIDR / MACADDR", "PostgreSQL", "Network addresses with validation", "Logs, device inventories"],
         ["GEOMETRY / GEOGRAPHY", "All major engines", "Points, lines, polygons with SRID", "Maps, distance, catchment analysis"],
         ["TSVECTOR", "PostgreSQL", "Pre-processed searchable text", "Full-text indexes"],
         ["DOMAIN / ENUM / COMPOSITE", "PostgreSQL, MySQL (ENUM)", "User-defined types", "Centralise validation and reuse it"]],
        widths=[0.22, 0.19, 0.28, 0.31], caption="Table 5.4 &mdash; Types that look exotic and are routinely useful.")
    s += code("""-- PostgreSQL: a domain is a reusable, checkable type
CREATE DOMAIN email_address AS TEXT
    CHECK (VALUE ~ '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$');

CREATE TABLE customers (
    email email_address NOT NULL UNIQUE      -- validation travels with the type
);

-- A composite type for repeated structures
CREATE TYPE address AS (line1 TEXT, city TEXT, postal_code TEXT, country CHAR(2));
CREATE TABLE suppliers (id INT, billing address);

-- Network types reject bad data at insert time
CREATE TABLE devices (ip INET, network CIDR, hw MACADDR);
INSERT INTO devices VALUES ('192.168.1.10', '192.168.1.0/24', '08:00:2b:01:02:03');""",
              title="postgresql · domains, composites and network types")
    return s
