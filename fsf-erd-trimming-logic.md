# FSF Data Model — column trimming logic (audit trail)

Applies to tabs 01–06 of the FSF Data Model diagram (Commercial spine, Customers & billing, Catalogue & purchases, Support desk, Tapestry integration, Foundation community). Tab 00 (All tables) never showed columns at all. Tabs 07–12 are the untrimmed counterparts added later, with identical entities and relationships.

## Selection criteria

Each entity block kept only the columns that met at least one of these:

1. **Primary key** — always included.
2. **Foreign key used on that diagram** — any column that a relationship line on the same diagram draws a join through, so the connection is traceable without leaving the page.
3. **Business-logic column** — one or two further columns only where needed to explain a relationship label or a note already on the diagram: status enums, JSON payload fields, or a "shared with" cross-reference between a Nexus ID and its Tapestry counterpart (e.g. `ps_id` / `school_pkg_id`).

Everything else was left out: audit columns, display-only fields, redundant denormalised copies, and columns not touched by any join on that particular diagram.

## What was not trimmed

- **Entities**: every table in scope for a diagram is present in both the trimmed and full versions.
- **Relationships**: every join line, with its cardinality, is identical between the trimmed and full versions.
- Trimming only ever removed columns — it never dropped a table or a relationship.

## Exclusions from tab 00 (All tables)

Two tables have no join to anything else in the schema and were dropped from the all-tables overview entirely:

- `nexus_eom`
- `tapestry_globalpay` (shown as an intentional orphan on the Tapestry integration diagram instead, tab 05/11)

## Column counts, trimmed vs full

| Domain | Entities | Columns shown (trimmed) | Columns in full schema |
|---|---|---|---|
| Commercial spine | 17 | 62 | 235 |
| Customers & billing | 17 | 63 | 174 |
| Catalogue & purchases | 18 | 57 | 200 |
| Support desk | 16 | 45 | 184 |
| Tapestry integration | 15 | 39 | 213 |
| Foundation community | 7 | 22 | 34 |

## Source

Column data extracted directly from `database-schema.html` (54 Nexus tables, 12 custom Tapestry/Foundation tables). No foreign key in this database is enforced at the engine level; every relationship drawn is an application-level convention, shown as a non-identifying relationship (`..`) throughout.
