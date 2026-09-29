---
    title: SUPPORT DESK - FULL TABLE DESCRIPTION
---
erDiagram
    "**nexus_customers**" {
        bigint member_id PK, FK "FK → core_members.member_id. A Nexus customer is a forum member; this table is the commerce extension of it."
        varchar cm_first_name "Billing first name. Distinct from the forum display name."
        varchar cm_last_name "Billing last name."
        varchar cm_phone "Phone number. Shown next to the setting in the ACP settings list."
        text cm_profiles "JSON. Per-gateway stored customer/profile IDs (e.g. a gateway vault token)."
        varchar field_1 "Generated column for custom customer field #1. The field definition — its name, type and this column name — lives in nexus_customer_fields; one such column is added per field."
    }
    "**nexus_purchases**" {
        int ps_id PK "Primary key. The Tapestry link: tapestry_schools.school_pkg_id = ps_id. One live purchase = one Tapestry setting."
        bigint ps_member FK "FK → nexus_customers.member_id — who owns the subscription."
        varchar ps_name "Display name, denormalised at purchase time."
        tinyint ps_active "1 = live. Read by the Tapestry provisioning hooks: this is what decides whether the account is switched on."
        tinyint ps_cancelled "1 = cancelled by customer or staff (as opposed to simply lapsed)."
        int ps_start "Unix timestamp the subscription began."
        int ps_expire "Unix timestamp of the next renewal date. 0 = never expires. Surfaced in the ACP settings list as “Expires”."
        int ps_renewals "JSON renewal term (amount, currency, interval)."
        decimal ps_renewal_price "Renewal amount."
        char ps_renewal_unit "Renewal interval unit (d/m/y)."
        varchar ps_app "Owning application — nexus for store purchases."
        varchar ps_type "Purchase subclass — package, subscription, …"
        int ps_item_id FK "FK → nexus_packages.p_id (for ps_app=nexus, ps_type=package). Joined to tapestry_packages.id to read the child allowance."
        varchar ps_item_uri "Front-end URL for the purchased item."
        varchar ps_admin_uri "ACP URL for the purchased item. Written by the provisioning task so staff can jump into Tapestry."
        mediumtext ps_custom_fields "JSON, keyed by nexus_package_fields.cf_id. Key 1 is the setting name, kept in step with Tapestry."
        text ps_extra "JSON extension-specific payload."
        int ps_parent FK "FK → nexus_purchases.ps_id for an associated child purchase."
        int ps_invoice_pending FK "FK → nexus_invoices.i_id — the unpaid renewal invoice, if one is out."
        tinyint ps_invoice_warning_sent "Unix timestamp the “about to expire” warning went out."
        bigint ps_pay_to "Commission recipient (marketplace feature)."
        int ps_commission "Commission percentage."
        int ps_original_invoice FK "FK → nexus_invoices.i_id — the invoice that created the purchase."
        int ps_tax FK "FK → nexus_tax.t_id applied at renewal."
        tinyint ps_can_reactivate "Whether a lapsed purchase may be reactivated by paying."
        text ps_grouped_renewals "Renew together with sibling purchases on one invoice."
        char ps_renewal_currency "ISO currency of the renewal amount."
        tinyint ps_show "Show in the customer’s client area. 0 hides internal/system purchases."
        int ps_grace_period "Seconds past ps_expire that this purchase stays active, overriding p_grace_period."
        bigint ps_billing_agreement FK "FK → nexus_billing_agreements.ba_id for an automatic recurring mandate."
        decimal ps_fee "Per-renewal fee added on top."
    }
    "**nexus_support_requests**" {
        int r_id PK "Primary key — the ticket number."
        varchar r_title "Ticket subject."
        bigint r_member FK "FK → nexus_customers.member_id. 0 when the ticket arrived by email from an unknown address."
        int r_department FK "FK → nexus_support_departments.dpt_id."
        int r_purchase FK "FK → nexus_purchases.ps_id the ticket is raised against."
        int r_status FK "FK → nexus_support_statuses.status_id."
        int r_severity FK "FK → nexus_support_severities.sev_id."
        tinyint r_severity_lock "Staff have pinned the severity; the customer cannot change it."
        int r_started "Unix timestamp opened."
        int r_last_reply "Unix timestamp of the most recent reply of any kind."
        bigint r_last_reply_by FK "FK → core_members.member_id."
        int r_last_new_reply "Unix timestamp of the most recent customer reply."
        int r_last_staff_reply "Unix timestamp of the most recent staff reply."
        bigint r_staff FK "FK → core_members.member_id — the assigned agent."
        tinyint r_staff_lock "Ticket is locked to that agent."
        int r_replies "Denormalised reply count."
        text r_notify "JSON list of members watching the ticket."
        varchar r_email "Originating email address for an email-in ticket."
        char r_email_key "Token embedded in outgoing mail so replies thread back to this ticket."
        tinyint r_ar_notify "Auto-responder bookkeeping."
        mediumtext r_cfields "JSON custom field values, keyed by nexus_support_fields.sf_id."
        int r_ppi_invoice FK "FK → nexus_invoices.i_id for pay-per-incident support."
        int r_non_eu_status "CUSTOM — 0 not checked · 1 visible to non-EU staff · 2 not visible · 3 needs recheck. See §5."
        int r_non_eu_status_changed_at "CUSTOM — when the computed status last changed."
        int r_non_eu_override "CUSTOM — 0 none · 1 force visible · 2 force hidden. Beats r_non_eu_status."
        int r_non_eu_overridden_by FK "CUSTOM — FK → core_members.member_id."
        int r_non_eu_overridden_at "CUSTOM — when the override was set."
    }
    "**nexus_support_replies**" {
        int reply_id PK "Primary key."
        int reply_request FK "FK → nexus_support_requests.r_id."
        bigint reply_member FK "FK → core_members.member_id."
        char reply_type "m member · s staff · n staff-only note · h hidden/log entry."
        mediumtext reply_post "Reply body (HTML)."
        tinyint reply_hidden "Reply is hidden from the customer."
        int reply_date "Unix timestamp."
        varchar reply_email "Originating address where the reply arrived by email."
        text reply_cc "JSON CC list for an email-in/out reply."
        mediumtext reply_raw "The raw inbound email, kept for email-originated replies."
        char reply_textformat "Whether reply_post is HTML or plain text."
        varchar reply_ip_address "IP the reply came from."
        text reply_bcc "JSON BCC list."
        tinyint reply_is_first "1 for the reply that is the ticket body itself."
    }
    "**nexus_support_departments**" {
        int dpt_id PK "Primary key."
        varchar dpt_name "Language-key stem. One department is designated the non-EU processing department — its ID is held in the non_eu_processing_support_department_id setting."
        tinyint dpt_open "Accepting new tickets."
        tinyint dpt_require_package "Require an active purchase to raise a ticket here."
        text dpt_packages "Comma-separated nexus_packages.p_id that grant access."
        int dpt_position "Sort order."
        varchar dpt_email "Inbound/outbound email address for the department."
        text dpt_notify "JSON staff/emails notified of new tickets."
        tinyint dpt_notify_reply "Also notify them of replies, not just new tickets."
        text dpt_ppi "JSON pay-per-incident pricing."
        text dpt_staff "Staff or groups who can see the department."
        int dpt_ppi_tax FK "FK → nexus_tax.t_id for the PPI charge."
        text dpt_subscriptions "Member-subscription tiers that grant access."
    }
    "**nexus_support_statuses**" {
        int status_id PK "Primary key."
        varchar status_name "Internal (staff-facing) name."
        varchar status_public_name "Customer-facing name."
        varchar status_public_set "Whether the customer may move a ticket into this status."
        tinyint status_default_member "Default status when the customer replies."
        tinyint status_default_staff "Default status when staff reply."
        tinyint status_is_locked "Ticket is read-only in this status."
        tinyint status_assign "Moving into this status assigns the ticket to the acting staff member."
        int status_position "Sort order."
        tinyint status_open "Counts as an open ticket."
        char status_color "Badge colour in the ACP."
        tinyint status_log "Record status changes into nexus_support_request_log."
    }
    "**nexus_support_severities**" {
        int sev_id PK "Primary key."
        varchar sev_name "Language-key stem."
        text sev_icon "Icon shown against the severity."
        char sev_color "Badge colour."
        tinyint sev_default "Default for new tickets."
        tinyint sev_public "Customer may choose it."
        int sev_position "Sort order."
        varchar sev_action "Automatic action taken when a ticket is set to this severity."
        text sev_departments "Departments the severity is offered in."
    }
    "**nexus_support_fields**" {
        any sf_id
        any sf_name
        any sf_desc
        any sf_type
        any sf_extra
        any sf_departments
        any sf_position
        any sf_required
        any sf_multiple
        any sf_max_input
        any sf_input_format
        any sf_validate
        any sf_allow_attachments
    }
    "**nexus_support_stock_actions**" {
        any action_id
        any action_name
        any action_department
        any action_status
        any action_staff
        any action_message
        any action_position
        any action_show_in
    }
    "**nexus_support_request_log**" {
        any rlog_id
        any rlog_request
        any rlog_member
        any rlog_action
        any rlog_old
        any rlog_new
        any rlog_date
    }
    "**nexus_support_ratings**" {
        any rating_reply
        any rating_rating
        any rating_from
        any rating_staff
        any rating_note
        any rating_date
    }
    "**nexus_support_tracker**" {
        any member_id
        any request_id
        any notify
    }
    "**nexus_support_views**" {
        any view_rid
        any view_member
        any view_first
        any view_last
        any view_reply
    }
    "**nexus_support_staff_dpt_order**" {
        any staff_id
        any department_id
        any dpt_position
    }
    "**tapestry_schools**" {
        int school_id "Shared with Tapestry — the same integer identifies the setting on both sides. Auto-increment, but the provisioning task will reassign it to MAX(school_id)+1 if Tapestry reports the ID already exists."
        int school_added "Unix timestamp the setting was queued."
        tinyint school_enabled "1 = live. Set to 0 on cancel or expiry, back to 1 on reactivation or trial extension."
        varchar school_email "Account owner's email at creation time."
        varchar school_name "Setting name. Tapestry owns this — a rename is pushed back here by POST /tapestry/settingdetails/{id}."
        varchar school_furl_slug "URL slug. Generated locally, then overwritten with whatever Tapestry returns from addSchool."
        varchar school_address1 "Address line 1. Dormant — addToQueue() writes '' and nothing in this codebase updates it. The value is still forwarded to Tapestry's addSchool call, so new settings are provisioned with a blank address. Older rows may hold real data from a previous code path."
        varchar school_address2 "Address line 2. Same as above."
        varchar school_city "City. Same as above."
        varchar school_county "County. Same as above."
        varchar school_postcode "Postcode. Same as above."
        text school_geoloc "Geolocation. Dormant — written '' on creation, never read or updated."
        varchar school_fsf_key "Intended to hold the LA scheme key used at sign-up. Dormant — both callers of addToQueue() pass '', and nothing reads it."
        int school_admin_id FK "FK → core_members.member_id / nexus_customers.member_id — the account owner. Joined in almost every settings query."
        int school_ofsted_id "Ofsted URN. Dormant — written as 0 on creation, never updated. The URN that is actually used lives on the trial request (cms_custom_database_21.field_159)."
        int school_pkg_id FK "FK → nexus_purchases.ps_id. The subscription paying for this setting. Declared as a secondary ID field, so Schools::load( $id, 'school_pkg_id' ) loads a setting straight from a purchase."
        int school_max_children "Child allowance, denormalised from tapestry_packages.children at the point of purchase or change."
        int school_setup_queued "Provisioning queue counter. > 0 means the create task should pick it up; it doubles as the retry count and gives up after 3."
        int school_setting_up "Unix timestamp lock, so two runs of the create task cannot provision the same setting. Cleared automatically after 10 minutes."
        tinyint school_trial "1 = this is a trial account."
        int school_trial_expires "Unix timestamp the trial ends. Kept in step with nexus_purchases.ps_expire."
        int school_version "Tapestry platform version. Hard-coded to 2 for new settings; never read here."
        int school_status_changed_at "Unix timestamp of the last cancel, expire or reactivate. Sent to Tapestry so it can discard out-of-order status pushes. (The one column with a real schema definition.)"
        int school_details_updated_at "Unix timestamp of the last details push from Tapestry. An inbound push carrying an older timestamp is discarded — this is the conflict resolution for a field both systems can write."
        tinyint school_non_eu_processing_consent "Whether the setting has consented to its data being processed outside the EU. Collected in Tapestry, acted on here. Changing it resets every related ticket to r_non_eu_status = 3 (needs recheck)."
    }
    "**tapestry_support_request_schools**" {
        int request_id PK, FK "FK → nexus_support_requests.r_id."
        int school_id PK, FK "FK → tapestry_schools.school_id."
    }
    "**nexus_customers**"               ||..o{ "**nexus_support_requests**"        : "r_member"
    "**nexus_purchases**"                ||..o{ "**nexus_support_requests**"        : "r_purchase"
    "**nexus_support_departments**"      ||..o{ "**nexus_support_requests**"        : "r_department"
    "**nexus_support_statuses**"         ||..o{ "**nexus_support_requests**"        : "r_status"
    "**nexus_support_severities**"       ||..o{ "**nexus_support_requests**"        : "r_severity"
    "**nexus_support_requests**"         ||..o{ "**nexus_support_replies**"         : "reply_request"
    "**nexus_support_requests**"         ||..o{ "**nexus_support_request_log**"     : "rlog_request"
    "**nexus_support_replies**"          ||..o| "**nexus_support_ratings**"         : "rating_reply"
    "**nexus_support_requests**"         ||..o{ "**nexus_support_tracker**"         : "request_id"
    "**nexus_support_requests**"         ||..o{ "**nexus_support_views**"           : "view_rid"
    "**nexus_support_departments**"      ||..o{ "**nexus_support_fields**"          : "sf_departments"
    "**nexus_support_departments**"      ||..o{ "**nexus_support_stock_actions**"   : "action_department"
    "**nexus_support_departments**"      ||..o{ "**nexus_support_staff_dpt_order**" : "department_id"
    "**nexus_support_requests**"         ||..o{ "**tapestry_support_request_schools**" : "r_id"
    "**tapestry_schools**"                ||..o{ "**tapestry_support_request_schools**" : "school_id"
