# Conversation summary: core_members analysis and documentation pack

Date: 2 October 2026
Source file: `core_schema.json` (Invision Community / IPS core schema, 180 tables, `core_` prefix only)

## 1. Requests

1. **Analysis (chat):** Acting as a database architect explaining to non-experts, analyse the `core_members` table: how it defines a member and what is held in linked tables.
2. **Deliverable:** A single standalone, downloadable HTML file containing:
   - a high-level overview for management and project managers;
   - a column-by-column data dictionary for a later migration to another system;
   - entity-relationship diagrams (ERDs) with the matching Mermaid.js code, so they can be rendered in other tools.
3. Context given: this is part of a larger schema analysis.

## 2. Outcome

Delivered `core_members_documentation.html` (about 3.4 MB, fully offline, Mermaid v10 embedded). All 14 diagrams rendered without errors in a headless browser test.

Contents:
- **Part 1, Overview:** plain-English explanation, headline numbers, key findings, migration outlook, decisions needed.
- **Part 2, ERDs:** one overview diagram and 12 functional-area diagrams, each with a table of links and a copyable/downloadable Mermaid block.
- **Part 3, Dictionary:** 70 columns with type, nullability, default, indexes, meaning, flags, confidence rating, migration action and note. Searchable and filterable, with CSV download. Also an index table and a full-table ERD.
- **Part 4, Reference:** catalogue of 93 member-reference columns across 80 tables, key-type mismatch list, assumptions and limits.

## 3. Key findings

- **Hub-and-spoke design:** `core_members` (PK `member_id`, BIGINT UNSIGNED, auto-increment) is the hub. 80 other tables hold 93 columns that refer back to a member.
- **No declared relationships:** the schema declares no foreign keys. All links are inferred from column names and comments and were reviewed by hand.
- **Caches and derived values:** 20 of 70 columns are derived or cached (counters, menus, permission caches). They can be rebuilt after migration.
- **Packed values:** 13 columns hold packed or serialised data: comma lists (`mgroup_others`), bit-fields (`members_bitoptions`, `members_bitoptions2`), serialised text, and the "posts today,date" pair in `members_day_posts`. Bit meanings live in application code, not the schema.
- **Sensitive data concentrated here:** `email`, `ip_address`, birthday (three columns), `members_pass_hash`, `members_pass_salt`, `mfa_details`, `failed_logins`, and the consent flag `allow_admin_mails`.
- **Dates:** stored as Unix timestamps in INT columns.
- **Polymorphic and name-based links:** `core_moderators.id`, `core_leaders.leader_type_id`, `core_admin_permission_rows.row_id` (member or group, depending on a type column); `core_admin_login_logs.admin_username` links by name text.
- **Key-type inconsistencies:** 27 of 93 referencing columns differ from `BIGINT UNSIGNED`. 11 are narrower integers. The one high-risk case is `core_member_badges.member` (MEDIUMINT UNSIGNED, overflow at 16,777,215). Also `core_members.member_group_id` is SMALLINT while `core_groups.g_id` is INT.
- **Thin documentation:** 62 of 70 columns have no schema comment. Descriptions are inferred from names, types and standard IPS behaviour, each with a High/Medium/Low confidence rating. Low-confidence items: `restrict_post`, `mod_posts`, `temp_ban` conventions, both bit-field columns, `auto_track`, `pp_customization`, `pp_setting_count_comments`, `pconversation_filters`, `member_streams`, `unique_hash`.

## 4. The twelve linked areas

| Area | Linked tables |
|---|---|
| Groups, roles and administration | 6 |
| Profile and social | 6 |
| Following, feeds and personal tools | 5 |
| Sign-in, sessions and verification | 10 |
| Privacy, audit and integrations | 7 |
| Private messaging | 3 |
| Content and engagement | 9 |
| Search, read-tracking and publishing | 13 |
| Recognition and gamification | 5 |
| Moderation and reports | 5 |
| Clubs and social groups | 4 |
| Notifications and alerts | 7 |

Lookup tables with no direct member reference: `core_member_ranks`, `core_members_warn_actions`.

## 5. Migration actions (column level, core_members)

Migrate 11, Transform 15, Map 5, Rebuild 12, Review 10, Secure 3, Drop 14.

Decisions raised for the project:
1. Scope of members (dormant, unvalidated, banned accounts).
2. Password strategy (carry hashes, force reset, or transitional login).
3. Which linked tables are in scope.
4. Minimisation of IP addresses, full birth dates, failed-login records.
5. Faithful mapping of `allow_admin_mails` consent.
6. Re-linking of external accounts and OAuth tokens.
7. Access to IPS source code to decode the bit-fields.
8. Preserve member IDs or renumber (preserving keeps all 93 references valid).

## 6. Assumptions and limits

- Relationships inferred, not declared.
- Only the 180 `core_` tables were analysed. Forums, commerce and other application schemas will add more member links.
- The schema contains structure only: no volumes, value distributions or data quality information.
- Author-name columns (application, theme, plugin authors) and permission flags that merely mention members were not counted as member links.

## 7. Reusable method

1. Parse the JSON schema (`columns` dict, `indexes` dict, per-table `comment`, `engine`).
2. Find candidate member references by column name pattern (`member`, `author`, `owner`, `starter`, `moderator`, `user`, `_by`) and comments mentioning members, then curate by hand.
3. Group references into functional areas to keep each ERD legible (more than about 15 entities becomes unreadable).
4. Hand-write business descriptions for each column of the central table, with sensitivity, derived/packed flags, confidence and migration action.
5. Generate Mermaid `erDiagram` code programmatically (solid lines for ID links, dotted for polymorphic or name links), plus a `flowchart` overview.
6. Embed Mermaid inline for an offline file. Verify every diagram renders using Playwright and check for page errors.

## 8. Suggested next steps

- Extend the same method to the forums and commerce schemas.
- Turn the dictionary's migration actions into a source-to-target mapping sheet.
- Verify the Low-confidence columns against the IPS version's source code or a data sample.
