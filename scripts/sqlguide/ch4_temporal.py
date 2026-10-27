"""Part 4 — Date and time types."""
from .theme import *

P = "4"


def ch4():
    s = []
    s += part(P, "Date & Time Types", "Instants, wall clocks, durations — the type decision hardest to reverse")
    s.append(lead(
        "Dates and times cause more production incidents than every other type family combined. The reason is "
        "simple: the same instant has many correct spellings. This part separates the two questions every "
        "temporal column must answer &mdash; <b>what is it</b> (an instant, a local date, a duration) and "
        "<b>whose clock</b> (UTC, server, user) &mdash; and then shows the exact types, ranges and functions per "
        "engine."))

    s.append(h2("4.1", "The four temporal concepts"))
    s += cards([
        ("Instant (point in time)",
         "A moment on the world timeline, independent of any clock. Stored as UTC plus an offset, or as a "
         "normalised UTC value. Type names contain <b>TZ</b>, <b>OFFSET</b> or <b>WITH TIME ZONE</b>."),
        ("Wall clock (local)",
         "What a calendar on a wall shows: 2026-10-27 09:30 in Mumbai. No offset attached, so it is not a "
         "unique instant. Type names are DATE, DATETIME, TIMESTAMP <i>without</i> time zone."),
        ("Calendar date",
         "A day with no time at all: birth date, invoice date, business date. Use DATE, never DATETIME at "
         "midnight &mdash; midnight does not always exist in every time zone (DST)."),
        ("Duration",
         "A length of time, not a moment: 90 days, 3 hours 15 minutes. Use INTERVAL, or an integer count of a "
         "declared unit."),
    ])

    s.append(h2("4.2", "The temporal type catalogue"))
    s += tbl(
        ["Type", "What it is", "Range / precision", "Use for"],
        [["DATE", "Calendar date, no time", "4713 BC &ndash; 5874897 AD (PG); 1000&ndash;9999 (MySQL DATE)",
          "Business dates, birthdays, invoice dates"],
         ["TIME", "Time of day, no date", "00:00:00 &ndash; 23:59:59.999999", "Opening hours, schedule slots"],
         ["DATETIME", "Date + wall-clock time, no zone", "1000-01-01 &ndash; 9999-12-31 (MySQL); 1753+ (SQL Server)",
          "Legacy data, purely local schedules"],
         ["TIMESTAMP", "Date + time; zone-aware in PostgreSQL (stored UTC), naive in MySQL and SQL Server",
          "1970&ndash;2038 (MySQL TIMESTAMP); 4713 BC+ (PG)", "Event times &mdash; but check the engine semantics"],
         ["TIMESTAMPTZ", "Instant: stored UTC, rendered in the session zone", "4713 BC &ndash; 294276 AD",
          "Anything that happens once, globally"],
         ["DATETIMEOFFSET", "Instant plus the originating offset", "0001-01-01 &ndash; 9999-12-31", "Cross-region events in SQL Server"],
         ["INTERVAL", "Duration", "&plusmn;178,000,000 years in PG", "Ages, windows, SLA durations"],
         ["YEAR", "Four-digit year in 1 byte (MySQL)", "1901&ndash;2155", "Legacy dimension tables"]],
        widths=[0.16, 0.36, 0.24, 0.24], caption="Table 4.1 &mdash; Temporal types. The same word means different things per engine.")

    s += callout("warn", "The single most dangerous word in SQL: TIMESTAMP",
                 "PostgreSQL's TIMESTAMP is naive, TIMESTAMPTZ is an instant. MySQL's TIMESTAMP is an instant "
                 "(converted to UTC, rendered in the session zone) and DATETIME is naive. SQL Server's TIMESTAMP is "
                 "not a date at all &mdash; it is a rowversion binary. Oracle's TIMESTAMP has no zone; "
                 "TIMESTAMP WITH TIME ZONE does. If a schema review finds an unqualified TIMESTAMP, that is the "
                 "first question to ask.")

    s.append(h2("4.3", "Storage cost per engine"))
    s += tbl(
        ["Type", "MySQL 8", "PostgreSQL 16", "SQL Server", "Oracle 23ai", "SQLite"],
        [["DATE", "3 bytes", "4 bytes", "3 bytes", "7 bytes (includes time)", "TEXT/INTEGER/REAL"],
         ["TIME", "3 bytes + fsp", "8 bytes", "3&ndash;5 bytes", "&mdash; (part of DATE)", "TEXT"],
         ["DATETIME", "5 bytes + fsp", "&mdash;", "8 bytes (DATETIME2 6&ndash;8)", "7 bytes", "TEXT"],
         ["TIMESTAMP", "4 bytes + fsp", "8 bytes", "8 bytes (rowversion, not a date)", "7&ndash;11 bytes", "TEXT"],
         ["With zone", "&mdash;", "8 bytes (TIMESTAMPTZ)", "8&ndash;10 (DATETIMEOFFSET)", "13 bytes", "&mdash;"],
         ["Fractional seconds", "DATETIME(3) / (6)", "always microseconds", "DATETIME2(3) / (7)", "TIMESTAMP(6)", "text"]],
        widths=[0.18, 0.14, 0.17, 0.19, 0.17, 0.15],
        caption="Table 4.2 &mdash; Bytes per value. fsp = fractional seconds precision (0&ndash;6, +0&ndash;3 bytes).", size=7.3)

    s.append(h2("4.4", "Instants versus wall clocks, decided properly"))
    s.append(body(
        "Ask one question about every temporal column: <i>if a user in another time zone opens this row, should "
        "the displayed time change?</i> If yes, it is an instant. If no, it is a wall clock. Then choose:"))
    s += tbl(
        ["Need", "Choose", "Why not the alternative"],
        [["Order placed at 14:03 UTC", "TIMESTAMPTZ (PG), DATETIMEOFFSET (SQL Server), TIMESTAMP (MySQL)",
          "A naive type records a number without its offset, so you cannot reconstruct the instant"],
         ["Store opens at 09:00 local, every day", "TIME or DATETIME, plus a separate zone column",
          "An instant would shift when the local DST rules change"],
         ["Invoice date for accounting", "DATE",
          "Accounting periods are date ranges in a declared zone, not instants"],
         ["Flight departs 22:40 on 2026-03-01", "TIMESTAMP WITH TIME ZONE + INTERVAL",
          "The departure is an instant; the duration is not"],
         ["Subscription length", "INTERVAL, or months as INTEGER",
          "Adding '1 month' is not adding 30 days"],
         ["Ages and tenure", "Integer days, or INTERVAL", "Comparable, sortable, easy to bucket"]],
        widths=[0.30, 0.38, 0.32], caption="Table 4.3 &mdash; The wall-clock/instant decision table.")

    s += code("""-- The right way: instants in UTC, converted only for display
CREATE TABLE events (
    event_id   BIGINT PRIMARY KEY,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),   -- instant, stored UTC
    business_date DATE NOT NULL                        -- pre-computed in the reporting zone
);

-- PostgreSQL: the session zone decides how the instant is rendered
SET TIME ZONE 'Asia/Kolkata';
SELECT occurred_at FROM events;                     -- 2026-10-27 09:30:00+05:30
SET TIME ZONE 'UTC';
SELECT occurred_at FROM events;                     -- 2026-10-27 04:00:00+00

-- SQL Server
SELECT SWITCHOFFSET(occurred_at, '+05:30') FROM events;
SELECT occurred_at AT TIME ZONE 'India Standard Time' FROM events;

-- MySQL: TIMESTAMP converts using the session time_zone, DATETIME does not
SET time_zone = '+05:30';
SELECT created_at, created_local FROM orders;""",
              title="universal · one instant, three renderings")
    s += callout("deep", "Why TIMESTAMPTZ does not store a time zone",
                 "PostgreSQL's TIMESTAMPTZ normalises to UTC on write and has no memory of the input offset; it "
                 "only formats using the session zone. If you need to know the <i>original</i> local offset (for "
                 "example, which day the customer experienced the event), store it in a second column or use "
                 "SQL Server's DATETIMEOFFSET, which keeps the offset.")

    s.append(h2("4.5", "Time zones, DST and the two-hour bug"))
    s += bl([
        "<b>Never store a local time and call it universal.</b> If the server is in UTC but the business is in "
        "Asia/Kolkata, a naive CURRENT_TIMESTAMP is the wrong wall clock and, worse, is inconsistent with "
        "application-generated times.",
        "<b>DST creates nonexistent and duplicated times.</b> On spring-forward, 02:30 may not exist; on "
        "fall-back it happens twice. A naive wall clock cannot distinguish them; an instant can.",
        "<b>Offsets are not zones.</b> +05:30 is a fixed offset; Asia/Kolkata is a zone with historical rule "
        "changes. Store zones (or instants) and convert with a zone database, not with a hard-coded offset.",
        "<b>Set the session zone explicitly in ETL.</b> A pipeline whose output depends on the server default is "
        "not reproducible; set <font face='DM' size='8'>SET TIME ZONE 'UTC'</font> at the start of every job.",
        "<b>Beware the DATE at midnight trick.</b> Casting a timestamp to a date uses the session zone; if ETL "
        "runs in UTC and the business day is IST, every event between 18:30 and 24:00 UTC lands on the wrong "
        "day.",
    ])
    s += code("""-- The 'wrong business date' bug, in full
-- Business day = Asia/Kolkata. ETL session = UTC.
SELECT occurred_at::date AS business_date FROM events;
-- 2026-10-27 20:00 IST = 2026-10-27 14:30 UTC  → correct day
-- 2026-10-28 02:00 IST = 2026-10-27 20:30 UTC  → counted on the 27th. Wrong by a day.

-- Fix: convert first, then cast
SELECT (occurred_at AT TIME ZONE 'Asia/Kolkata')::date AS business_date FROM events;

-- MySQL
SELECT DATE(CONVERT_TZ(occurred_at, '+00:00', '+05:30')) AS business_date FROM events;

-- SQL Server
SELECT CAST(occurred_at AT TIME ZONE 'UTC' AT TIME ZONE 'India Standard Time' AS date);""",
              title="universal · converting before truncating")
    s += callout("best", "Store UTC, compute local, display local",
                 "Storage is UTC instants. Computations that need a calendar (business day, fiscal week, "
                 "month-to-date) are done after converting to the business zone, and the resulting DATE is often "
                 "materialised as its own column. Display converts at the last moment, in the presentation layer.")

    s.append(h2("4.6", "Ranges, precision and the 2038 problem"))
    s += tbl(
        ["Engine", "Type", "Earliest", "Latest", "Notes"],
        [["MySQL", "DATETIME", "1000-01-01", "9999-12-31", "No zone, 5 bytes + fsp"],
         ["MySQL", "TIMESTAMP", "1970-01-01 00:00:01 UTC", "2038-01-19 03:14:07 UTC", "32-bit epoch, 4 bytes"],
         ["PostgreSQL", "TIMESTAMP / TIMESTAMPTZ", "4713 BC", "294276 AD", "64-bit microseconds"],
         ["SQL Server", "DATETIME", "1753-01-01", "9999-12-31", "3.33 ms accuracy"],
         ["SQL Server", "DATETIME2", "0001-01-01", "9999-12-31", "100 ns; the default choice"],
         ["SQL Server", "SMALLDATETIME", "1900-01-01", "2079-06-06", "1-minute accuracy"],
         ["Oracle", "DATE", "4712 BC", "9999 AD", "7 bytes, includes HH:MM:SS"],
         ["Oracle", "TIMESTAMP(9)", "4712 BC", "9999 AD", "7&ndash;11 bytes, nanoseconds"],
         ["SQLite", "TEXT/INTEGER/REAL", "&mdash;", "&mdash;", "No type; conventions only"]],
        widths=[0.14, 0.22, 0.20, 0.20, 0.24], caption="Table 4.4 &mdash; Ranges decide which types you can trust in 2038 and beyond.")
    s += callout("warn", "2038 is a data type bug, not a Y2K rerun",
                 "MySQL TIMESTAMP and 32-bit Unix-time integers overflow on 2038-01-19. Any column holding an "
                 "epoch in INT, any TIMESTAMP column with a 30-year mortgage or a pension schedule, and any "
                 "future-dated record hits it. Use DATETIME, BIGINT epochs, or TIMESTAMPTZ.")

    s.append(h3("Fractional seconds"))
    s.append(body(
        "Precision is declared and paid for. MySQL accepts DATETIME(0&ndash;6); SQL Server DATETIME2(0&ndash;7); "
        "Oracle TIMESTAMP(0&ndash;9); PostgreSQL always stores microseconds. A 3-digit millisecond default is "
        "usually right for application events; keep 6 digits for logs where ordering within a second matters."))
    s += code("""CREATE TABLE ticks (
    at_ms  DATETIME(3)     NOT NULL,   -- MySQL: milliseconds, +2 bytes
    at_us  DATETIME(6)     NOT NULL    -- microseconds, +3 bytes
);

-- Truncate rather than round when bucketing time
SELECT DATE_FORMAT(at_ms, '%Y-%m-%d %H:00:00') AS hour_bucket FROM ticks;       -- MySQL
SELECT date_trunc('hour', at_us) AS hour_bucket FROM ticks;                     -- PostgreSQL
SELECT DATEADD(hour, DATEDIFF(hour, 0, at_us), 0) AS hour_bucket FROM ticks;    -- SQL Server
SELECT TRUNC(at_us, 'HH24') AS hour_bucket FROM ticks;                          -- Oracle""",
              title="universal · hour bucketing, four engines")

    s.append(h2("4.7", "Date arithmetic and the functions worth memorising"))
    s += tbl(
        ["Operation", "MySQL", "PostgreSQL", "SQL Server", "Oracle"],
        [["Add 1 day", "DATE_ADD(d, INTERVAL 1 DAY)", "d + INTERVAL '1 day'", "DATEADD(day, 1, d)", "d + 1"],
         ["Add 1 month", "DATE_ADD(d, INTERVAL 1 MONTH)", "d + INTERVAL '1 month'", "DATEADD(month, 1, d)", "ADD_MONTHS(d,1)"],
         ["Difference in days", "DATEDIFF(a, b)", "b - a (integer days)", "DATEDIFF(day, a, b)", "b - a"],
         ["Current instant", "NOW() / CURRENT_TIMESTAMP", "now() / CURRENT_TIMESTAMP", "SYSDATETIME()", "SYSTIMESTAMP"],
         ["Current UTC", "UTC_TIMESTAMP()", "now() AT TIME ZONE 'UTC'", "SYSUTCDATETIME()", "SYS_EXTRACT_UTC(SYSTIMESTAMP)"],
         ["Truncate to month", "DATE_FORMAT(d,'%Y-%m-01')", "date_trunc('month', d)", "DATETRUNC(month, d) (2022+)", "TRUNC(d,'MM')"],
         ["Extract part", "EXTRACT(YEAR FROM d)", "EXTRACT(YEAR FROM d)", "YEAR(d) / DATEPART", "EXTRACT(YEAR FROM d)"],
         ["Last day of month", "LAST_DAY(d)", "date_trunc('month',d)+1mo-1day", "EOMONTH(d)", "LAST_DAY(d)"],
         ["Format", "DATE_FORMAT(d,'%d/%m/%Y')", "to_char(d,'DD/MM/YYYY')", "FORMAT(d,'dd/MM/yyyy')", "TO_CHAR(d,'DD/MM/YYYY')"],
         ["Parse text", "STR_TO_DATE(s,fmt)", "to_date(s, fmt)", "CONVERT(d, 103)", "TO_DATE(s, fmt)"]],
        widths=[0.19, 0.23, 0.22, 0.21, 0.15], caption="Table 4.5 &mdash; Date arithmetic cheat sheet.", size=7.3)
    s += code("""-- Age in completed years
-- PostgreSQL
SELECT date_part('year', age(CURRENT_DATE, birth_date)) FROM people;
-- MySQL
SELECT TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) FROM people;
-- SQL Server
SELECT DATEDIFF(year, birth_date, GETDATE()) FROM people;   -- ⚠ counts year boundaries, not years
SELECT DATEDIFF(year, birth_date, GETDATE())
       - CASE WHEN DATEADD(year, DATEDIFF(year, birth_date, GETDATE()), birth_date) > GETDATE()
              THEN 1 ELSE 0 END AS age FROM people;""",
              title="universal · age is harder than it looks")

    s += callout("trap", "BETWEEN on timestamps excludes the last day",
                 "WHERE created_at BETWEEN '2026-10-01' AND '2026-10-31' silently drops everything after "
                 "midnight on the 31st. Use a half-open range: created_at >= '2026-10-01' AND created_at < "
                 "'2026-11-01'. It is correct for timestamps, sargable, and safe with fractional seconds.")

    s.append(h2("4.8", "Generating calendars and bucketing time"))
    s += code("""-- PostgreSQL: a date spine, the foundation of every time series report
SELECT d::date AS day
FROM generate_series('2026-01-01'::date, '2026-12-31'::date, '1 day') AS d;

-- MySQL 8: recursive CTE
WITH RECURSIVE days AS (
    SELECT DATE('2026-01-01') AS d
    UNION ALL
    SELECT d + INTERVAL 1 DAY FROM days WHERE d < '2026-12-31'
)
SELECT d FROM days;

-- SQL Server: system table or a numbers table
WITH days AS (
    SELECT DATEADD(day, n, '2026-01-01') AS d
    FROM (SELECT TOP (365) ROW_NUMBER() OVER (ORDER BY (SELECT 1)) - 1 AS n
          FROM sys.all_objects) n
)
SELECT d FROM days;

-- Monthly aggregation with a spine so empty months appear as zero
SELECT c.month, COALESCE(SUM(s.net_amount), 0) AS revenue
FROM calendar_months c
LEFT JOIN fact_sales s ON s.business_date >= c.month AND s.business_date < c.next_month
GROUP BY c.month
ORDER BY c.month;""",
              title="universal · date spines prevent missing-month bugs")
    s += callout("tip", "The calendar dimension",
                 "Warehouses materialise a calendar table: date, day name, week, month, quarter, fiscal period, "
                 "is_holiday, is_weekend. It makes reporting queries readable, keeps business logic out of CASE "
                 "expressions, and gives every date type a single join target.")

    s.append(h2("4.9", "Temporal pitfalls checklist"))
    s += tbl(
        ["Symptom", "Cause", "Fix"],
        [["Report totals shift by one day", "Casting timestamp to date in the wrong zone", "Convert to the business zone, then cast"],
         ["Last day of the month missing", "BETWEEN with a date literal", "Half-open range: >= start AND < next start"],
         ["Two rows for one event", "DST fall-back duplication", "Store instants, not wall clocks"],
         ["Times differ between app and database", "Server default zone", "Set the session zone explicitly; store UTC"],
         ["&ldquo;Invalid date&rdquo; on insert", "MySQL strict mode rejected a zero date", "Use NULL, not '0000-00-00'"],
         ["Age off by one", "DATEDIFF counting boundaries", "Compute with full date arithmetic"],
         ["Index not used on a date filter", "Function applied to the column", "Filter on raw column; move functions to the constant"],
         ["Future dates become 1970", "32-bit TIMESTAMP overflow", "DATETIME/TIMESTAMPTZ or BIGINT epoch"]],
        widths=[0.28, 0.32, 0.40], caption="Table 4.6 &mdash; Eight temporal defects and their fixes.")

    s.append(h2("4.10", "Engine cheat sheet: temporal types"))
    s += tbl(
        ["Need", "MySQL 8", "PostgreSQL 16", "SQL Server", "Oracle 23ai", "SQLite"],
        [["Calendar date", "DATE", "DATE", "DATE", "DATE (with time)", "TEXT"],
         ["Naive date+time", "DATETIME", "TIMESTAMP", "DATETIME2", "TIMESTAMP", "TEXT"],
         ["Instant", "TIMESTAMP (2038 limit)", "TIMESTAMPTZ", "DATETIMEOFFSET", "TIMESTAMP WITH TIME ZONE", "TEXT (UTC)"],
         ["Time only", "TIME", "TIME", "TIME", "INTERVAL DAY TO SECOND", "TEXT"],
         ["Duration", "(no type)", "INTERVAL", "(no type)", "INTERVAL DAY TO SECOND", "(no type)"],
         ["Epoch seconds", "INT / BIGINT", "INTEGER / BIGINT", "INT / BIGINT", "NUMBER", "INTEGER"]],
        widths=[0.19, 0.17, 0.16, 0.18, 0.20, 0.10], caption="Table 4.7 &mdash; Temporal types across engines.", size=7.4)
    s += callout("tip", "Try it",
                 "In PostgreSQL, insert the same value as TIMESTAMP and TIMESTAMPTZ, then change the session zone "
                 "and select both. Only one of them changes &mdash; that is the difference between a wall clock and "
                 "an instant, demonstrated in ten seconds.")
    return s
