# Nexus ERD project: thread summary

Date: 2 October 2026. Reload this file into a new conversation (with `schema.json` re-attached) to continue the work.

## 1. Goal

Analyse a database schema exported as `schema.json` and produce entity-relationship diagrams (ERDs) as Mermaid.js code, with tables, relationships, assumptions and externally defined tables listed.

## 2. Source

- File: `schema.json`, the **Nexus** commercial extension of the Invision Community application (confirmed by the user).
- Contents: 54 tables, 571 columns, all prefixed `nexus_`.
- The file declares **no foreign keys**. Every relationship is inferred from column naming, comments, data types and index patterns.

## 3. Requirements agreed

1. One high-level diagram (table names and relations only, no columns).
2. Domain-specific diagrams (split chosen by Claude).
3. Two versions of each domain diagram: **Full** (all columns) and **Trimmed** (essential columns only, meaning those that define relationships).
4. `core_members` and `core_groups` left as stubs (no definitions available).
5. Versions with and without the "logical" relationships (comma-separated ID lists in TEXT columns), so the user can compare.
6. Tables formatted as tables: type, name, notes, primary and foreign keys marked.
7. Output as browsable HTML with tabs per diagram, for tables and Mermaid code.

## 4. Deliverable

`nexus_erd_browser.html`: a single self-contained file (about 3.7 MB, Mermaid 11.17.2 bundled, works offline).

- **Tabs:** Overview, Customers (7 tables), Billing (10), Catalogue (12), Purchases & Subscriptions (6), Support (15), Other (4), Notes & assumptions.
- **Sub-tabs per diagram:** Diagram (zoom, fit width, download SVG), Mermaid code (copy button), Tables.
- **Controls:** Detail (Trimmed or Full; disabled on the overview), Logical links (off or on, dashed), External core_* links (show or hide).
- **Testing:** all 52 diagram variants rendered without errors in headless Chromium.
- **Not saved:** the Python generator script lived in the session scratchpad and is not part of the deliverable. To regenerate, ask Claude to rebuild it from this summary and `schema.json`.

## 5. Domain assignment (judgement call)

| Domain | Tables |
|---|---|
| Customers | nexus_customers, nexus_customer_addresses, nexus_customer_cards, nexus_customer_spend, nexus_alternate_contacts, nexus_notes, nexus_customer_fields |
| Billing | nexus_invoices, nexus_invoice_tracker, nexus_transactions, nexus_paymethods, nexus_billing_agreements, nexus_payouts, nexus_tax, nexus_coupons, nexus_fraud_rules, nexus_cart_uploads |
| Catalogue | nexus_package_groups, nexus_packages, nexus_packages_products, nexus_packages_ads, nexus_package_fields, nexus_package_images, nexus_package_base_prices, nexus_product_options, nexus_package_filters, nexus_package_filters_values, nexus_package_filters_map, nexus_reviews |
| Purchases & Subscriptions | nexus_purchases, nexus_licensekeys, nexus_shipping, nexus_ship_orders, nexus_member_subscription_packages, nexus_member_subscriptions |
| Support | nexus_support_requests, nexus_support_replies, nexus_support_departments, nexus_support_statuses, nexus_support_severities, nexus_support_fields, nexus_support_ratings, nexus_support_tracker, nexus_support_views, nexus_support_notify, nexus_support_stock_actions, nexus_support_request_log, nexus_support_streams, nexus_support_staff_preferences, nexus_support_staff_dpt_order |
| Other | nexus_donate_goals, nexus_donate_logs, nexus_referral_rules, nexus_eom |

Purchases and subscriptions were merged because `sub_purchase_id` couples them tightly.

## 6. Tables defined elsewhere (stubs)

| External table | Key (assumed type) | Used by | Confidence |
|---|---|---|---|
| `core_members` | `member_id` (BIGINT UNSIGNED) | About 30 tables (customers, invoices, purchases, support, reviews and more) | High |
| `core_groups` | `g_id` (INT) | `p_primary_group`, `sp_primary_group`, `sub_previous_group`, plus list columns such as `p_member_groups`, `f_groups`, `c_groups` | Medium |
| `core_sys_lang` | `lang_id` (BIGINT UNSIGNED) | `nexus_package_filters_values.pfv_lang` | Medium |
| Other Invision apps' item tables | n/a | `nexus_purchases.ps_app` / `ps_type` / `ps_item_id` (polymorphic) | Low, not determinable from this file |

## 7. Assumptions

1. **Inferred relationships.** 122 in total: 88 foreign keys, 1 polymorphic, 33 logical (list or metadata). The user accepted the relationships and cardinalities as correct pending database access.
2. **Cardinality rules.** NOT NULL foreign key = mandatory (parent side exactly one). Nullable = optional (zero or one). NOT NULL with default 0 is treated as "0 = none" and drawn optional. Child side is zero-or-many, except 1:1 extensions (child PK equals parent key).
3. **1:1 extensions.** `nexus_customers`, `nexus_packages_products`, `nexus_packages_ads`, `nexus_support_ratings`, `nexus_support_staff_preferences`.
4. **Trimmed version.** PK, FK, unique-key columns, the polymorphic key and (when logical links are on) list columns. Descriptive columns omitted.
5. **Full version.** All columns of the domain's own tables. Tables from other domains appear with a `[Domain]` suffix and show only keys and relationship columns.
6. **Mermaid types.** Base type only in diagrams (no length or precision); the Tables tab carries full types.
7. **Composite keys.** Mermaid cannot express them, so each participating column is tagged PK. Unique-index-only tables tag columns UK.
8. **Logical (dashed) relationships.** Serialised ID lists in TEXT columns (for example `p_member_groups`, `c_products`, `stream_departments`). Some are confirmed by schema comments; the rest are inferred. `nexus_customer_fields.f_column` is a metadata link to a custom column of `nexus_customers`.
9. **Polymorphic reference.** Only the package link is drawn (`nexus_purchases.ps_item_id` when `ps_type` = package).
10. **Guest checkout.** `nexus_invoices.i_member` defaults to 0; assumed to allow guest invoices (accepted as correct). Still drawn as mandatory.
11. **Stub tables.** `nexus_package_base_prices` defines only `id`; extra columns assumed dynamic.
12. **Not drawn.** Currency codes (no currency table), JSON and serialised blobs other than the ID lists, and tables in other Invision apps.

## 8. Relationship inventory (solid foreign keys)

Format: `child.column -> parent.key`. `(o)` = optional, `(1:1)` = one-to-one extension, otherwise mandatory.

**Customers**
- nexus_customers.member_id -> core_members.member_id (1:1)
- nexus_customer_addresses.member -> core_members.member_id
- nexus_customer_cards.card_member -> core_members.member_id
- nexus_customer_cards.card_method -> nexus_paymethods.m_id
- nexus_customer_spend.spend_member_id -> core_members.member_id
- nexus_alternate_contacts.main_id, alt_id -> core_members.member_id
- nexus_notes.note_member, note_author -> core_members.member_id

**Billing**
- nexus_invoices.i_member -> core_members.member_id
- nexus_invoice_tracker.member_id -> core_members.member_id; invoice_id -> nexus_invoices.i_id
- nexus_transactions.t_member -> core_members.member_id; t_invoice -> nexus_invoices.i_id; t_method -> nexus_paymethods.m_id; t_billing_agreement -> nexus_billing_agreements.ba_id (o)
- nexus_billing_agreements.ba_method -> nexus_paymethods.m_id; ba_member -> core_members.member_id (o)
- nexus_payouts.po_member -> core_members.member_id; po_processed_by -> core_members.member_id (o)

**Catalogue**
- nexus_package_groups.pg_parent -> nexus_package_groups.pg_id (o, self)
- nexus_packages.p_group -> nexus_package_groups.pg_id
- nexus_packages.p_tax -> nexus_tax.t_id (o); p_primary_group -> core_groups.g_id (o); p_support_department -> nexus_support_departments.dpt_id (o); p_support_severity -> nexus_support_severities.sev_id (o)
- nexus_packages_products.p_id, nexus_packages_ads.p_id -> nexus_packages.p_id (1:1)
- nexus_package_images.image_product, nexus_product_options.opt_package -> nexus_packages.p_id (o)
- nexus_package_filters_values.pfv_filter -> nexus_package_filters.pfilter_id; pfv_lang -> core_sys_lang.lang_id
- nexus_package_filters_map.pfm_package -> nexus_packages.p_id (o); pfm_filter -> nexus_package_filters.pfilter_id (o)
- nexus_reviews.review_product -> nexus_packages.p_id; review_author_id, review_edit_member_id -> core_members.member_id (o)

**Purchases & Subscriptions**
- nexus_purchases.ps_member -> core_members.member_id
- nexus_purchases.ps_parent -> nexus_purchases.ps_id (o, self); ps_original_invoice, ps_invoice_pending -> nexus_invoices.i_id (o); ps_tax -> nexus_tax.t_id (o); ps_pay_to -> core_members.member_id (o); ps_billing_agreement -> nexus_billing_agreements.ba_id (o)
- nexus_purchases.ps_item_id -> nexus_packages.p_id (polymorphic, dashed, when ps_type = package)
- nexus_licensekeys.lkey_purchase -> nexus_purchases.ps_id (o); lkey_member -> core_members.member_id (o)
- nexus_shipping.s_tax -> nexus_tax.t_id (o)
- nexus_ship_orders.o_invoice -> nexus_invoices.i_id; o_method -> nexus_shipping.s_id
- nexus_member_subscription_packages.sp_tax -> nexus_tax.t_id (o); sp_primary_group -> core_groups.g_id (o)
- nexus_member_subscriptions.sub_member_id -> core_members.member_id; sub_package_id -> nexus_member_subscription_packages.sp_id; sub_purchase_id -> nexus_purchases.ps_id (o); sub_invoice_id -> nexus_invoices.i_id (o); sub_previous_group -> core_groups.g_id (o)

**Support**
- nexus_support_departments.dpt_ppi_tax -> nexus_tax.t_id (o)
- nexus_support_requests.r_member -> core_members.member_id; r_department -> nexus_support_departments.dpt_id; r_status -> nexus_support_statuses.status_id; r_purchase -> nexus_purchases.ps_id (o); r_severity -> nexus_support_severities.sev_id (o); r_staff, r_last_reply_by -> core_members.member_id (o); r_ppi_invoice -> nexus_invoices.i_id (o)
- nexus_support_replies.reply_request -> nexus_support_requests.r_id; reply_member -> core_members.member_id
- nexus_support_ratings.rating_reply -> nexus_support_replies.reply_id (1:1); rating_from, rating_staff -> core_members.member_id (o)
- nexus_support_tracker.member_id -> core_members.member_id; request_id -> nexus_support_requests.r_id
- nexus_support_views.view_rid -> nexus_support_requests.r_id; view_member -> core_members.member_id; view_reply -> nexus_support_replies.reply_id (o)
- nexus_support_notify.staff_id -> core_members.member_id
- nexus_support_stock_actions.action_department -> nexus_support_departments.dpt_id; action_status -> nexus_support_statuses.status_id; action_staff -> core_members.member_id
- nexus_support_request_log.rlog_request -> nexus_support_requests.r_id; rlog_member -> core_members.member_id
- nexus_support_streams.stream_owner -> core_members.member_id (o)
- nexus_support_staff_preferences.staff_id -> core_members.member_id (1:1)
- nexus_support_staff_dpt_order.staff_id -> core_members.member_id (o); department_id -> nexus_support_departments.dpt_id

**Other**
- nexus_donate_logs.dl_goal -> nexus_donate_goals.d_id (o); dl_member -> core_members.member_id (o); dl_invoice -> nexus_invoices.i_id (o)

**Logical list columns (33, dashed when enabled):** p_member_groups, p_secondary_group, p_methods (packages); pg_filters; pfm_values; cf_packages; sp_secondary_group, sp_gateways; sub_previous_secondary_groups; f_groups, f_customer_groups, f_products, f_methods, f_subscriptions (fraud rules); c_groups, c_products (coupons); i_renewal_ids; ps_grouped_renewals; alternate contacts `purchases`; sf_departments; dpt_staff, dpt_packages, dpt_subscriptions; support_notify `departments`; sev_departments; stream_departments, stream_statuses, stream_severities, stream_staff; rrule_purchase_packages, rrule_by_group, rrule_for_group; plus the metadata link `nexus_customer_fields.f_column`.

## 9. Findings on the schema (recorded as notes only, per the user)

- **13 key type mismatches** (child column type or signedness differs from the key it appears to reference). Examples: `nexus_member_subscriptions.sub_member_id` is signed BIGINT while `member_id` is unsigned; `sub_purchase_id`, `sub_invoice_id` and `nexus_invoice_tracker.invoice_id` are BIGINT against INT keys. Those against `core_members` are marked "stub type assumed".
- **Tables with no primary key:** `nexus_customer_spend`, `nexus_support_staff_dpt_order`, `nexus_package_filters_values`, `nexus_package_filters_map` (unique index only).
- **FLOAT used for money:** `nexus_payouts.po_amount`, `nexus_donate_goals.d_goal` and `d_current`, `nexus_donate_logs.dl_amount`.
- **AUTO_INCREMENT on non-key columns:** `nexus_customer_spend.spend_member_id`, `nexus_support_staff_preferences.staff_id`.
- **Mixed collations** across tables (utf8mb4_unicode_ci, utf8_general_ci, unspecified).
- **Shared column prefixes** (`p_`, `t_`, `f_`) made prefix-based inference need care.

## 10. Open items

- Real definitions of `core_members` and `core_groups` (and `core_sys_lang`) to replace the stubs and verify key types.
- Verification of cardinalities against the live database (currently accepted as correct without checking).
- Other purchase types for the polymorphic `ps_app` / `ps_type` / `ps_item_id` columns would need more links.
- Optional: save the generator script alongside this summary so the HTML can be rebuilt without re-deriving the model.

## 11. How to resume

Attach `schema.json` and this file, then ask Claude to rebuild `nexus_erd_browser.html` or to change one of: domain split, trimmed-column rules, logical-link handling, or the stubs once the core definitions are available.
