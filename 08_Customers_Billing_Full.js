---
    title: CUSTOMERS AND BILLING - FULL TABLE DESCRIPTION
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
    "**nexus_customer_addresses**" {
        bigint id PK "Primary key."
        bigint member FK "FK → nexus_customers.member_id."
        text address "JSON \IPS\GeoLocation blob: address lines, city, region, country, postcode."
        int primary_billing "1 = use as the default billing address."
        tinyint primary_shipping "1 = use as the default shipping address."
        int added "Unix timestamp the address was stored."
    }
    "**nexus_customer_cards**" {
        bigint card_id PK "Primary key."
        bigint card_member FK "FK → nexus_customers.member_id."
        int card_method FK "FK → nexus_paymethods.m_id — which gateway holds the token."
        text card_data "Encrypted gateway token — not a PAN. The card itself is held by the gateway."
    }
    "**nexus_customer_fields**" {
        int f_id PK "Primary key."
        varchar f_column "Name of the generated column added to nexus_customers for this field (e.g. field_1)."
        varchar f_name "Language-key stem for the field label."
        varchar f_type "Form helper class (Text, Select, Checkbox, …)."
        text f_extra "JSON options for the field type (select choices, validation, …)."
        int f_position "Sort order on the form."
        tinyint f_reg_show "Ask for it at registration."
        tinyint f_reg_require "Require it at registration."
        tinyint f_purchase_show "Ask for it at checkout."
        tinyint f_purchase_require "Require it at checkout."
        tinyint f_multiple "Accepts multiple values."
        tinyint f_allow_attachments "Field accepts uploads."
    }
    "**nexus_alternate_contacts**" {
        bigint main_id PK, FK "FK → nexus_customers.member_id — the account being shared."
        bigint alt_id PK, FK "FK → nexus_customers.member_id — the person granted access."
        text purchases "JSON list of nexus_purchases.ps_id the contact may see. Empty = all."
        tinyint billing "1 = may see and pay invoices. Used by the non-EU support check — alternate billing contacts are resolved to settings when deciding ticket visibility."
        tinyint support "1 = may raise and read support tickets on the account."
    }
    "**nexus_notes**" {
        int note_id PK "Primary key."
        bigint note_member FK "FK → nexus_customers.member_id — who the note is about."
        text note_text "Staff-only note body (HTML)."
        bigint note_author FK "FK → core_members.member_id — the staff member who wrote it."
        int note_date "Unix timestamp."
    }
    "**nexus_customer_spend**" {
        char spend_currency "ISO currency code. Spend is tracked per currency, so one customer can have several rows."
        bigint spend_member_id FK "FK → nexus_customers.member_id."
        decimal spend_amount "Lifetime total paid in that currency. Used by coupon/discount rules."
    }
    "**nexus_invoices**" {
        int i_id PK "Primary key. The invoice number customers and Tapestry both quote."
        char i_status "paid · pend (unpaid) · expd (expired unpaid) · canc (cancelled)."
        varchar i_title "Invoice title."
        bigint i_member FK "FK → nexus_customers.member_id. 0 for a guest checkout — see i_guest_data."
        text i_items "JSON line items (newer rows) or a PHP-serialised array (legacy rows). The Promise code has to handle both."
        decimal i_total "Gross total including tax."
        int i_date "Unix timestamp raised."
        varchar i_return_uri "Where to send the customer after payment."
        int i_paid "Unix timestamp paid. Payment here is what triggers Tapestry provisioning."
        text i_status_extra "JSON detail behind the status (e.g. why it was cancelled)."
        smallint i_discount "Discount amount applied."
        text i_renewal_ids "JSON list of nexus_purchases.ps_id this invoice renews."
        varchar i_po "Customer purchase-order number. Used heavily by schools paying on invoice."
        text i_notes "Free-text notes shown on the invoice."
        text i_shipaddress "JSON snapshot of the shipping address at the time."
        text i_billaddress "JSON snapshot of the billing address at the time."
        char i_currency "ISO currency code."
        text i_guest_data "JSON checkout details for a guest invoice. Guest checkout cannot view the printed invoice — see applications/tapestry/hooks/printInvoicCredit.php."
        char i_billcountry "ISO country code of the billing address, denormalised for tax reporting."
    }
    "**nexus_transactions**" {
        int t_id PK "Primary key."
        bigint t_member FK "FK → nexus_customers.member_id."
        int t_invoice FK "FK → nexus_invoices.i_id."
        int t_method FK "FK → nexus_paymethods.m_id. NULL where the payment came from account credit."
        char t_status "okay paid · pend not yet submitted · wait awaiting the customer (e.g. cheque in the post) · hold held for approval · revw flagged for staff review · fail refused · rfnd refunded · prfd part-refunded · gwpd gateway processing · dspd disputed/chargeback."
        decimal t_amount "Amount taken."
        int t_date "Unix timestamp."
        text t_extra "JSON gateway response payload."
        text t_fraud FK "FK → nexus_fraud_rules.f_id that matched, if any."
        varchar t_gw_id "The gateway’s own transaction reference. For GlobalPay this is the Realex order/pasref."
        varchar t_ip "Payer IP address."
        int t_fraud_blocked "Set when a fraud rule blocked the transaction."
        char t_currency "ISO currency code."
        decimal t_partial_refund "Amount refunded so far where t_status is prfd."
        int t_auth "Unix timestamp the authorisation expires (auth-then-capture flows)."
        bigint t_billing_agreement FK "FK → nexus_billing_agreements.ba_id where this was an automatic collection."
        decimal t_credit "Portion of the payment taken from the customer’s account credit rather than the gateway."
    }
    "**nexus_paymethods**" {
        int m_id PK "Primary key. The method name is a language key derived from this ID, not a column."
        varchar m_gateway "Gateway class — Stripe, PayPal, Manual, GlobalPay, …. GlobalPay (Realex) is the custom one; BACS/purchase-order payments run through a Manual method."
        text m_settings "JSON gateway credentials and options."
        tinyint m_active "Available at checkout."
        int m_position "Sort order."
        text m_countries "Comma-separated ISO country codes this method is offered in, or *."
        varchar m_validationfile "Path to a gateway domain-verification file (e.g. Apple Pay)."
    }
    "**nexus_billing_agreements**" {
        bigint ba_id PK "Primary key."
        varchar ba_gw_id "The gateway’s own agreement/mandate reference."
        int ba_method FK "FK → nexus_paymethods.m_id."
        bigint ba_member FK "FK → nexus_customers.member_id."
        int ba_started "Unix timestamp."
        int ba_next_cycle "Unix timestamp of the next scheduled collection."
        tinyint ba_canceled "Unix timestamp of cancellation, or 0."
    }
    "**nexus_coupons**" {
        int c_id PK "Primary key."
        varchar c_code "The code the customer types. Trial requests carry a promo code in the CMS trial database."
        text c_discount "JSON discount value — a percentage, or a per-currency amount, per c_unit."
        char c_unit "% for a percentage discount, - for a fixed amount off."
        text c_products "Comma-separated nexus_packages.p_id the coupon applies to. Blank = anything."
        tinyint c_limit_discount "Cap the discount at the value of the qualifying items."
        text c_groups "Comma-separated core_groups.g_id allowed to redeem."
        int c_uses "Total remaining uses; -1 = unlimited."
        int c_member_uses "Per-customer use limit."
        int c_start "Unix timestamp the coupon opens."
        int c_end "Unix timestamp the coupon closes."
        text c_used_by "JSON map of member ID → times used."
        tinyint c_combine "May be stacked with another coupon."
        tinyint c_renewals "Also applies to renewal invoices, not just the first purchase."
    }
    "**nexus_donate_goals**" {
        any d_id
        any d_name
        any d_desc
        any d_goal
        any d_current
        any d_position
        any d_currency
        any d_name_seo
    }
    "**nexus_donate_logs**" {
        any dl_id
        any dl_goal
        any dl_member
        any dl_amount
        any dl_invoice
        any dl_date
    }
    "**nexus_payouts**" {
        any po_id
        any po_amount
        any po_member
        any po_gateway
        any po_data
        any po_status
        any po_date
        any po_currency
        any po_completed
        any po_gw_id
        any po_ip
        any po_processed_by
    }
    "**nexus_fraud_rules**" {
        any f_id
        any f_name
        any f_groups
        any f_amount
        any f_amount_unit
        any f_methods
        any f_voucher
        any f_email
        any f_email_unit
        any f_country
        any f_maxmind
        any f_maxmind_unit
        any f_maxmind_address_valid
        any f_maxmind_address_match
        any f_maxmind_proxy
        any f_maxmind_proxy_unit
        any f_maxmind_freeemail
        any f_maxmind_phone_match
        any f_maxmind_riskyemail
        any f_trans_okay
        any f_trans_okay_unit
        any f_trans_fraud
        any f_trans_fraud_unit
        any f_action
        any f_action_ban
        any f_order
        any f_coupon
        any f_products
        any f_customer_reg
        any f_customer_reg_unit
        any f_customer_groups
        any f_customer_spend
        any f_customer_spend_unit
        any f_last_okay_trans
        any f_last_okay_trans_unit
        any f_ip
        any f_ip_unit
        any f_trans_fail
        any f_trans_fail_unit
        any f_custom_fields
        any f_subscriptions
    }
    "**nexus_invoice_tracker**" {
        any member_id
        any invoice_id
    }
    "**nexus_customers**"      ||..o{ "**nexus_customer_addresses**"  : "member"
    "**nexus_customers**"      ||..o{ "**nexus_customer_cards**"      : "card_member"
    "**nexus_customer_fields**" ||..o{ "**nexus_customers**"           : "adds column field_N"
    "**nexus_customers**"      ||..o{ "**nexus_alternate_contacts**"  : "main_id"
    "**nexus_customers**"      ||..o{ "**nexus_alternate_contacts**"  : "alt_id"
    "**nexus_customers**"      ||..o{ "**nexus_notes**"               : "note_member"
    "**nexus_customers**"      ||..o{ "**nexus_customer_spend**"      : "spend_member_id"
    "**nexus_customers**"      ||..o{ "**nexus_invoices**"            : "i_member"
    "**nexus_coupons**"        }o..o{ "**nexus_invoices**"            : "c_used_by, redemption"
    "**nexus_invoices**"       ||..o{ "**nexus_transactions**"        : "t_invoice"
    "**nexus_customers**"      ||..o{ "**nexus_transactions**"        : "t_member"
    "**nexus_transactions**"   }o..o| "**nexus_paymethods**"          : "t_method"
    "**nexus_customers**"      ||..o{ "**nexus_billing_agreements**"  : "ba_member"
    "**nexus_billing_agreements**" }o..|| "**nexus_paymethods**"       : "ba_method"
    "**nexus_customer_cards**" }o..|| "**nexus_paymethods**"          : "card_method"
    "**nexus_donate_goals**"   ||..o{ "**nexus_donate_logs**"         : "d_id"
    "**nexus_customers**"      ||..o{ "**nexus_donate_logs**"         : "dl_member"
    "**nexus_invoices**"       ||..o| "**nexus_donate_logs**"         : "dl_invoice"
    "**nexus_customers**"      ||..o{ "**nexus_payouts**"             : "po_member"
    "**nexus_transactions**"   }o..o| "**nexus_fraud_rules**"         : "t_fraud match"
    "**nexus_invoices**"       ||..o{ "**nexus_invoice_tracker**"     : "invoice_id"
    "**nexus_customers**"      ||..o{ "**nexus_invoice_tracker**"     : "member_id"
