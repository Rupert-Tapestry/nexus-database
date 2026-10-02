# nexus_support_streams: query and responses summary

Date: 2 October 2026. Follow-on to the Nexus ERD project (see `nexus_erd_thread_summary.md`). Source schema: `schema.json` (Nexus, the commercial extension of Invision Community).

## 1. The question

The ERD shows four columns in `nexus_support_streams` as logical foreign keys: `stream_departments`, `stream_statuses`, `stream_severities` and `stream_staff`. The user asked where the data that defines their allowed values is stored: in another table, or in another file.

## 2. The answer

- **Another table, not a file.** Three of the four sources are tables in this same schema. The fourth is in Invision core, outside `schema.json`.
- **Correction to the framing.** These columns do not define allowed values. `nexus_support_streams` stores saved support-desk filters ("streams"). Each column says "show only requests matching these IDs".

| Column | Holds IDs from | Where that lives |
|---|---|---|
| `stream_departments` | `nexus_support_departments.dpt_id` | This schema |
| `stream_statuses` | `nexus_support_statuses.status_id` | This schema |
| `stream_severities` | `nexus_support_severities.sev_id` | This schema |
| `stream_staff` | `core_members.member_id` | Invision core (the stub, not in this file) |

- **Format.** Schema comments say each is a "Comma-delimited list of ... IDs or NULL for all". For example, `stream_departments = '2,5'` with `stream_statuses = NULL` means requests in departments 2 and 5, in any status.
- **Staff.** Staff are ordinary Invision members. Which members count as support staff is controlled by group permissions, also outside this file.
- **Why dashed, not solid.** Each value is a text list, so the database cannot check that the IDs exist. Deleting a department can leave its ID in saved streams; only application code handles that.

## 3. Other columns in the same table

| Column | Role |
|---|---|
| `stream_from_email`, `stream_search_term` | Plain-text filters; reference no table |
| `stream_started`, `stream_last_reply`, `stream_last_staff_reply`, `stream_last_new_reply` | Small JSON arrays (hours window plus sort direction) |
| `stream_tracked` | Yes/no: only requests the owner tracks. The link to `nexus_support_tracker` is my inference from the comment |
| `stream_owner` | A real single-value reference to `core_members` (default 0 = no owner) |
| `stream_title`, `stream_position`, `stream_temporary` | Display name, order in the owner's list, "not yet saved" flag |

## 4. Seeing the real values

The schema file holds structure only. To read the actual values, query `nexus_support_departments`, `nexus_support_statuses` and `nexus_support_severities` once database access is available. The export contains seed rows for statuses (6) and severities (1), but their name columns are NULL, so real names are not visible in the file.

## 5. Deliverable from this exchange

`nexus_support_streams.xlsx` (built as an Excel file because the Sheets artifact type was not offered in this session). Formulas recalculated with zero errors.

| Sheet | Contents |
|---|---|
| Filter columns | The four logical foreign key columns: what each filters, source table and key, where the source is defined, format, meaning of NULL, verbatim schema comment, why it is dashed |
| All columns | All 16 columns with role, type, nullability, default, references, verbatim comment and notes; auto-filter on |
| Source tables | The three in-schema sources plus `core_members`: key, key type, referenced-by, where defined, seed row counts |
| Notes | Role counts calculated by formula from the All columns sheet (total 16), key points, assumptions, and an example MySQL query |

The example query joins `nexus_support_streams` to `nexus_support_departments` with `FIND_IN_SET`. It is untested (no database access) and assumes IDs are comma-separated without spaces.

## 6. Assumptions carried forward

1. Relationships are inferred (the schema declares no foreign keys). The user accepted them as correct pending database access.
2. `core_members.member_id` is assumed BIGINT UNSIGNED, based on the many columns that reference it.
3. `stream_tracked` relating to `nexus_support_tracker` is inferred from its comment, not documented.

## 7. Open items

- Real definitions of `core_members` and `core_groups` to replace the stubs.
- Database access to read the source tables and test the decode query.
- Optional: apply the same breakdown to other list columns in the model, such as `dpt_staff`, `sev_departments` or `p_member_groups`.
