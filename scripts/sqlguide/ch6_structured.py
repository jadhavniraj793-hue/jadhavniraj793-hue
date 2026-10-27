"""Part 6 — Structured, document and special types."""
from .theme import *

P = "6"


def ch6():
    s = []
    s += part(P, "Structured & Special Types", "JSON, XML, arrays, enums, ranges, spatial and vector columns")
    s.append(lead(
        "Everything so far was a single scalar value. This part covers types that hold <b>structure</b> inside "
        "one column &mdash; documents, arrays, key/value maps, enumerations, numeric ranges, geometries and "
        "embeddings. They are powerful, they are unevenly supported, and every one of them comes with a rule "
        "about when <i>not</i> to use it."))

    s.append(h2("6.1", "When a structured type is the right answer"))
    s += tbl(
        ["Situation", "Structured type?", "Better option"],
        [["Attributes that differ per product category", "Yes &mdash; JSONB", "A sparse attribute table, if you must query many of them"],
         ["A fixed set of 12 form fields", "No", "Twelve ordinary columns"],
         ["A list of tags per row", "Yes &mdash; ARRAY or JSON", "A junction table if you join or count by tag"],
         ["A status with 5 known values", "Yes &mdash; ENUM or CHECK", "A lookup table if the list changes without a release"],
         ["Saving an API response for audit", "Yes &mdash; JSON", "Nothing better; store verbatim, do not query deeply"],
         ["Price bands (0&ndash;100, 100&ndash;500 &hellip;)", "Yes &mdash; RANGE", "Two columns plus a BETWEEN, if ranges are simple"],
         ["Location of a store", "Yes &mdash; spatial", "Two decimal columns if you only ever display the point"],
         ["A user's permissions", "Rarely &mdash; bit mask", "A roles table with a join"]],
        widths=[0.40, 0.22, 0.38], caption="Table 6.1 &mdash; The structured-type decision table.")
    s += callout("best", "The first-normal-form rule",
                 "If a value is something you filter on, group by, join on or constrain, it deserves its own "
                 "column. Structured types are for the long tail of attributes that are read as a whole, and for "
                 "payloads you keep for completeness rather than analysis.")

    s.append(h2("6.2", "JSON and JSONB"))
    s += tbl(
        ["Engine", "Type", "Storage", "Indexable", "Notes"],
        [["PostgreSQL", "JSON", "Text, verbatim", "No (expression indexes only)", "Keeps whitespace, key order and duplicates"],
         ["PostgreSQL", "JSONB", "Binary, parsed", "Yes &mdash; GIN, expression", "Deduplicates keys, sorts them; the default choice"],
         ["MySQL 8", "JSON", "Binary (JSONB-like)", "Yes &mdash; multi-valued and generated-column indexes", "Validated on insert; 1 GB max"],
         ["SQL Server", "NVARCHAR(MAX) + ISJSON", "Text", "Yes &mdash; computed columns + indexes", "No native JSON type; JSON functions over text"],
         ["Oracle 23ai", "JSON", "Binary OSON", "Yes &mdash; JSON search index", "Native JSON type since 21c"],
         ["SQLite", "TEXT + json1", "Text", "Expression indexes only", "Functions available since 3.38"]],
        widths=[0.15, 0.20, 0.20, 0.24, 0.21], caption="Table 6.2 &mdash; JSON support is the most uneven feature in SQL.")
    s += code("""-- PostgreSQL: JSONB, the reference implementation
CREATE TABLE products (
    product_id BIGINT PRIMARY KEY,
    attributes JSONB NOT NULL DEFAULT '{}'::jsonb
);

INSERT INTO products VALUES
 (1, '{"brand":"Acme","colour":"blue","sizes":[38,39,40],"price":{"amount":2499,"currency":"INR"}}');

-- Read a path (-> returns jsonb, ->> returns text)
SELECT attributes->>'brand'                          AS brand,
       (attributes->'price'->>'amount')::numeric     AS price
FROM products;

-- Filter with containment: does the document include this pair?
SELECT * FROM products WHERE attributes @> '{"colour":"blue"}';

-- Does a key exist?
SELECT * FROM products WHERE attributes ? 'sizes';

-- Expand an array into rows (the shape change analysts need most)
SELECT product_id, jsonb_array_elements_text(attributes->'sizes') AS size
FROM products;

-- Index for containment and existence queries
CREATE INDEX ix_products_attrs ON products USING GIN (attributes);
-- Index for one hot path
CREATE INDEX ix_products_brand ON products ((attributes->>'brand'));""",
              title="postgresql · jsonb from storage to query")
    s += code("""-- MySQL 8: JSON paths use $ syntax
SELECT attributes->>'$.brand' AS brand,
       JSON_EXTRACT(attributes, '$.price.amount') AS price
FROM products;

SELECT * FROM products WHERE JSON_CONTAINS(attributes, '"blue"', '$.colour');

-- Index one extracted value with a generated column
ALTER TABLE products
  ADD COLUMN brand VARCHAR(60) GENERATED ALWAYS AS (attributes->>'$.brand') STORED,
  ADD INDEX ix_brand (brand);

-- Multi-valued index over an array (MySQL 8.0.17+)
ALTER TABLE products ADD INDEX ix_sizes ((CAST(attributes->'$.sizes' AS UNSIGNED ARRAY)));

-- SQL Server: JSON functions over NVARCHAR, with a validated check
CREATE TABLE products (
    product_id BIGINT PRIMARY KEY,
    attributes NVARCHAR(MAX) CHECK (ISJSON(attributes) = 1)
);
SELECT JSON_VALUE(attributes, '$.brand') FROM products;
SELECT * FROM products WHERE JSON_VALUE(attributes, '$.colour') = 'blue';

-- Oracle: dot notation on a native JSON column
SELECT p.attributes.brand.string() FROM products p;""",
              title="engine-specific · JSON in MySQL, SQL Server and Oracle")
    s += bl([
        "<b>JSONB rewrites your document</b>: keys sorted, duplicates dropped, whitespace gone. If you need the "
        "exact bytes for a digital signature, store text.",
        "<b>Every key is untyped.</b> A price written as \"2499\" (string) and 2499 (number) are different "
        "values and comparison silently fails. Validate at the boundary.",
        "<b>Indexes are opt-in.</b> Unlike a column index, a GIN index must be created and must match the "
        "operator you use. A JSON query without one is a full scan with parsing overhead.",
        "<b>Size matters.</b> Documents over a few kilobytes push the row off-page and inflate WAL. Keep the "
        "document for the sparse attributes, not for the big payload.",
        "<b>Consider generating columns</b> for the two or three paths you query constantly; that gives you "
        "ordinary index behaviour with JSON flexibility.",
    ])
    s += callout("trap", "JSON is not a schema-avoidance strategy",
                 "Teams adopt JSON to avoid migrations, then spend a year building validation in application code "
                 "that a CHECK constraint would have done for free. Use JSON for genuine variability; use columns "
                 "for the shape you know.")

    s.append(h2("6.3", "XML and other document types"))
    s += tbl(
        ["Type", "Engine", "Storage", "Use when"],
        [["XML / XMLTYPE", "SQL Server, Oracle, PostgreSQL (xml)", "Parsed text, optional schema validation", "Contractual feeds: ISO 20022, UBL invoices, SOAP"],
         ["HSTORE", "PostgreSQL", "Binary key/value map", "Rarely &mdash; JSONB covers the same ground with better functions"],
         ["CLOB + XMLTYPE", "Oracle", "Character large object", "Legacy migrations; prefer XMLTYPE for XQuery"]],
        widths=[0.22, 0.26, 0.26, 0.26], caption="Table 6.3 &mdash; XML is still the language of B2B contracts and banking messages.")
    s += code("""-- PostgreSQL: XPath and XPath extraction
CREATE TABLE invoices (id BIGINT, doc XML);
SELECT (xpath('/invoice/total/text()', doc))[1]::text::numeric AS total FROM invoices;

-- SQL Server: XML methods and typed columns
CREATE TABLE invoices (id BIGINT, doc XML);
SELECT doc.value('(/invoice/total)[1]', 'decimal(12,2)') AS total FROM invoices;

-- Oracle: extractValue, or XQuery with XMLTABLE for sets of rows""",
              title="universal · pulling a number out of XML")

    s.append(h2("6.4", "ARRAY types"))
    s += code("""-- PostgreSQL: true array types, any element type
CREATE TABLE articles (
    id   BIGINT PRIMARY KEY,
    tags TEXT[] NOT NULL DEFAULT '{}'
);
INSERT INTO articles VALUES (1, ARRAY['sql','analytics']);
SELECT * FROM articles WHERE 'sql' = ANY(tags);        -- membership, index-friendly with GIN
SELECT id, unnest(tags) AS tag FROM articles;          -- one row per tag
CREATE INDEX ix_articles_tags ON articles USING GIN (tags);

-- Multi-dimensional and fixed-length arrays are allowed
SELECT ARRAY[[1,2],[3,4]] AS matrix;

-- MySQL 8: no array type; use JSON arrays
SELECT * FROM articles WHERE JSON_CONTAINS(tags, '"sql"');

-- SQL Server: no array type; use OPENJSON over an NVARCHAR payload
SELECT a.id, t.value AS tag
FROM articles a CROSS APPLY OPENJSON(a.tags) AS t;

-- SQLite: json_each
SELECT a.id, j.value AS tag FROM articles a, json_each(a.tags) j;

-- Oracle: nested tables / VARRAY in PL/SQL; in SQL, use JSON arrays""",
              title="universal · arrays exist, and levels of emulation below them")
    s += callout("warn", "Arrays break the relational rules you rely on",
                 "You cannot foreign-key an array element, enforce uniqueness inside an array, or get a cheap "
                 "count per tag without unnesting. If tags are a dimension you report on, model them as a "
                 "junction table; keep the array only for display in a single row.")

    s.append(h2("6.5", "ENUM and SET"))
    s += code("""-- MySQL: ENUM is a column property with a fixed list
CREATE TABLE orders (
    id     BIGINT PRIMARY KEY,
    status ENUM('new','paid','shipped','cancelled') NOT NULL DEFAULT 'new'
);
-- Storage: 1 byte for ≤255 values, 2 bytes for ≤65,535
SELECT status, status + 0 AS ordinal FROM orders;   -- ordinals are 1-based and fragile
-- Adding a value rewrites the table on older versions; MySQL 8 appends in place at the end

-- MySQL SET: up to 64 values in a bit mask
CREATE TABLE prefs (channels SET('email','sms','push'));
INSERT INTO prefs VALUES ('email,push');

-- PostgreSQL: enum is a real type you can reuse
CREATE TYPE order_status AS ENUM ('new','paid','shipped','cancelled');
CREATE TABLE orders (id BIGINT PRIMARY KEY, status order_status NOT NULL DEFAULT 'new');
ALTER TYPE order_status ADD VALUE 'refunded';      -- works, but not inside a transaction block

-- Portable alternative: VARCHAR + CHECK (or a lookup table)
status VARCHAR(12) NOT NULL CHECK (status IN ('new','paid','shipped','cancelled'))""",
              title="mysql & postgresql · enums, three ways")
    s += tbl(
        ["Approach", "Pros", "Cons"],
        [["ENUM", "Compact (1&ndash;2 bytes), validated, readable in queries", "Changing the list needs DDL; ordering is by ordinal; hard to port"],
         ["VARCHAR + CHECK", "Portable, obvious, easy to change with a migration", "Uses more bytes; the CHECK must be maintained"],
         ["Lookup table + FK", "Values change without DDL, can carry labels and sort order", "Requires a join; slightly more complex ETL"],
         ["Integer status + code table", "Fastest joins, stable numbers", "Unreadable in raw queries; mapping always needed"]],
        widths=[0.22, 0.40, 0.38], caption="Table 6.4 &mdash; Four ways to constrain a status, and their trade-offs.")

    s.append(h2("6.6", "RANGE and MULTIRANGE (PostgreSQL)"))
    s += code("""-- Built-in range types: int4range, int8range, numrange, daterange, tsrange, tstzrange
CREATE TABLE bookings (
    id     BIGINT PRIMARY KEY,
    room   INT NOT NULL,
    during TSTZRANGE NOT NULL,
    EXCLUDE USING GIST (room WITH =, during WITH &&)   -- no overlaps, enforced by the DB
);

INSERT INTO bookings VALUES (1, 101, '[2026-10-27 09:00, 2026-10-27 11:00)');

-- Range operators
SELECT * FROM bookings WHERE during @> '2026-10-27 10:00+05:30'::timestamptz;  -- contains
SELECT * FROM bookings WHERE during && '[2026-10-27, 2026-10-28)'::tstzrange;  -- overlaps
SELECT upper(during) - lower(during) AS duration FROM bookings;

-- A range index makes overlap searches fast
CREATE INDEX ix_bookings_during ON bookings USING GIST (during);""",
              title="postgresql · ranges with exclusion constraints")
    s += callout("deep", "Why ranges beat two columns",
                 "Two columns (valid_from, valid_to) express a range but cannot be indexed as a single interval, "
                 "cannot be excluded from overlapping declaratively, and leave the boundary convention (inclusive "
                 "or not) ambiguous. A range type plus a GiST index plus an EXCLUDE constraint enforces "
                 "non-overlap in the database &mdash; a whole class of scheduling bugs disappears.")

    s.append(h2("6.7", "Spatial types"))
    s += tbl(
        ["Engine", "Types", "Coordinates", "Index"],
        [["PostgreSQL + PostGIS", "GEOMETRY, GEOGRAPHY", "Plane (SRID) and spheroid", "GiST"],
         ["MySQL 8", "GEOMETRY, POINT, LINESTRING, POLYGON + collection types", "SRID-aware", "SPATIAL (R-tree)"],
         ["SQL Server", "GEOMETRY, GEOGRAPHY", "Plane and spheroid", "SPATIAL"],
         ["Oracle", "SDO_GEOMETRY", "SRID-aware", "Spatial index (R-tree)"],
         ["SQLite", "SpatiaLite extension; or TEXT/REAL", "Depends", "R-tree virtual table"]],
        widths=[0.24, 0.36, 0.20, 0.20], caption="Table 6.5 &mdash; Spatial support by engine.")
    s += code("""-- PostgreSQL + PostGIS: distance and containment
CREATE TABLE stores (id INT PRIMARY KEY, name TEXT, location GEOGRAPHY(POINT, 4326));
INSERT INTO stores VALUES (1, 'Bandra', ST_MakePoint(72.8401, 19.0606)::geography);

SELECT name, ST_Distance(location, ST_MakePoint(72.8777,19.0760)::geography) / 1000 AS km
FROM stores ORDER BY km LIMIT 5;

-- Stores inside a service polygon
SELECT s.name FROM stores s
JOIN service_areas a ON ST_Contains(a.area, s.location::geometry)
WHERE a.city = 'Mumbai';

CREATE INDEX ix_stores_geo ON stores USING GIST (location);""",
              title="postgresql · geography in metres, geometry in degrees")

    s.append(h2("6.8", "Vectors and embeddings"))
    s.append(body(
        "Vector columns arrived because similarity search could not be expressed as a join. A vector is a fixed "
        "length array of floats; the index is built for approximate nearest-neighbour search."))
    s += code("""-- PostgreSQL with pgvector
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE docs (
    id        BIGINT PRIMARY KEY,
    content   TEXT,
    embedding VECTOR(1536)          -- dimension must match your model exactly
);
CREATE INDEX ix_docs_embedding ON docs USING hnsw (embedding vector_cosine_ops);

SELECT id, content, 1 - (embedding <=> '[0.01,0.02,...]'::vector) AS similarity
FROM docs ORDER BY embedding <=> '[...]'::vector LIMIT 5;

-- Oracle 23ai
CREATE TABLE docs (id NUMBER PRIMARY KEY, embedding VECTOR(1536, FLOAT32));
-- MySQL 9 / SQL Server 2025 also ship VECTOR types""",
              title="postgresql / oracle · vector columns and nearest-neighbour queries")
    s += callout("note", "Vectors are a schema decision too",
                 "The dimension is part of the type: change the embedding model and you need a new column and a "
                 "re-embedding job. Store the model name and version beside the vector, and keep the distance "
                 "metric consistent with the one the model was trained for.")

    s.append(h2("6.9", "User-defined types: domains, composites, extensions"))
    s += code("""-- PostgreSQL domains: validation that follows the type everywhere
CREATE DOMAIN positive_int AS INTEGER CHECK (VALUE > 0);
CREATE DOMAIN iso_country  AS CHAR(2) CHECK (VALUE ~ '^[A-Z]{2}$');

CREATE TABLE shipment (
    id       BIGINT PRIMARY KEY DEFAULT gen_random_uuid(),
    quantity positive_int NOT NULL,
    origin   iso_country  NOT NULL
);

-- Changing the rule once updates every column that uses the domain
ALTER DOMAIN positive_int ADD CONSTRAINT no_huge CHECK (VALUE < 100000);

-- Oracle: object types and nested tables
CREATE TYPE address_t AS OBJECT (line1 VARCHAR2(100), city VARCHAR2(50), country CHAR(2));

-- SQL Server: user-defined types are aliases, not constraints
CREATE TYPE phone FROM VARCHAR(20) NOT NULL;""",
              title="universal · reuse a rule instead of repeating a CHECK")

    s.append(h2("6.10", "Special-type pitfalls"))
    s += tbl(
        ["Pitfall", "Consequence", "Mitigation"],
        [["JSON queried without an index", "Full scan and parse on every request", "GIN index, generated column, or promote the key to a column"],
         ["Mixed types inside JSON", "\"1\" vs 1, silent no-match", "Validate with a JSON schema at ingest"],
         ["ENUM used for a changing list", "DDL per new value, ordering surprises", "Lookup table with a foreign key"],
         ["Array instead of a junction table", "Cannot join, count or constrain per element", "Model the many-to-many properly"],
         ["Spatial column without a spatial index", "Distance queries scan everything", "GIST/SPATIAL index and SRID consistency"],
         ["Vector of the wrong dimension", "Insert fails, or worse, silently truncated", "Assert the dimension in the type and in tests"],
         ["Domain changed without validation", "Old rows violate the new rule", "ALTER DOMAIN ... VALIDATE CONSTRAINT"]],
        widths=[0.27, 0.31, 0.42], caption="Table 6.6 &mdash; Seven ways structured types go wrong.")
    return s
