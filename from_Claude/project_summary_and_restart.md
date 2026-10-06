# Database ERD project: summary and restart notes

Date of work: 6 October 2026

## 1. Original request (restate this to resume)

> Acting as a database architect, analyse the three attached schemas defined in .json. Determine the layout of the tables, the relationships between them. Generate entity-relationship diagrams (ERDs), both for the full table descriptions and a trimmed down set of attributes that make for readability by containing only key columns (e.g. primary, foreign keys). List what assumptions and methodology you use for trimming the tables. List the tables both full and trimmed. Generate mermaid.js code for the ERDs (both full and trimmed). Package all of this in a standalone html format that I can download and make available outside of this tool. Please ask if anything is unclear.

Input files (Project knowledge): `core_schema.json` (180 tables), `nexus_schema.json` (54 tables), `tapestry_schema.json` (6 tables).

## 2. What was delivered

`database_erd_report.html`: a single ~4.4 MB offline file with Mermaid 11.17.2 embedded. It contains:

- Overview (counts, schema dependencies, 16 subject-area tiles)
- Method and assumptions
- ERD, key columns only, and ERD, all columns: an overview diagram plus 16 subject-area diagrams each (34 diagrams), with a Mermaid code tab, copy, `.mmd` download, "download all" (`.md`) and SVG download
- Table catalogue (full and key-column views, search, filters, JSON download)
- Relationship register (270 rows, CSV download)
- Findings (open questions, tables without a primary key, undrawn references)

Verification: all 34 Mermaid sources pass `mermaid.parse`, and all 34 rendered without console errors in headless Chromium.

## 3. Key findings

- 240 tables, 2,171 columns (core 180, nexus 54, tapestry 6).
- The files declare **no foreign keys**, so all relationships are inferred: 270 in total (201 high, 65 medium, 4 low confidence).
- Dependencies run one way: tapestry → nexus → core. `core_members` is the hub (124 inbound references).
- 60 tables have no inferred relationship; 29 have no primary key; 36 relationships join columns of different types or widths.
- Core and nexus match Invision Community (core and Commerce/Nexus); tapestry looks like a custom app. This is an inference, not stated in the files.

## 4. Method and assumptions

1. Parse the JSON and check for declared constraints (none found).
2. Find candidate foreign keys from column names, column comments, primary-key shape and indexes.
3. Validate each candidate mechanically (columns exist, parent key is primary/unique, type compatibility) and by meaning. Example rejected: `core_member_badges.actor` and `core_points_log.actor` are `SET('subject','other')`, not member ids.
4. Confidence: High = name, type and comment agree; Medium = convention-based or string-keyed (e.g. `app_directory`); Low = text-vs-number mismatch, polymorphic or speculative.
5. Cardinality: a NOT NULL column defaulting to 0 or empty is treated as optional ("0 means no parent"); only columns inside the child's primary key are mandatory. A foreign key equal to the child's primary key, or unique, gives one-to-one. A foreign key inside the primary key gives a solid (identifying) line.
6. Not drawn as relationships: polymorphic class-plus-id columns, and comma-separated or serialised id lists (both listed on the Findings page).
7. Tables grouped into 16 subject areas, because one diagram of all tables was about 65,000 px wide (top-to-bottom) or 42,000 px tall (left-to-right).

### Trimming rules (key-column view)

| Keep | Drop |
|---|---|
| Primary-key columns | Composite unique-index members that are not PK/FK |
| Inferred foreign-key columns | All other columns (text, flags, counters, timestamps, caches) |
| Single-column unique keys (UK) | |
| Non-PK target columns of relationships | |

Result: 2,171 columns reduced to 475 (78% fewer). Tables in another subject area appear as dashed stubs showing only the primary key and the columns the diagram references.

## 5. Open questions (unanswered)

1. What do `tapestry_support_request_schools.school_id` and `tapestry_promised.promise_school_id` reference? No schools table exists in the three files, so they are undrawn.
2. Is `tapestry_packages.id` a `nexus_packages.p_id`? It is drawn as a medium-confidence one-to-one extension.
3. Are the other application schemas (forums, pages, etc.) available? Several core columns reference them and cannot be resolved.

## 6. How to restart

Important: the working files (relationship list, generator scripts, build script) lived in a temporary sandbox and **will not persist**. Only `database_erd_report.html` and this note were saved. The relationship register and Mermaid code can be exported from the HTML, so work can resume from there.

Suggested restart message:

> I'm resuming a database ERD project. The schemas are `core_schema.json`, `nexus_schema.json` and `tapestry_schema.json` (in this project). Previously you produced a standalone HTML report with full and key-column ERDs, 270 inferred relationships, and 16 subject-area diagrams. I am attaching `database_erd_report.html` and `project_summary_and_restart.md`. Please use the methodology and trimming rules in the summary. [State what you want next, e.g. answer to the open questions below, add relationships, change grouping, or regenerate.]

Useful things to attach or tell Claude when resuming:

- `database_erd_report.html` (Relationships page, "Download CSV", gives the full relationship list; the Mermaid code tab gives the source)
- Answers to the three open questions in section 5
- Any confirmed or rejected medium/low-confidence relationships
- Any other application schemas (forums, pages, etc.)
- Preferences on styling (e.g. dark canvas, direction of layout) or different subject-area groupings

Possible next steps:

- Confirm medium and low edges against application code or data
- Add the missing schools relationships once identified
- Produce SQL `ALTER TABLE ... ADD FOREIGN KEY` scripts for the high-confidence edges (after fixing integer-width mismatches)
- Export diagrams as PDF or per-area SVG sets
