"""Part 7 — Casting, conversion and storage mechanics."""
from .theme import *

P = "7"


def ch7():
    s = []
    s += part(P, "Casting & Storage Mechanics", "Conversion rules, sargability, row layout and what a type change costs")
    s.append(lead(
        "Two columns with different types can still be comparable &mdash; and that is the problem. This part "
        "covers how engines convert values, which conversions are silent, which ones quietly disable an index, "
        "and how the bytes of a row are actually laid out on a page."))

    s.append(h2("7.1", "Implicit and explicit conversion"))
    s += tbl(
        ["Kind", "Example", "Happens when", "Risk"],
        [["Implicit", "WHERE varchar_col = 42", "The engine must compare different types", "Index disabled, wrong result, silent truncation"],
         ["Explicit", "CAST(x AS DECIMAL(10,2))", "You wrote the cast", "Visible; still can truncate or error"],
         ["Assignment", "INSERT INTO t(int_col) VALUES ('12x')", "Value converted to the column type", "MySQL non-strict: stores 12; strict: error"],
         ["Try-conversion", "TRY_CAST(x AS INT)", "You asked for NULL on failure", "Hides data problems unless logged"]],
        widths=[0.16, 0.30, 0.27, 0.27], caption="Table 7.1 &mdash; Four ways a value changes type.")
    s += code("""-- The cast syntax of five engines
SELECT CAST('2026-10-27' AS DATE);        -- standard SQL, everywhere

-- PostgreSQL: :: shorthand plus rich casting
SELECT '2026-10-27'::date, '12.5'::numeric(6,2), 42::text;

-- MySQL: CAST types are limited (SIGNED, UNSIGNED, DECIMAL, CHAR, DATE, DATETIME, TIME, JSON)
SELECT CAST('42' AS SIGNED), CAST(42 AS CHAR), CONVERT('12.5', DECIMAL(6,2));

-- SQL Server: CONVERT adds style numbers for dates
SELECT CONVERT(DATE, '27/10/2026', 103);      -- 103 = dd/mm/yyyy
SELECT TRY_CONVERT(INT, 'abc');                -- NULL instead of an error

-- Oracle: TO_DATE / TO_NUMBER / TO_CHAR with explicit formats
SELECT TO_DATE('27-10-2026','DD-MM-YYYY'), TO_NUMBER('1,234.5','9G999D9') FROM dual;""",
              title="universal · casting syntax")

    s.append(h3("Conversion precedence"))
    s.append(body(
        "When types disagree, engines rank them and convert the lower-ranked side. SQL Server's precedence "
        "(simplified): sql_variant &gt; datetimeoffset &gt; datetime2 &gt; datetime &gt; smalldatetime &gt; date "
        "&gt; time &gt; float &gt; decimal &gt; money &gt; bigint &gt; int &gt; smallint &gt; tinyint &gt; "
        "bit &gt; nvarchar &gt; varchar. The practical consequence: comparing an INT column to an NVARCHAR "
        "parameter converts the <b>column</b> to NVARCHAR, and the index on it cannot be seeked."))
    s += code("""-- SQL Server: the implicit conversion that kills an index
-- orders.order_id is INT; @id is passed as NVARCHAR by the driver
SELECT * FROM orders WHERE order_id = @id;
-- Execution plan: CONVERT_IMPLICIT(int, @id, 0) applied to every row → scan

-- Fix: make the parameter the same type as the column
EXEC sp_executesql N'SELECT * FROM orders WHERE order_id = @id', N'@id INT', @id = 42;

-- Or catch it in advance
SELECT t.name AS table_name, c.name AS column_name, s.name AS statistics_name
FROM sys.stats s
JOIN sys.stats_columns sc ON s.object_id = sc.object_id AND s.stats_id = sc.stats_id
JOIN sys.columns c ON c.object_id = sc.object_id AND c.column_id = sc.column_id
JOIN sys.tables t ON t.object_id = s.object_id
WHERE s.user_created = 1;""",
              title="sql server · implicit conversion is the classic performance bug")

    s.append(h2("7.2", "Sargability: what makes an index usable"))
    s += tbl(
        ["Predicate", "Index usable?", "Rewrite as"],
        [["col = 42", "Yes", "&mdash;"],
         ["col > 100 AND col < 200", "Yes (range)", "&mdash;"],
         ["col LIKE 'abc%'", "Yes", "&mdash;"],
         ["col LIKE '%abc'", "No", "Full-text or trigram index"],
         ["CAST(col AS date) = '2026-10-27'", "No", "col >= '2026-10-27' AND col < '2026-10-28'"],
         ["col + 0 = 42", "No", "col = 42"],
         ["UPPER(col) = 'ABC'", "No", "Expression index on UPPER(col)"],
         ["int_col = '42' (SQL Server)", "Maybe (implicit convert)", "Match the parameter type"],
         ["COALESCE(col, 'x') = 'x'", "No", "col IS NULL OR col = 'x'"],
         ["col IS NOT NULL", "Rarely useful", "Add a filtered index if needed"],
         ["a.col = b.col", "Hash/merge join", "Ensure both sides share the same type"]],
        widths=[0.34, 0.22, 0.44], caption="Table 7.2 &mdash; Rewrites that restore an index seek.")
    s += callout("best", "The three-second sargability check",
                 "Look at every WHERE and JOIN: is there a function, arithmetic or a cast on the column? If yes, "
                 "move it to the constant side, or create an expression/functional index. No other single change "
                 "improves query performance as often.")

    s.append(h2("7.3", "Type conversion tables worth knowing"))
    s += tbl(
        ["From &rarr; To", "Behaviour", "Example"],
        [["DECIMAL &rarr; INT", "Rounds (PostgreSQL, MySQL) or truncates (SQL Server CAST)", "CAST(2.7 AS INT): 3 on PG, 2 on SQL Server"],
         ["FLOAT &rarr; DECIMAL", "Takes the decimal expansion of the binary value", "CAST(0.1::float8 AS numeric) = 0.1000000000000000055511151231257827"],
         ["TEXT &rarr; DATE", "Parsed per engine; ISO format is the only safe one", "'27-10-2026' fails without a format mask"],
         ["DATE &rarr; TEXT", "Formatted using the session's default", "Never rely on the default in ETL output"],
         ["TIMESTAMP &rarr; DATE", "Truncates, using the session zone", "The DST day-shift bug from Part 4"],
         ["BIGINT &rarr; INT", "Overflow error (strict) or wrap (some engines)", "Always check the maximum first"],
         ["JSONB &rarr; TEXT", "Serialised, keys reordered", "Not byte-identical to the input"],
         ["CHAR &rarr; VARCHAR", "Trailing space handling differs", "TRIM on write if it matters"],
         ["UNSIGNED &rarr; SIGNED (MySQL)", "Reinterprets the bits unless cast", "CAST(u AS SIGNED) not needed in comparisons, but in arithmetic"]],
        widths=[0.24, 0.36, 0.40], caption="Table 7.3 &mdash; Conversions that surprise people.")
    s += code("""-- Safe conversion pattern for messy source data
-- PostgreSQL
SELECT CASE WHEN raw_value ~ '^[0-9]+$' THEN raw_value::int END AS parsed FROM staging;

-- SQL Server
SELECT TRY_CAST(raw_value AS INT) AS parsed,
       CASE WHEN TRY_CAST(raw_value AS INT) IS NULL THEN raw_value END AS rejected
FROM staging;

-- MySQL 8
SELECT REGEXP_REPLACE(raw_value, '[^0-9]', '') + 0 AS digits_only FROM staging;

-- Oracle
SELECT TO_NUMBER(REGEXP_SUBSTR(raw_value, '^[0-9]+$')) FROM staging;""",
              title="universal · never cast unvalidated text with a plain CAST")
    s += callout("warn", "Casting in a pipeline is a data-quality signal",
                 "Every value that fails a cast is a defect upstream. Log rejected rows to a quarantine table with "
                 "the reason, alert on the count, and never use TRY_CAST to silently discard them &mdash; that is how "
                 "row counts quietly drop between source and warehouse.")

    s.append(h2("7.4", "Storage mechanics: how a row is laid out"))
    s.append(body(
        "Rows live in fixed-size pages (8&nbsp;KB in SQL Server and PostgreSQL, 16&nbsp;KB in InnoDB, 8&nbsp;KB "
        "in Oracle). A page holds a header, item pointers and rows. Two details decide how many rows fit: "
        "<b>nullability</b> and <b>alignment padding</b>."))
    s += bl([
        "<b>NULL bitmap.</b> A bitmap (1 bit per nullable column) marks which columns are NULL. In SQL Server and "
        "PostgreSQL it is present only if the table has nullable columns &mdash; a table of NOT NULL columns saves "
        "a byte or two per row and makes some operations cheaper.",
        "<b>Alignment.</b> Fixed-width columns are padded to their alignment (2, 4 or 8 bytes). Ordering columns in "
        "a row can reduce padding, but most engines reorder internally, so micro-optimising the order rarely "
        "helps.",
        "<b>Off-page storage.</b> Large values move to overflow/TOAST pages and leave a pointer: 20 bytes in "
        "PostgreSQL, or a 24-byte pointer in SQL Server row-overflow.",
        "<b>Variable-length updates.</b> Growing a VARCHAR can force the row to move to another page (forwarded "
        "records in SQL Server, row migration in InnoDB), which is why updates are slower than inserts.",
        "<b>Compression.</b> Page or row compression can halve the footprint of a wide table, but only for "
        "read-mostly data &mdash; and only if the types compress well (integers and dates compress far better than "
        "already-compressed binary).",
    ])
    s += code("""-- Measuring real row cost
-- PostgreSQL
SELECT pg_size_pretty(pg_relation_size('fact_sales')) AS table_size,
       pg_size_pretty(pg_indexes_size('fact_sales'))  AS index_size,
       pg_size_pretty(pg_total_relation_size('fact_sales')) AS total;

SELECT avg_width, sum(avg_width) OVER () AS row_width_estimate
FROM pg_stats WHERE tablename = 'fact_sales' ORDER BY avg_width DESC;

-- MySQL
SELECT table_name, data_length, index_length, avg_row_length, table_rows
FROM information_schema.tables WHERE table_schema = DATABASE();

-- SQL Server
EXEC sp_spaceused 'fact_sales';
SELECT * FROM sys.dm_db_index_physical_stats(
    DB_ID(), OBJECT_ID('fact_sales'), NULL, NULL, 'DETAILED');""",
              title="universal · measure the row, do not guess it")

    s.append(h2("7.5", "What a type change costs"))
    s += tbl(
        ["Change", "Cost", "Can it be done online?"],
        [["Widen VARCHAR(50) &rarr; (100)", "Metadata only on PostgreSQL/SQL Server; table rebuild on older MySQL", "Usually yes"],
         ["INT &rarr; BIGINT", "Rebuild table + every index on the column, and every referencing FK", "Rarely; needs a maintenance window"],
         ["DATETIME &rarr; TIMESTAMPTZ", "Rebuild, and the interpretation of every row changes", "No; needs a data migration plan"],
         ["FLOAT &rarr; DECIMAL", "Rebuild plus rounding decisions per row", "No; values change"],
         ["VARCHAR &rarr; TEXT", "Metadata only on PostgreSQL; rebuild or off-page on MySQL", "Depends"],
         ["Add a CHECK constraint", "Scan to validate (unless NOT VALID / NOVALIDATE)", "Yes, validate later"],
         ["Change charset lorem &rarr; utf8mb4", "Full rebuild, 1&ndash;4&times; disk during the operation", "Only with online DDL tooling"],
         ["Reorder or drop a column", "Rebuild on most engines", "No"]],
        widths=[0.28, 0.44, 0.28], caption="Table 7.4 &mdash; Some type changes are metadata, others are migrations.")
    s += code("""-- PostgreSQL: add a constraint without blocking writes
ALTER TABLE orders ADD CONSTRAINT positive_amount CHECK (amount > 0) NOT VALID;
ALTER TABLE orders VALIDATE CONSTRAINT positive_amount;      -- takes a lighter lock

-- Oracle equivalent
ALTER TABLE orders ADD CONSTRAINT positive_amount CHECK (amount > 0) ENABLE NOVALIDATE;

-- MySQL 8: online DDL, and what it still cannot do in place
ALTER TABLE orders MODIFY amount DECIMAL(12,2), ALGORITHM=INPLACE, LOCK=NONE;
-- widening INT → BIGINT still rebuilds; use gh-ost / pt-online-schema-change

-- SQL Server: an online index rebuild for the dependent index
ALTER INDEX ALL ON orders REBUILD WITH (ONLINE = ON);""",
              title="universal · making a type change survivable")

    s.append(h2("7.6", "Partitioning and clustering follow the type"))
    s += bl([
        "<b>Partition on dates, not on text.</b> A DATE/TIMESTAMP key enables range pruning and rolling windows; "
        "a VARCHAR date prevents both.",
        "<b>Clustered index order is physical order.</b> In SQL Server, a random UNIQUEIDENTIFIER clustered key "
        "fragments the table; in InnoDB the primary key is the table, so a wide key widens every secondary index.",
        "<b>Hash partitioning</b> on an INTEGER or UUID spreads writes but makes range queries scan every "
        "partition. Pick the partition key from the dominant filter, not from the primary key.",
        "<b>Statistics depend on type.</b> Low-cardinality columns (booleans, small enums) make poor histograms; "
        "the optimiser may ignore them entirely. That is fine for filters, bad for joins.",
    ])

    s.append(h2("7.7", "Case study: a 40&times; slower report, fixed by two type changes"))
    s.append(body(
        "A daily revenue report took 4 minutes 20 seconds. The SQL was unchanged for a year; the table had grown "
        "from 2 million to 90 million rows. The execution plan showed two sequential scans and a nested loop "
        "with 90 million iterations."))
    s += tbl(
        ["Finding", "Cause", "Fix", "Effect"],
        [["Seq scan despite an index on sale_date", "<font face='DM' size='7.6'>WHERE sale_date::text LIKE '2026-10%'</font> &mdash; a cast on the column",
          "Range predicate on the raw column", "Index scan, 3 seconds"],
         ["Join hash spilled to disk", "customer_id INT joined to a VARCHAR(20) natural key", "Join on the INTEGER surrogate key", "Hash join in memory"],
         ["Nested loop over 90 M rows", "Implicit cast from a VARCHAR parameter to an INT column", "Typed parameter, same type as the column", "Nested loop became an index seek"],
         ["Report still slow at month end", "No partition pruning; one 90 M row table", "Range partition by month on business_date", "Scans only the month"],
         ["Totals disagreed with finance", "FLOAT amounts", "DECIMAL(14,2) net_amount", "Cent-level agreement"]],
        widths=[0.26, 0.30, 0.24, 0.20], caption="Table 7.5 &mdash; Every fix is a type decision, not a query trick.")
    s += callout("tip", "The order to optimise",
                 "1) Fix the types. 2) Remove functions and casts from predicates. 3) Add the right index. "
                 "4) Partition. 5) Only then consider rewriting the query or adding a cache. Most teams start at "
                 "step 5.")
    return s
