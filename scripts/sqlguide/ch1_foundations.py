"""Part 1 — Foundations of data types."""
from .theme import *

P = "1"


def ch1():
    s = []
    s += part(P, "Foundations of Data Types", "What a type is, what it costs, and why the choice is a design decision")
    s.append(lead(
        "Before the catalogue of types, one idea: a data type is a <b>contract</b> the database enforces on "
        "every value, on every row, forever. Get the contract right and the database protects you. Get it "
        "wrong and you spend the next two years writing CAST() around it."))

    s.append(h2("1.1", "What a data type actually decides"))
    s.append(body(
        "A type declaration answers four questions at once. Change the type and you change all four, often "
        "without noticing."))
    s += tbl(
        ["Decision", "What the engine fixes", "What breaks if you get it wrong"],
        [["<b>Encoding</b>", "How the bytes are laid out: two's complement for integers, IEEE&nbsp;754 for "
                              "floats, a length prefix for strings, an epoch offset for timestamps.",
          "Wrong family = values reinterpreted, e.g. 20240131 stored as an INT cannot be sorted as a date."],
         ["<b>Domain</b>", "Which values are legal and what happens to illegal ones: reject, round, truncate "
                            "or wrap.",
          "Silent truncation: 'Niraj Jadhav' into VARCHAR(10) becomes 'Niraj Jad' on MySQL without strict mode."],
         ["<b>Operations</b>", "Which functions and operators apply: + for numbers, || for strings in some "
                                "engines, INTERVAL arithmetic for dates.",
          "'2024-01-31' + 1 means different things in different types and engines."],
         ["<b>Ordering</b>", "How values compare and sort, including collation for text and time zone for "
                              "timestamps.",
          "A &ldquo;sorted&rdquo; report that is alphabetical instead of chronological, or case-sensitive when "
          "users expect otherwise."]],
        widths=[0.13, 0.47, 0.40], caption="Table 1.1 &mdash; The four decisions inside every type declaration.")

    s.append(h2("1.2", "Why types matter more in analytics than in app code"))
    s.append(body(
        "Application code fails loudly. Analytics fails quietly: a division that returns an integer, a "
        "timestamp that loses its time zone, a decimal that becomes a float and drifts by a cent at the "
        "eighth decimal place. The wrong total reaches a dashboard and someone makes a decision on it. Four "
        "reasons the type choice dominates:"))
    s += bl([
        "<b>Cost compounds.</b> A BIGINT where INT would do costs 2&times; per column, and every index on that "
        "column costs 2&times; as well. On a billion-row fact table that is tens of gigabytes and a slower "
        "scan, forever.",
        "<b>Types steer the optimiser.</b> Comparing two columns of different types can forbid an index seek, "
        "turn a 5&nbsp;ms lookup into a 4-second scan, and nobody notices until the table grows.",
        "<b>Types are a contract with other tools.</b> Power BI, pandas, dbt and every downstream consumer "
        "read your declared types. A DATE column is a date in the report; a VARCHAR date is text the user "
        "must slice manually.",
        "<b>Types encode meaning.</b> DECIMAL(19,4) says money. TIMESTAMPTZ says &ldquo;an instant&rdquo;. "
        "BOOLEAN says two states. Those hints survive documentation, staff turnover and migrations.",
    ])

    s.append(h2("1.3", "The universal type families"))
    s.append(body(
        "Vendors disagree on names, not on concepts. Learn the nine families and every engine becomes a "
        "dialect of one language."))
    s += tbl(
        ["Family", "What it holds", "Typical members", "Watch out for"],
        [["Integer", "Whole numbers", "TINYINT, SMALLINT, INT, BIGINT, SERIAL, IDENTITY",
          "Overflow, unsigned ranges, integer division"],
         ["Exact decimal", "Money and fixed-point", "DECIMAL, NUMERIC, NUMBER(p,s), MONEY",
          "Scale you forgot to declare, rounding mode"],
         ["Approximate", "Scientific values", "FLOAT, REAL, DOUBLE PRECISION, BINARY_FLOAT",
          "Binary representation, equality tests, accumulation error"],
         ["Character", "Text and codes", "CHAR, VARCHAR(n), TEXT, NVARCHAR, CLOB, VARCHAR2",
          "Bytes vs characters, collation, off-page storage"],
         ["Temporal", "Instants and durations", "DATE, TIME, DATETIME, TIMESTAMP, TIMESTAMPTZ, INTERVAL",
          "Time zone loss, fractional seconds, 2038"],
         ["Boolean", "Two states", "BOOLEAN, BIT, TINYINT(1), CHAR(1)",
          "Three-valued logic with NULL, engine emulation"],
         ["Binary", "Raw bytes", "BINARY, VARBINARY, BLOB, BYTEA, RAW, IMAGE", "Encoding, size caps, backups"],
         ["Structured", "Documents inside a column", "JSON, JSONB, XML, ARRAY, ENUM, RANGE, HSTORE",
          "Indexability, schema drift, query complexity"],
         ["Special", "Purpose-built", "UUID, INET, MACADDR, GEOGRAPHY, TSVECTOR, VECTOR, ROWVERSION",
          "Extension required, portability, index type"]],
        widths=[0.16, 0.17, 0.35, 0.32], caption="Table 1.2 &mdash; The nine families used throughout this guide.")

    s += callout("note", "Names travel badly, families travel well",
                 "Oracle NUMBER(11) maps to MySQL DECIMAL(11,0), SQL Server DECIMAL(11,0), PostgreSQL NUMERIC(11,0) "
                 "and SQLite NUMERIC. The <i>name</i> is not portable; the <i>family and parameters</i> are. "
                 "That is why Part 8 is a mapping table rather than a list of names.")

    s.append(h2("1.4", "Anatomy of a declaration"))
    s.append(body(
        "A column definition has up to five parts. Reading them separately is how you review a schema quickly."))
    s += code("""--     name        type + params          modifiers                        default
--     ────────    ────────────────────    ─────────────────────────────    ────────────────
CREATE TABLE orders (
    order_id     BIGINT UNSIGNED           NOT NULL AUTO_INCREMENT,        -- identity + range
    customer_id  INT UNSIGNED              NOT NULL,                        -- foreign key
    status       ENUM('new','paid','void') NOT NULL DEFAULT 'new',          -- domain constraint
    amount       DECIMAL(12,2)             NOT NULL DEFAULT 0.00,           -- exact money
    currency     CHAR(3)                   NOT NULL DEFAULT 'INR',
    note         VARCHAR(500)              CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
    created_at   TIMESTAMP                 NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (order_id),
    INDEX idx_customer (customer_id)
) ENGINE = InnoDB;""", title="mysql 8 · every part of a column definition")
    s += bl([
        "<b>Type + parameters</b> &mdash; the family plus its size/precision: VARCHAR(500), DECIMAL(12,2), "
        "DATETIME(3). Parameters are not decoration; they are the contract's dimensions.",
        "<b>Numeric modifiers</b> &mdash; UNSIGNED, ZEROFILL (MySQL), WITH TIME ZONE (PostgreSQL/Oracle), "
        "SRID (spatial). They change the legal range, not the storage class.",
        "<b>Character modifiers</b> &mdash; CHARACTER SET and COLLATE decide how text is stored and compared.",
        "<b>Identity modifiers</b> &mdash; AUTO_INCREMENT, IDENTITY(1,1), GENERATED ... AS IDENTITY, SERIAL, "
        "sequences. Covered in Part 2.",
        "<b>Constraints and defaults</b> &mdash; NOT NULL, DEFAULT, CHECK, UNIQUE, REFERENCES. In practice the "
        "constraint set is part of the type's meaning.",
    ])

    s.append(h2("1.5", "Fixed versus variable length"))
    s.append(body(
        "Three storage strategies appear in every engine: <b>fixed</b> (allocate the declared size always), "
        "<b>variable with inline data</b> (length prefix plus the bytes, up to a threshold) and <b>variable "
        "with off-page overflow</b> (a pointer stays in the row, the payload moves elsewhere). The strategy "
        "decides what a wide column really costs you."))
    s += tbl(
        ["Strategy", "Examples", "Cost per row", "Consequence"],
        [["Fixed", "INT, BIGINT, DATE, CHAR(10), BINARY(16), UNIQUEIDENTIFIER",
          "Always the declared width, plus alignment padding",
          "Predictable and fast; wasted space when values are short"],
         ["Variable inline", "VARCHAR(n), NVARCHAR(n), VARBINARY(n), DECIMAL",
          "2 bytes of length + actual bytes (engine-specific)",
          "Compact; row can grow on update"],
         ["Variable off-page", "TEXT, LONGTEXT, BLOB, VARCHAR(MAX), BYTEA, CLOB",
          "20-byte pointer in the row + payload in overflow pages",
          "Row stays slim; reading the column requires extra I/O"]],
        widths=[0.18, 0.36, 0.22, 0.24], caption="Table 1.3 &mdash; The three storage strategies.")
    s += callout("deep", "Off-page is not free",
                 "In PostgreSQL, values over ~2&nbsp;KB are compressed and moved to TOAST tables; a pointer "
                 "remains. Selecting the column forces a second read. In SQL Server, VARCHAR(MAX) values over "
                 "8&nbsp;KB go to row-overflow pages. A dashboard that runs SELECT * on a table with a CLOB "
                 "reads gigabytes it never displays &mdash; always list columns explicitly.")

    s.append(h2("1.6", "NULL: not a type, but part of every type"))
    s.append(body(
        "Any nullable column can hold a fourth kind of value alongside its domain: NULL, meaning "
        "<i>unknown</i> or <i>not applicable</i> &mdash; not zero and not empty string. NULLs obey "
        "three-valued logic: comparisons return TRUE, FALSE or UNKNOWN, and WHERE keeps only TRUE."))
    s += code("""SELECT * FROM customers WHERE city = 'Mumbai';   -- NULL cities excluded
SELECT * FROM customers WHERE city <> 'Mumbai';  -- NULL cities excluded AGAIN
SELECT * FROM customers WHERE city IS NULL;      -- the only reliable test
SELECT COALESCE(city, 'Unknown') FROM customers; -- substitute for display
SELECT COUNT(*), COUNT(city) FROM customers;     -- count all rows vs non-NULL city""",
              title="universal · three-valued logic in one screen")
    s += bl([
        "<b>Aggregates skip NULL.</b> AVG over 10 values where 4 are NULL divides by 6, not 10. This is the "
        "single most common source of &ldquo;wrong&rdquo; averages in reports.",
        "<b>NOT IN with NULL returns nothing.</b> x NOT IN (1, NULL) is never TRUE. Use NOT EXISTS, or filter "
        "NULLs out of the list.",
        "<b>NULL is nearly free.</b> Engines store a NULL bitmap or a null flag; a NULL in a fixed-width "
        "column usually saves nothing, but a NULL in a variable column costs one byte.",
        "<b>NULLs affect indexes and constraints.</b> Most engines index NULLs (Oracle does not unless the "
        "index is composite), UNIQUE allows multiple NULLs in PostgreSQL, MySQL and SQLite, and only one in "
        "SQL Server.",
    ])
    s += callout("best", "Decide nullability at design time",
                 "Every column is NOT NULL until you can name, in one sentence, why a row may legitimately "
                 "have no value. &ldquo;It might be missing&rdquo; is a data-quality problem, not a schema "
                 "feature &mdash; and a NOT NULL constraint is the cheapest data-quality job you will ever ship.")

    s.append(h2("1.7", "A type does not just cost space &mdash; it costs space everywhere"))
    s.append(body(
        "A column's type shows up in the table, in every index that contains it, in every join hash table and "
        "sort buffer that touches it, and in every backup and replica stream. Estimate before you declare:"))
    s += code("""rows            = 100,000,000
column          = one BIGINT key  -> 8 bytes/row  = 0.8 GB
same column     = INT key         -> 4 bytes/row  = 0.4 GB
one secondary index on that key   -> +4 to +8 bytes/row + page overhead ≈ 0.9 GB
30-day backup retention, 2 replicas -> multiply that difference again

-- rule of thumb: total ≈ rows × (row width + ~10%) × (1 + number of indexes)""",
              title="arithmetic worth doing before the table exists")
    s += callout("tip", "The 4-byte question",
                 "For every integer key ask: will this table ever exceed 4.29&nbsp;billion rows (2.1&nbsp;billion "
                 "signed)? If not, INT. Analytics tables often never do; append-only event tables usually will. "
                 "Changing a key type later means rebuilding the table and every index that references it.")

    s.append(h2("1.8", "Choosing a type: the decision order"))
    s += num([
        "<b>Name the meaning.</b> Money? Instant in time? Local date? Category? Identifier? Free text? "
        "Measurement? The meaning picks the family, not the other way round.",
        "<b>Pick exactness before size.</b> Money and counters are exact: DECIMAL or INTEGER, never FLOAT.",
        "<b>Estimate the range.</b> Signed TINYINT &plusmn;127 may be perfect for a 1&ndash;5 rating and "
        "wrong for a size in bytes.",
        "<b>Decide the time semantics.</b> An instant (TIMESTAMPTZ / DATETIMEOFFSET) or a wall-clock value "
        "(DATE / DATETIME)? See Part 4 &mdash; this decision is the hardest to reverse.",
        "<b>Decide text length policy.</b> A code with a fixed vocabulary is CHAR(n), a bounded label is "
        "VARCHAR(n), unbounded prose is TEXT and belongs in a side table if it is large.",
        "<b>Constrain the domain.</b> CHECK, ENUM or a lookup table. If the values can change without a "
        "release, use a lookup table; if they change with a release, ENUM is acceptable.",
        "<b>Only then optimise for bytes.</b> Size tuning comes last and matters least &mdash; correctness "
        "first, portability second, bytes third.",
    ])

    s.append(h2("1.9", "Reading a real schema"))
    s.append(body(
        "Here is a small warehouse-style schema. Notice how many decisions are visible in the declarations "
        "alone &mdash; and how a reviewer can question each one."))
    s += code("""CREATE TABLE dim_customer (
    customer_sk    INTEGER      PRIMARY KEY,               -- surrogate key, warehouse-local
    customer_id    VARCHAR(20)  NOT NULL UNIQUE,           -- natural key, fixed-width code
    full_name      VARCHAR(120) NOT NULL,
    email          VARCHAR(254) NOT NULL,                  -- 254 = RFC max practical length
    country_code   CHAR(2)      NOT NULL,                  -- ISO 3166-1 alpha-2
    signup_date    DATE         NOT NULL,
    is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
    loyalty_tier   VARCHAR(10)  NOT NULL DEFAULT 'none'    -- low-cardinality label
);

CREATE TABLE fact_sales (
    sale_id        BIGINT       PRIMARY KEY,
    sold_at        TIMESTAMPTZ  NOT NULL,                  -- an instant, not a wall clock
    business_date  DATE         NOT NULL,                  -- pre-computed reporting grain
    customer_sk    INTEGER      NOT NULL REFERENCES dim_customer(customer_sk),
    product_sk     INTEGER      NOT NULL,
    quantity       INTEGER      NOT NULL CHECK (quantity > 0),
    unit_price     DECIMAL(12,2) NOT NULL,                 -- exact money
    discount_pct   DECIMAL(5,2)  NOT NULL DEFAULT 0,
    net_amount     DECIMAL(14,2) NOT NULL,                 -- pre-computed to avoid re-deriving
    currency       CHAR(3)      NOT NULL DEFAULT 'INR'
);""", title="postgresql 16 · a schema where every type is a decision")
    s += cards([
        ("Why surrogate INTEGER keys?",
         "Filtering and joining on a 4-byte integer beats a 20-byte natural key, and dimension keys never "
         "overflow in practice. The natural key stays, with a UNIQUE index, for traceability."),
        ("Why both sold_at and business_date?",
         "sold_at answers &ldquo;when exactly&rdquo;; business_date answers &ldquo;which day does finance count "
         "this in&rdquo;. Deriving the second from the first inside every query is slower and drifts."),
        ("Why DECIMAL for discount_pct?",
         "Percentages look harmless as floats, but repeated multiplication accumulates error. Fixed scale "
         "keeps totals reproducible &mdash; a hard requirement for reconciliation."),
        ("Why VARCHAR(254) for email?",
         "The limit documents the domain and blocks 10&nbsp;MB junk. PostgreSQL will not perform better, but "
         "the next engineer learns the intent &mdash; that is the point."),
    ])
    s += callout("warn", "The one thing you cannot fix later",
                 "Choosing DATETIME where you needed an instant, or FLOAT where you needed money, is not a "
                 "typing mistake &mdash; it is a data-loss event. Every value written before the fix is already "
                 "wrong. Fix those two choices at design time, always.")

    s.append(h2("1.10", "Part 1 in one page"))
    s += tbl(
        ["If you remember one thing", "Do this"],
        [["A type is a contract with four parts", "Check encoding, domain, operations and ordering before signing it"],
         ["Analytics fails quietly", "Prefer exact types and explicit casts in anything that produces a number"],
         ["Families are portable, names are not", "Design in families, translate per engine (Part 8)"],
         ["Fixed, variable, off-page", "Keep large text and blobs out of the hot row; never SELECT *"],
         ["NULL is a value, not a zero", "Decide nullability, use IS NULL, use COALESCE for display"],
         ["Cost is everywhere", "Estimate rows &times; width &times; indexes before declaring BIGINT"]],
        widths=[0.42, 0.58], caption="Table 1.4 &mdash; Part 1 summary.")
    return s
