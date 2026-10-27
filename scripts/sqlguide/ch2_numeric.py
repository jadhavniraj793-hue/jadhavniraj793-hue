"""Part 2 — Numeric types."""
from .theme import *

P = "2"


def ch2():
    s = []
    s += part(P, "Numeric Types", "Integers, exact decimals and floating point &mdash; and the three bugs they cause")
    s.append(lead(
        "Numbers are the easiest types to get nearly right and the easiest to make quietly wrong. This part "
        "covers every numeric family, the exact ranges and byte costs, and the four failures that show up in "
        "real analysis: overflow, integer division, float error and scale mismatch."))

    s.append(h2("2.1", "The numeric family tree"))
    s += tbl(
        ["Branch", "Behaviour", "Types", "Use for"],
        [["Integer", "Whole numbers, exact, no fractional part", "TINYINT / SMALLINT / INT / BIGINT, SERIAL, IDENTITY",
          "IDs, counts, quantities, flags"],
         ["Exact decimal", "Fixed number of decimal digits, exact arithmetic",
          "DECIMAL(p,s), NUMERIC(p,s), NUMBER(p,s), MONEY",
          "Money, tax, percentages, measurements"],
         ["Approximate", "Binary floating point, fast, not exact",
          "FLOAT, REAL, DOUBLE PRECISION, BINARY_FLOAT / BINARY_DOUBLE",
          "Scientific data, ratios, ML features"],
         ["Bit", "Bit strings, used as flags or masks", "BIT, BIT(n), VARBIT",
          "Feature flags, permission masks"],
         ["Auto-numbering", "Sequence-backed generators", "AUTO_INCREMENT, IDENTITY, SERIAL, SEQUENCE",
          "Surrogate keys"]],
        widths=[0.19, 0.25, 0.32, 0.24], caption="Table 2.1 &mdash; Five branches of the numeric tree.")

    s.append(h2("2.2", "Integer types: exact by definition"))
    s.append(body(
        "Integers are stored in two's complement. A signed type of <i>n</i> bits holds "
        "&minus;2<super>(n&minus;1)</super> to 2<super>(n&minus;1)</super>&minus;1; unsigned holds "
        "0 to 2<super>n</super>&minus;1. Know the four boundaries below and you will never pick a type too "
        "small."))
    s += tbl(
        ["Type", "Bits", "Signed range", "Unsigned range", "Bytes"],
        [["TINYINT", "8", "&minus;128 &hellip; 127", "0 &hellip; 255", "1"],
         ["SMALLINT", "16", "&minus;32,768 &hellip; 32,767", "0 &hellip; 65,535", "2"],
         ["MEDIUMINT", "24", "&minus;8,388,608 &hellip; 8,388,607", "0 &hellip; 16,777,215", "3"],
         ["INT / INTEGER", "32", "&minus;2,147,483,648 &hellip; 2,147,483,647", "0 &hellip; 4,294,967,295", "4"],
         ["BIGINT", "64", "&plusmn;9.22 &times; 10<super>18</super>", "0 &hellip; 1.84 &times; 10<super>19</super>", "8"]],
        widths=[0.19, 0.08, 0.33, 0.30, 0.10], caption="Table 2.2 &mdash; Integer widths. MEDIUMINT is MySQL-only.")
    s += bl([
        "<b>PostgreSQL</b> has SMALLINT, INTEGER, BIGINT; its SMALLSERIAL, SERIAL and BIGSERIAL are shorthand "
        "for 2, 4 and 8-byte columns with an owned sequence.",
        "<b>SQL Server</b> has TINYINT (0&ndash;255, <i>unsigned only</i>), SMALLINT, INT and BIGINT. There is no "
        "UNSIGNED keyword.",
        "<b>Oracle</b> has no integer types at all: NUMBER(38) is the closest, and NUMBER(p,0) is how you "
        "declare a p-digit integer. Storage is variable-length, 1&ndash;22 bytes.",
        "<b>SQLite</b> has one INTEGER type with up to 8 bytes; INTEGER PRIMARY KEY becomes the rowid.",
        "<b>MySQL</b> adds UNSIGNED and ZEROFILL modifiers, plus MEDIUMINT.",
    ])

    s.append(h3("Picking an integer width"))
    s += tbl(
        ["Column", "Right type", "Why not bigger"],
        [["order_id on a retailer doing 5,000 orders/day", "INT", "~1.2 M rows/year; INT lasts centuries"],
         ["event_id on a clickstream", "BIGINT", "Billions per month; wrap-around risk is real"],
         ["rating 1&ndash;5", "TINYINT", "1 byte, CHECK (rating BETWEEN 1 AND 5)"],
         ["age in years", "SMALLINT", "TINYINT is fine but SMALLINT leaves room for 200+ records"],
         ["year", "SMALLINT &mdash; or DATE", "A year is not an integer conceptually; see Part 4"],
         ["quantity", "INT", "Bulk orders exceed 32,767 regularly"],
         ["flags (is_active)", "BOOLEAN, not INTEGER", "Meaning, not bytes, is the reason"]],
        widths=[0.40, 0.26, 0.34], caption="Table 2.3 &mdash; Width is a range decision, not a style decision.")

    s += callout("trap", "Unsigned is not portable and not free",
                 "UNSIGNED doubles the positive range but removes negative numbers, breaks subtraction "
                 "(0&nbsp;&minus;&nbsp;1 raises an error or wraps), and has no equivalent in PostgreSQL, SQL "
                 "Server or Oracle. Use it for values that cannot ever be negative and where you control every "
                 "consumer: status flags, counts, quantities.")

    s.append(h3("Overflow: the bug that only appears in year three"))
    s += code("""-- MySQL, non-strict mode: silently clamps to the maximum
CREATE TABLE t (stock SMALLINT);           -- max 32,767
INSERT INTO t VALUES (40000);              -- stored as 32767, warning raised
SELECT * FROM t;                            -- 32767  ← data loss, no error

-- PostgreSQL: loud error instead, which is what you want
INSERT INTO t VALUES (40000);
ERROR:  smallint out of range

-- INTEGER wrap-around on a counter (MySQL, non-strict)
UPDATE counters SET hits = hits + 1;        -- 2147483647 + 1 → -2147483648
-- Fix: BIGINT for any monotonic counter that runs forever.""",
              title="universal · overflow behaves differently per engine")
    s += callout("best", "The counter rule",
                 "Any column that only ever increases &mdash; event IDs, page views, invoice numbers, sequence "
                 "values &mdash; is BIGINT. A 4-byte INT reaching 2.1 billion is not an edge case on a table "
                 "growing 5 million rows a day (420 days).")

    s.append(h2("2.3", "Auto-numbering: AUTO_INCREMENT, IDENTITY, SERIAL"))
    s.append(body(
        "Surrogate keys need a generator. Every engine has one; the semantics differ more than the syntax "
        "suggests, especially around gaps, resets and explicit inserts."))
    s += tbl(
        ["Engine", "Declare", "Notes"],
        [["MySQL", "id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY",
          "Counter lives in table metadata; gaps after rollbacks; innodb_autoinc_lock_mode controls concurrency"],
         ["PostgreSQL", "id BIGINT GENERATED ALWAYS AS IDENTITY",
          "Preferred since PG 10. GENERATED BY DEFAULT allows explicit inserts; SERIAL is the legacy equivalent"],
         ["SQL Server", "id BIGINT IDENTITY(1,1) PRIMARY KEY",
          "Gaps are normal and expected; SET IDENTITY_INSERT ON to restore data"],
         ["Oracle 12c+", "id NUMBER GENERATED ALWAYS AS IDENTITY",
          "Legacy code uses sequences with triggers; IDENTITY is now standard"],
         ["SQLite", "id INTEGER PRIMARY KEY",
          "Alias for rowid; AUTOINCREMENT adds a separate monotonic counter (rarely needed)"]],
        widths=[0.16, 0.44, 0.40], caption="Table 2.4 &mdash; Six ways to say &ldquo;number my rows&rdquo;.")
    s += code("""-- portable-ish sequence usage (PostgreSQL / Oracle / SQL Server 2012+)
CREATE SEQUENCE order_seq START WITH 1000 INCREMENT BY 1;

INSERT INTO orders (order_id, customer_id)
VALUES (NEXT VALUE FOR order_seq, 42);        -- SQL Server / Oracle syntax

-- PostgreSQL equivalent
INSERT INTO orders (order_id, customer_id)
VALUES (nextval('order_seq'), 42);""", title="sequences are objects, not column properties")
    s += callout("warn", "Identity columns are not gapless",
                 "A rolled-back transaction consumes its number. Auditors who require gapless invoice numbers "
                 "need a different mechanism (a locked counter table or a sequence with a business rule), not a "
                 "bigger identity column. Never promise sequential meaning to a number that is only unique.")

    s.append(h2("2.4", "DECIMAL and NUMERIC: exact by declaration"))
    s.append(body(
        "DECIMAL(p,s) stores <b>p</b> total digits, of which <b>s</b> are to the right of the decimal point. "
        "That leaves p&minus;s integer digits. The scale is enforced on write: the engine rounds values with "
        "more decimals and rejects values with too many integer digits."))
    s += tbl(
        ["Declaration", "Integer digits", "Decimals", "Largest value", "Use for"],
        [["DECIMAL(5,2)", "3", "2", "999.99", "Percentages, small rates"],
         ["DECIMAL(7,2)", "5", "2", "99,999.99", "Unit prices"],
         ["DECIMAL(10,2)", "8", "2", "99,999,999.99", "Order totals"],
         ["DECIMAL(12,2)", "10", "2", "9,999,999,999.99", "Daily revenue"],
         ["DECIMAL(19,4)", "15", "4", "999,999,999,999.9999", "Banking amounts, FX rates"],
         ["DECIMAL(38,10)", "28", "10", "1e28 with 10 dp", "Scientific/financial analytics"],
         ["DECIMAL(38,0)", "38", "0", "1e38", "Big counters, hashes as numbers"]],
        widths=[0.22, 0.15, 0.12, 0.26, 0.25], caption="Table 2.5 &mdash; Choose p and s from the business rule, not by habit.")

    s += code("""-- What the scale actually does on write
CREATE TABLE price_demo (price DECIMAL(5,2));

INSERT INTO price_demo VALUES (123.456);   -- → 123.46  (rounded, not truncated)
INSERT INTO price_demo VALUES (1234.00);   -- → error on PostgreSQL: numeric field overflow
                                            --   MySQL non-strict: 999.99 (clamped!)
INSERT INTO price_demo VALUES (99);        -- → 99.00

-- Scale is part of the type: DECIMAL(5,2) ≠ DECIMAL(5,3)
SELECT CAST(1 AS DECIMAL(5,2)) / CAST(3 AS DECIMAL(5,2));  -- 0.33, not 0.3333""",
              title="universal · scale is enforced, and it rounds")
    s += bl([
        "<b>Limits:</b> MySQL allows p &le; 65, s &le; 30. PostgreSQL NUMERIC allows up to 131,072 digits before "
        "and 16,383 after the point (declared precision is only enforced when you specify it). SQL Server allows "
        "precision 1&ndash;38. Oracle NUMBER allows 1&ndash;38 significant digits. SQLite stores NUMERIC as REAL "
        "or INTEGER internally, so exactness is best-effort unless you use STRICT tables with careful values.",
        "<b>Storage:</b> MySQL packs DECIMAL in 4-byte groups (about 4 bytes per 9 digits); each decimal digit "
        "costs roughly 0.44 bytes. SQL Server uses 5, 9, 13 or 17 bytes by precision. PostgreSQL NUMERIC is "
        "variable, close to 2 bytes per 4 digits plus overhead. Oracle NUMBER is 1&ndash;22 bytes.",
        "<b>Division inherits scale.</b> In MySQL, DECIMAL division adds 4 digits of scale (div_precision_increment) "
        "unless you specify otherwise. Always CAST the result to the scale the report needs.",
    ])

    s.append(h3("When the scale is wrong, the fix is expensive"))
    s += code("""-- Wrong: two decimals for a unit price recorded per thousand units
unit_price DECIMAL(10,2)          -- 0.0125 becomes 0.01, a 20% error at volume

-- Right: carry the precision you actually receive
unit_price DECIMAL(12,6)

-- Wrong: FX conversions rounded at every hop
amount_inr = ROUND(amount_usd * rate, 2)                  -- drift accumulates per row
-- Right: keep full precision internally, round once at presentation
ROUND(SUM(amount_usd * rate), 2)""",
              title="universal · precision loss is not reversible")
    s += callout("best", "Money rule of thumb",
                 "Money is DECIMAL(19,4) or DECIMAL(12,2) depending on currency magnitude, always paired with an "
                 "ISO-4217 CHAR(3) currency column. Never store two currencies in one amount column without the "
                 "currency, and never store money as a float, no matter what the vendor's sample schema does.")

    s.append(h2("2.5", "FLOAT, REAL and DOUBLE PRECISION"))
    s.append(body(
        "Approximate types follow IEEE&nbsp;754: a sign, an exponent and a mantissa. They cover an enormous "
        "range in a few bytes, but they cannot represent most decimal fractions exactly, because binary "
        "fractions are sums of 1/2, 1/4, 1/8&hellip; and 0.1 is not."))
    s += tbl(
        ["Type", "Bytes", "Significant digits", "Approx. range", "Aliases"],
        [["REAL / FLOAT4", "4", "~7", "1e&minus;38 to 1e38", "MySQL FLOAT, Oracle BINARY_FLOAT, SQL Server REAL"],
         ["DOUBLE PRECISION", "8", "~15&ndash;17", "1e&minus;308 to 1e308",
          "MySQL DOUBLE, Oracle BINARY_DOUBLE, SQL Server FLOAT"],
         ["FLOAT(n)", "4 or 8", "n&nbsp;&le;&nbsp;24 &rarr; 4 bytes", "as above",
          "SQL Server: precision-driven; Oracle FLOAT is binary precision"]],
        widths=[0.22, 0.10, 0.17, 0.25, 0.26], caption="Table 2.6 &mdash; Approximate types and their aliases.")
    s += code("""SELECT 0.1 + 0.2 = 0.3;             -- FALSE on every engine
SELECT 0.1::float8 + 0.2::float8;    -- 0.30000000000000004 (PostgreSQL output)

-- Accumulation: 10 million additions of 0.01
SELECT SUM(x) FROM (SELECT 0.01 AS x FROM generate_series(1,10000000)) t;
-- 99999.99999999975 instead of 100000.00

-- Comparisons must use a tolerance, never equality
SELECT * FROM measurements
WHERE ABS(actual - expected) < 1e-9;

-- Money as float: rounding drift that a finance team will find
SELECT ROUND(SUM(amount)::numeric, 2) FROM payments;   -- 1,048,576.00 vs 1,048,575.97""",
              title="universal · the classic float demonstrations")
    s += callout("deep", "Why 0.1 is not 0.1",
                 "0.1<sub>10</sub> = 0.0001100110011&hellip;<sub>2</sub>, a repeating fraction in base two. An "
                 "8-byte double keeps 53 bits and rounds the rest, so the stored value is 0.100000000000000005551"
                 "1151231257827021181583404541015625. Every arithmetic operation then carries that tiny error, "
                 "and the error is invisible until you compare, group or sum it.")
    s += bl([
        "<b>Use floats for</b> physical measurements, sensor readings, probabilities, ML features, ratios where "
        "6&ndash;15 significant digits are enough, and any value that is already an approximation.",
        "<b>Never use floats for</b> money, invoice totals, tax, points, quotas, or anything reconciled to the "
        "cent. If a human will check the arithmetic down to paise, the type is DECIMAL.",
        "<b>Never join or deduplicate on a float.</b> Two values that print the same can differ in the last bit. "
        "Round to a fixed scale first, or use a tolerance.",
        "<b>Watch the float-to-integer conversion.</b> CAST(2.9999999 AS INT) truncates to 2, not 3 "
        "(PostgreSQL rounds: 3). Use ROUND explicitly.",
    ])

    s.append(h2("2.6", "MONEY types (and why most teams avoid them)"))
    s += tbl(
        ["Engine", "Type", "Bytes / range", "Verdict"],
        [["SQL Server", "MONEY / SMALLMONEY", "8 / 4 bytes, 4 decimal places, max ~922 trillion",
          "Faster but fixed at 4 dp and locale-independent; prefer DECIMAL(19,4)"],
         ["PostgreSQL", "MONEY", "8 bytes, locale-aware formatting, fractional cents",
          "Deprecated in practice: rounds to locale, does not play well with numeric functions"],
         ["MySQL", "None", "&mdash;", "Use DECIMAL(19,4)"],
         ["Oracle", "None", "&mdash;", "Use NUMBER(19,4)"],
         ["SQLite", "None", "&mdash;", "Store integer minor units (paise/cents) for exactness"]],
        widths=[0.14, 0.19, 0.30, 0.37], caption="Table 2.7 &mdash; MONEY exists, and usually you should not use it.")
    s += callout("tip", "The integer-cents pattern",
                 "Store amounts as BIGINT minor units (12.34 &rarr; 1234) when you need exact, "
                 "engine-portable arithmetic: no scale ambiguity, no rounding mode disputes, exact equality. "
                 "Divide by 100 only in the presentation layer &mdash; and only once.")

    s.append(h2("2.7", "Integer arithmetic and division: the silent zero"))
    s.append(body(
        "Integer division truncates. In SQL, the result type of a/b follows the operands, not your expectation, "
        "which is why a percentage column quietly becomes 0 or 1."))
    s += code("""SELECT 7 / 2;                    -- MySQL: 3    SQL Server: 3    PostgreSQL: 3
SELECT 7 / 2.0;                  -- 3.5 (one operand decimal → decimal result)
SELECT 7.0 / 2;                  -- 3.5
SELECT CAST(7 AS DECIMAL(10,2)) / 2;   -- 3.500000 (scale per engine rules)

-- The classic broken conversion rate
SELECT clicks / impressions AS ctr FROM campaign;          -- always 0
SELECT clicks * 100.0 / NULLIF(impressions, 0) AS ctr_pct  -- correct, and safe
FROM campaign;

-- Integer averages lose the fraction
SELECT AVG(rating) FROM reviews;      -- PostgreSQL: 4.25 (numeric)
                                      -- SQL Server: 4  (integer AVG!) → CAST first
SELECT AVG(CAST(rating AS DECIMAL(5,2))) FROM reviews;""",
              title="universal · division depends on operand types, not on hope")
    s += callout("trap", "SQL Server integer AVG",
                 "In SQL Server, AVG over an INT column returns an INT, so 4.25 becomes 4. MySQL, PostgreSQL and "
                 "Oracle return a decimal. If your dashboards must agree across engines, divide by 1.0 or cast "
                 "the column explicitly.")

    s.append(h2("2.8", "Rounding, truncation and the functions you need"))
    s += tbl(
        ["Intent", "MySQL", "PostgreSQL", "SQL Server", "Oracle"],
        [["Round half away from zero", "ROUND(x, n)", "ROUND(x::numeric, n)", "ROUND(x, n)", "ROUND(x, n)"],
         ["Truncate toward zero", "TRUNCATE(x, n)", "TRUNC(x, n)", "ROUND(x, n, 1)", "TRUNC(x, n)"],
         ["Always up / down", "CEIL / FLOOR", "CEIL / FLOOR", "CEILING / FLOOR", "CEIL / FLOOR"],
         ["Modulo", "MOD(a,b) or a % b", "MOD(a,b) or a % b", "a % b", "MOD(a,b)"],
         ["Power / square root", "POWER, SQRT", "POWER, SQRT", "POWER, SQRT", "POWER, SQRT"],
         ["Absolute value", "ABS(x)", "ABS(x)", "ABS(x)", "ABS(x)"],
         ["Safe divide", "NULLIF(b,0)", "NULLIF(b,0)", "NULLIF(b,0)", "NULLIF(b,0)"],
         ["Cast to integer", "CAST(x AS SIGNED)", "x::integer or CAST", "CAST(x AS INT)", "CAST(x AS NUMBER)"]],
        widths=[0.24, 0.19, 0.20, 0.19, 0.18], caption="Table 2.8 &mdash; Numeric functions you will actually use.")
    s.append(body(
        "Rounding modes matter legally and financially. MySQL and PostgreSQL ROUND use <i>half away from zero</i> "
        "for exact types; Python and many BI tools use <i>banker's rounding</i> (half to even). 2.5 becomes 3 in "
        "SQL and 2 in pandas. When a finance team says &ldquo;the numbers don't match the spreadsheet&rdquo;, this "
        "is usually why."))

    s.append(h2("2.9", "BIT and bit masks"))
    s += code("""-- MySQL: BIT(M), M ≤ 64, stored as a bit string
CREATE TABLE feature_flags (user_id INT, flags BIT(8));
INSERT INTO feature_flags VALUES (1, b'00000101');       -- flags 0 and 2 set
SELECT user_id FROM feature_flags WHERE flags & b'00000100';  -- bit 2 present

-- PostgreSQL: the native type is BIT / VARBIT, tested with B'...'
SELECT B'1010' & B'0010';         -- 0010

-- Modern alternative: separate BOOLEAN columns or a JSON array of feature names
-- Bit masks are compact but opaque to BI tools and unreadable in a WHERE clause""",
              title="mysql & postgresql · bit strings")
    s += callout("note", "BIT in SQL Server means something else",
                 "In SQL Server, BIT is a 1-bit boolean-like type (0, 1 or NULL). In MySQL and PostgreSQL, BIT(n) is "
                 "a bit string. Same word, different concept &mdash; a classic portability trap.")

    s.append(h2("2.10", "Engine cheat sheet: numeric types"))
    s += tbl(
        ["Need", "MySQL 8", "PostgreSQL 16", "SQL Server", "Oracle 23ai", "SQLite"],
        [["1-byte integer", "TINYINT", "&mdash;", "TINYINT (0&ndash;255)", "NUMBER(3)", "INTEGER"],
         ["2-byte integer", "SMALLINT", "SMALLINT", "SMALLINT", "NUMBER(5)", "INTEGER"],
         ["4-byte integer", "INT", "INTEGER", "INT", "NUMBER(10)", "INTEGER"],
         ["8-byte integer", "BIGINT", "BIGINT", "BIGINT", "NUMBER(19)", "INTEGER"],
         ["Exact decimal", "DECIMAL(p,s)", "NUMERIC(p,s)", "DECIMAL(p,s)", "NUMBER(p,s)", "NUMERIC"],
         ["4-byte float", "FLOAT", "REAL", "REAL", "BINARY_FLOAT", "REAL"],
         ["8-byte float", "DOUBLE", "DOUBLE PRECISION", "FLOAT", "BINARY_DOUBLE", "REAL"],
         ["Money", "&mdash;", "MONEY (avoid)", "MONEY", "&mdash;", "&mdash;"],
         ["Auto key", "AUTO_INCREMENT", "IDENTITY / SERIAL", "IDENTITY", "IDENTITY / SEQUENCE", "INTEGER PRIMARY KEY"]],
        widths=[0.20, 0.17, 0.20, 0.17, 0.15, 0.11], caption="Table 2.9 &mdash; The same idea, six spellings.", size=7.4)

    s.append(h2("2.11", "Numeric pitfalls checklist"))
    s += tbl(
        ["Symptom", "Cause", "Fix"],
        [["Total off by a cent after many rows", "FLOAT used for money", "DECIMAL(19,4) or integer minor units"],
         ["Percentage always 0", "Integer division", "Multiply by 100.0 or CAST to DECIMAL"],
         ["&ldquo;Value too long&rdquo; for a price", "Scale p&minus;s too small", "Widen the integer part: DECIMAL(12,2)"],
         ["Negative stock after a sale", "UNSIGNED subtraction", "SIGNED type plus a CHECK (qty &ge; 0)"],
         ["Counter became negative", "INT overflow", "BIGINT"],
         ["Duplicates after a join", "Float equality between engines", "Round to a fixed scale before joining"],
         ["Report and spreadsheet disagree", "Different rounding modes", "ROUND in SQL at the agreed scale, once"],
         ["Averages too low", "NULL rows skipped by AVG", "COALESCE the value, or document the denominator"]],
        widths=[0.30, 0.30, 0.40], caption="Table 2.10 &mdash; Eight symptoms and their numeric causes.")
    s += callout("tip", "Try it",
                 "Create a table with DECIMAL(5,2) and insert 999.995, 1234.00 and -0.001. Note what each engine "
                 "stores. Then repeat with FLOAT and sum 10,000 rows of 0.01 to see the drift for yourself.")
    return s
