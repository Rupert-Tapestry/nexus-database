# FSF Data Model — summary of work produced

Source: `database-schema.html` (54 off-the-shelf Nexus commerce tables + 12 custom Tapestry/Foundation tables, 66 tables total). No foreign key is enforced at the database engine level anywhere in this schema — every relationship shown is an application-level convention, drawn as a non-identifying relationship (`..`) throughout.

Deliverable: a single-page artifact, **FSF Data Model**, with 14 tabs.

## Tab contents

| # | Tab | Contents |
|---|---|---|
| 00 | All tables | Every linked table in the schema (68 entities including forum core), relationships only, no columns. Excludes two true orphans: `nexus_eom` and `tapestry_globalpay`. |
| 01 | Commercial spine | Customer → package → invoice → transaction → purchase → Tapestry setting, trimmed columns. 17 entities, 62 columns shown. |
| 02 | Customers & billing | The customer record, money in, money out. 17 entities, 63 columns shown. |
| 03 | Catalogue & purchases | The store, and what a purchase becomes. 18 entities, 57 columns shown. |
| 04 | Support desk | Tickets, replies, and the non-EU residency control. 16 entities, 45 columns shown. |
| 05 | Tapestry integration | The join between the two systems. 15 entities, 39 columns shown. Includes intentionally orphaned `tapestry_globalpay`. |
| 06 | Foundation community | Local authority schemes and the keys practitioners redeem. 7 entities, 22 columns shown. |
| 07 | Full: Commercial spine | Same entities and joins as tab 01, every column. 235 columns. |
| 08 | Full: Customers & billing | Same entities and joins as tab 02, every column. 174 columns. |
| 09 | Full: Catalogue & purchases | Same entities and joins as tab 03, every column. 200 columns. |
| 10 | Full: Support desk | Same entities and joins as tab 04, every column. 184 columns. |
| 11 | Full: Tapestry integration | Same entities and joins as tab 05, every column. 213 columns. |
| 12 | Full: Foundation community | Same entities and joins as tab 06, every column. 34 columns. |
| 13 | Mermaid source | Raw, unrendered Mermaid for all 13 diagrams above, each with a Copy button. Entity names and both sides of every relationship are wrapped `"**like this**"` for bold markdown rendering wherever this source is pasted elsewhere — this formatting is applied only in this tab, not in the live rendered diagrams (bolding the live Mermaid would break entity linking). |

## Column-trimming logic (tabs 01–06)

Each entity kept only:

1. The **primary key**, always.
2. Any **foreign key** that a relationship line on that same diagram actually uses.
3. One or two further columns only where needed to explain a relationship label or note already on the diagram (status enums, JSON payload fields, cross-references such as `ps_id` ↔ `school_pkg_id`).

Everything else — audit columns, display-only fields, denormalised copies, columns not touched by any join on that diagram — was left out. Entities and relationships were never trimmed: tabs 01–06 and their full counterparts (07–12) contain identical tables and identical joins, differing only in column count.

| Domain | Entities | Trimmed columns | Full columns |
|---|---|---|---|
| Commercial spine | 17 | 62 | 235 |
| Customers & billing | 17 | 63 | 174 |
| Catalogue & purchases | 18 | 57 | 200 |
| Support desk | 16 | 45 | 184 |
| Tapestry integration | 15 | 39 | 213 |
| Foundation community | 7 | 22 | 34 |

## Fixes made along the way

- **`cms_custom_database_21` ↔ `tapestry_schools` cardinality**: the relationship line was missing its left-side crow's-foot marker (invalid Mermaid). Corrected to `||..o|` — one trial-request record leads to at most one resulting Tapestry setting, created only on approval.
- **`nexus_customer_fields` ↔ `nexus_customers` join**: a missing space between the identifier and the relationship operator was silently breaking the line (and meant it was skipped by the later bold-formatting pass). Fixed in both the live billing diagram and its Mermaid-source copy.
- **Orphaned `nexus_tax` in the billing diagram**: `nexus_tax` was declared in Customers & billing with no relationship connecting it there (its real join is in Catalogue & purchases, via `nexus_packages`). Removed from the billing diagram and its entity count corrected from 18 to 17.
- **`nexus_support_requests` column count**: verified against source — 27 columns in the full schema, now fully represented in tab 10.

## Verification performed before publishing

- All 66 source tables extracted programmatically from the schema HTML and spot-checked for column counts.
- Every full-column diagram checked for zero unmatched relationship references (no join points at an entity that isn't defined).
- Zero bold-formatting markers leaked into any live, rendered Mermaid block — confined entirely to the Mermaid source tab.
- Tag balance and panel/section counts checked across the whole document after every insertion.
