---
    title: CATALOGUE AND PURCHASES - FULL TABLE DESCRIPTION
---
erDiagram
    "**nexus_packages**" {
        int p_id PK "Primary key. This is the ID that tapestry_packages.id mirrors."
        varchar p_name "Language-key stem; the human title lives in core_sys_lang_words."
        varchar p_seo_name "URL slug."
        int p_group FK "FK → nexus_package_groups.pg_id — the store category."
        int p_stock "Stock level; -1 = unlimited."
        tinyint p_reg "Offer this package during registration."
        tinyint p_store "Show in the public store. Packages sold only by staff or by API are hidden here."
        text p_member_groups "Comma-separated core_groups.g_id allowed to buy, or *."
        tinyint p_allow_upgrading "Comma-separated package IDs this may be upgraded to, or *. Drives the Tapestry size-change journey."
        tinyint p_upgrade_charge "How the upgrade difference is charged (pro-rata vs full)."
        tinyint p_allow_downgrading "As above, for downgrades."
        tinyint p_downgrade_refund "How a downgrade is refunded (none / credit / refund)."
        text p_base_price "JSON map of currency → amount. See also nexus_package_base_prices."
        int p_tax FK "FK → nexus_tax.t_id."
        int p_renewal_days "Renewal term length, in the unit given by the renewal options."
        mediumint p_primary_group "Primary forum group granted while the purchase is active."
        text p_secondary_group "Secondary forum groups granted while active."
        tinyint p_return_primary "Primary group to restore when the purchase ends."
        tinyint p_return_secondary "Secondary groups to strip when the purchase ends."
        int p_position "Sort order within the group."
        text p_associable "Packages that may be attached as children of this one."
        tinyint p_force_assoc "Require an association at checkout."
        text p_assoc_error "Language key for the error shown when the association is missing."
        text p_discounts "JSON bulk/loyalty discount rules."
        mediumtext p_page FK "FK → a CMS page used as the product description."
        tinyint p_support "Purchasing this grants support access."
        int p_support_department FK "FK → nexus_support_departments.dpt_id for tickets raised against it."
        int p_support_severity FK "FK → nexus_support_severities.sev_id."
        tinyint p_featured "Featured in the store."
        tinyint p_upsell "JSON of packages to cross-sell."
        text p_notify "Staff emails notified on purchase."
        varchar p_type "Package subclass — product, subscription, ads, …. Tapestry packages are product."
        mediumint p_custom "JSON of package custom-field values/config."
        tinyint p_reviewable "Allow customer reviews."
        tinyint p_review_moderate "Hold reviews for approval."
        varchar p_image "Store image."
        text p_methods "Comma-separated nexus_paymethods.m_id accepted, or blank for all."
        text p_renew_options "JSON of the renewal terms offered at checkout."
        tinyint p_group_renewals "Combine renewals of this package onto one invoice."
        tinyint p_rebuild_thumb "Internal flag for the thumbnail rebuild task."
        int p_renewal_days_advance "How many days before expiry the renewal invoice is generated."
        int p_date_added "Unix timestamp."
        int p_reviews "Denormalised count of approved reviews."
        float p_rating "Denormalised average rating."
        int p_unapproved_reviews "Denormalised count awaiting moderation."
        int p_hidden_reviews "Denormalised count of hidden reviews."
        int p_grace_period "Seconds a lapsed purchase stays active past expiry before it is switched off. This is the stock mechanism the Promised Payment process works alongside."
        tinyint p_meta_data "JSON SEO meta."
        mediumtext p_email_purchase "Custom email body sent on purchase."
        mediumtext p_email_expire_soon "Custom email body sent before expiry."
        mediumtext p_email_expire "Custom email body sent on expiry."
        varchar p_email_purchase_type "Whether that email replaces or appends to the default."
        varchar p_email_expire_soon_type "Replace or append."
        varchar p_email_expire_type "Replace or append."
        int p_date_updated "Unix timestamp."
        varchar p_initial_term "A different term (and price) for the first period."
    }
    "**nexus_packages_products**" {
        int p_id PK, FK "FK → nexus_packages.p_id. Extra columns for packages of type product — every Tapestry package is a row here."
        tinyint p_physical "1 = needs shipping. Tapestry packages are 0."
        tinyint p_subscription "1 = the product renews on a recurring interval rather than being a one-off sale."
        text p_shipping "Comma-separated nexus_shipping.s_id methods offered."
        float p_weight "Shipping weight."
        varchar p_lkey "Licence key generator class, if the product issues one."
        varchar p_lkey_identifier "Licence key prefix/format."
        int p_lkey_uses "Activation limit on the issued key."
        tinyint p_show "Show the product in the store listing."
        float p_length "Shipping dimension."
        float p_width "Shipping dimension."
        float p_height "Shipping dimension."
    }
    "**nexus_packages_ads**" {
        any p_id
        any p_locations
        any p_exempt
        any p_expire
        any p_expire_unit
        any p_max_height
        any p_max_width
    }
    "**nexus_package_groups**" {
        int pg_id PK "Primary key."
        varchar pg_name "Language-key stem."
        varchar pg_seo_name "URL slug."
        int pg_position "Sort order."
        int pg_parent FK "FK → nexus_package_groups.pg_id; -1 for a root group."
        text pg_image "Category image."
        text pg_filters "Comma-separated nexus_package_filters.pf_id offered in this category."
        text pg_price_filters "JSON price bands offered as a filter in this category."
    }
    "**nexus_package_fields**" {
        int cf_id PK "Primary key. Field 1 holds the setting name — the Tapestry API rewrites nexus_purchases.ps_custom_fields[1] whenever a setting is renamed in Tapestry."
        varchar cf_name "Language-key stem."
        text cf_desc "Language-key stem for the description."
        varchar cf_type "Form helper class."
        text cf_extra "JSON options for the field type."
        text cf_packages "Comma-separated nexus_packages.p_id the field applies to."
        int cf_position "Sort order."
        tinyint cf_sticky "Carry the value over to renewals/upgrades."
        tinyint cf_purchase "Store the value against the purchase (in ps_custom_fields)."
        tinyint cf_required "Required at checkout."
        tinyint cf_editable "Customer may change it after purchase."
        tinyint cf_multiple "Accepts multiple values."
        tinyint cf_invoice "Show the value on the invoice."
        tinyint cf_allow_attachments "Field accepts uploads."
    }
    "**nexus_package_base_prices**" {
        any id
    }
    "**nexus_package_images**" {
        any image_id
        any image_product
        any image_location
        any image_primary
        any image_temp
    }
    "**nexus_package_filters**" {
        any pfilter_id
        any pfilter_order
    }
    "**nexus_package_filters_values**" {
        any pfv_filter
        any pfv_value
        any pfv_lang
        any pfv_text
        any pfv_order
    }
    "**nexus_package_filters_map**" {
        any pfm_package
        any pfm_filter
        any pfm_values
    }
    "**nexus_product_options**" {
        any opt_id
        any opt_package
        any opt_values
        any opt_stock
        any opt_base_price
        any opt_renew_price
    }
    "**nexus_reviews**" {
        any review_id
        any review_product
        any review_author_id
        any review_author_name
        any review_ip_address
        any review_date
        any review_edit_date
        any review_approved
        any review_text
        any review_rating
        any review_useful
        any review_votes
        any review_edit_show
        any review_edit_member_name
        any review_edit_reason
        any review_edit_member_id
        any review_vote_data
        any review_author_response
    }
    "**nexus_cart_uploads**" {
        any id
        any session_id
        any time
        any item_id
    }
    "**nexus_tax**" {
        int t_id PK "Primary key."
        varchar t_name "Language-key stem (e.g. “VAT”)."
        text t_rate "JSON rate table, keyed by country/region."
        int t_order "Sort order."
        enum t_type "single (one flat rate) or eu (per-country EU VAT table, which enables the VAT-number reverse charge)."
    }
    "**nexus_shipping**" {
        any s_id
        any s_name
        any s_locations
        any s_type
        any s_rates
        any s_tax
        any s_order
    }
    "**nexus_ship_orders**" {
        any o_id
        any o_invoice
        any o_data
        any o_status
        any o_method
        any o_items
        any o_date
        any o_shipped_date
        any o_service
        any o_tracknumber
        any o_api
        any o_api_service
        any o_label
        any o_extra
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
    "**tapestry_packages**" {
        bigint id PK, FK "FK → nexus_packages.p_id. A row existing here is what makes a Nexus package 'a Tapestry package' — Schools::isTapestryPackage() is literally a lookup on this column. Declared AUTO_INCREMENT, but always written explicitly as the Nexus package ID."
        int children "The child allowance the package grants. Schools::packages() keys the whole price ladder by this."
    }
    "**nexus_packages**"          }o..|| "**nexus_package_groups**"     : "p_group"
    "**nexus_packages**"          ||..o| "**nexus_packages_products**"  : "p_id, subtype"
    "**nexus_packages**"          ||..o| "**nexus_packages_ads**"       : "p_id, subtype"
    "**nexus_packages**"          ||..o{ "**nexus_package_images**"     : "image_product"
    "**nexus_packages**"          ||..o| "**nexus_package_base_prices**": "id"
    "**nexus_packages**"          ||..o{ "**nexus_product_options**"    : "opt_package"
    "**nexus_packages**"          ||..o{ "**nexus_reviews**"            : "review_product"
    "**nexus_packages**"          }o..|| "**nexus_tax**"                : "p_tax"
    "**nexus_package_filters**"   ||..o{ "**nexus_package_filters_values**" : "pfilter_id"
    "**nexus_package_filters**"   ||..o{ "**nexus_package_filters_map**"    : "pfm_filter"
    "**nexus_packages**"          ||..o{ "**nexus_package_filters_map**"    : "pfm_package"
    "**nexus_package_fields**"    }o..o{ "**nexus_packages**"           : "cf_packages"
    "**nexus_packages_products**" }o..o{ "**nexus_shipping**"           : "p_shipping"
    "**nexus_ship_orders**"       }o..|| "**nexus_shipping**"            : "o_method"
    "**nexus_packages**"          ||..o| "**tapestry_packages**"        : "p_id = id"
    "**nexus_packages**"          ||..o{ "**nexus_purchases**"          : "ps_item_id"
    "**nexus_purchases**"         ||..o{ "**nexus_purchases**"          : "ps_parent, self"
    "**nexus_purchases**"         ||..o{ "**nexus_cart_uploads**"       : "item_id"
