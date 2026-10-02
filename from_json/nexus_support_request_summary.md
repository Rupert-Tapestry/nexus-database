# Support request model: query and responses summary

Date: 2 October 2026. Follow-on to the Nexus ERD project (see `nexus_erd_thread_summary.md` and `nexus_support_streams_summary.md`). Source schema: `schema.json` (Nexus, the commercial extension of Invision Community).

## 1. The question

What makes up a support request (ticket) in the support domain? Specifically:
- Where is the body of the request stored?
- How do we identify who raised it (user, customer or member)?
- Which tables link together to define the request?

Follow-up instruction: produce both a Mermaid diagram (with code) and a spreadsheet, packaged as HTML that can be downloaded.

## 2. The answer

A request is not one table. It is a **header row** plus one or more **message rows**, with lookup, audit and rating tables around them.

| Table | Role | Holds |
|---|---|---|
| `nexus_support_requests` | Request header | One row per ticket: title, raiser, department, status, severity, assigned staff, timestamps, reply count, custom field answers |
| `nexus_support_replies` | Messages | One row per message, including the first. Links to the request by `reply_request` |
| `nexus_support_departments`, `statuses`, `severities` | Lookups | Names and settings for the ids stored on the request |
| `nexus_support_ratings` | Satisfaction | One rating per reply (PK is the reply id) |
| `nexus_support_tracker`, `nexus_support_views` | Per-member state | Who follows a request; when each member last viewed it |
| `nexus_support_request_log` | Audit | Staff changes to a request: field, old value, new value |

### Where the body is
- `nexus_support_replies.reply_post` (MEDIUMTEXT, fulltext indexed).
- The opening message is the reply with `reply_is_first = 1`.
- The header table holds only the title (`r_title`).
- `reply_raw` keeps the original email source for email-in messages.
- Attachments are not in this schema. They are probably handled by Invision core, but that is not confirmed.

### Who raised it
- `nexus_support_requests.r_member` references `core_members.member_id` (stub).
- A value of 0 means a guest, identified by `r_email`.
- Each message author is in `reply_member` (0 for an email-only sender, see `reply_email`).
- Customer commerce details (name, phone) are in `nexus_customers`, keyed by the same member id.

### How the tables link
- `replies.reply_request` to `requests.r_id`: mandatory, every message belongs to one request.
- `requests.r_department`, `r_status`, `r_severity`: lookups.
- `requests.r_staff`: assigned staff member (0 = unassigned). `r_last_reply_by`: denormalised latest author.
- `requests.r_purchase` and `r_ppi_invoice`: optional ties to a purchase or a pay-per-incident invoice.
- `ratings.rating_reply` to `replies.reply_id`: 1:1. `rating_from` and `rating_staff` go to `core_members`.
- `tracker`, `views` and `request_log` point back to the request and to `core_members`.
- `views.view_reply` to a reply: dashed, assumed to be the last reply read.

## 3. Deliverable

`nexus_support_request_model.html`: one self-contained file, works offline (Mermaid embedded).

| Tab | Contents |
|---|---|
| Answers | The written answer above plus assumptions |
| Diagram | Mermaid ER diagram, Trimmed (key columns) and Full (all columns); zoom, fit width, SVG download |
| Mermaid code | Code for both versions; copy button and `.mmd` download |
| Spreadsheet | Three filterable sheets with CSV download: All columns (148 rows), Relationships (23 rows), Tables (13 rows) |

Scope: the nine support tables, `core_members` as a stub, and `nexus_customers`, `nexus_purchases` and `nexus_invoices` showing key columns only. The spreadsheet is an HTML table view, not an `.xlsx`; an `.xlsx` can be produced on request.

Verification: rendered in headless Chromium with no errors. Only the Trimmed screenshot was inspected visually. The Trimmed diagram is wide and sits at 50% zoom, so scrolling or "Fit width" may be needed.

## 4. Assumptions carried forward

1. No foreign keys are declared; all links are inferred from names, types and indexes. Cardinalities were accepted as correct by the schema owner pending database access.
2. `core_members` is a stub; `member_id` is assumed BIGINT UNSIGNED.
3. Columns with default 0 (such as `r_staff`) are drawn as optional, because 0 acts as "none".
4. Column notes written by me are inferences. Most schema columns have no comment.
5. `view_reply` is an assumed, dashed link.
6. Values behind codes (for example `reply_type`) are not documented in the schema.

## 5. Open items

- Real definitions of `core_members` and `core_groups` to replace the stubs.
- Database access to confirm cardinalities and read the lookup rows (statuses, severities and departments).
- Where attachments are stored (not in this schema).
- Optional: an `.xlsx` version of the spreadsheet tab.
