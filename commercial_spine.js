erDiagram
    "**core_members**" {
        bigint member_id PK
        string name "forum display name"
    }
    "**nexus_customers**" {
        bigint member_id PK "commerce extension of a member"
        varchar cm_first_name
        varchar cm_last_name
        text cm_profiles "JSON gateway tokens"
    }
    "**nexus_invoices**" {
        int i_id PK
        bigint i_member FK
        char i_status "paid, pend, expd, canc"
        decimal i_total
        text i_renewal_ids "JSON list of ps_id"
    }
    "**nexus_transactions**" {
        int t_id PK
        int t_invoice FK
        int t_method FK
        char t_status
        decimal t_amount
    }
    "**nexus_paymethods**" {
        int m_id PK
        varchar m_gateway "Stripe, PayPal, GlobalPay, Manual"
    }
    "**nexus_purchases**" {
        int ps_id PK "shared with tapestry_schools.school_pkg_id"
        bigint ps_member FK
        int ps_item_id FK
        int ps_original_invoice FK
        tinyint ps_active
        int ps_expire "unix ts, 0 = never"
    }
    "**nexus_packages**" {
        int p_id PK "shared with tapestry_packages.id"
        int p_group FK
        varchar p_type "product, subscription, ads"
        text p_base_price "JSON currency map"
    }
    "**nexus_package_groups**" {
        int pg_id PK
        varchar pg_name
        int pg_parent FK "self reference"
    }
    "**tapestry_packages**" {
        bigint id PK, FK "= nexus_packages.p_id"
        int children "child allowance"
    }
    "**tapestry_schools**" {
        int school_id PK "shared with the Tapestry API"
        int school_pkg_id FK "to nexus_purchases.ps_id"
        int school_admin_id FK "to nexus_customers"
        tinyint school_enabled
        tinyint school_non_eu_processing_consent
    }
    "**tapestry_trials**" {
        int trial_id PK
        int trial_school_id FK
        int trial_customer_id FK
        int trial_purchase_id FK
        int trial_expires
    }
    "**tapestry_promised**" {
        int promise_id PK
        int promise_invoice_id FK
        int promise_school_id FK
        int promise_actioned "0 = live"
    }
    "**nexus_support_requests**" {
        int r_id PK
        bigint r_member FK
        int r_purchase FK
        int r_non_eu_status "custom column, section 5"
    }
    "**tapestry_support_request_schools**" {
        int request_id PK, FK
        int school_id PK, FK
    }
    "**foundation_la**" {
        int la_id PK
        varchar la_title
        int la_club_id FK
    }
    "**foundation_group_upgrade_history**" {
        int rid PK
        int rkeyid FK "to foundation_la.la_id"
        int ruserid FK "to core_members"
        int rexpiredate "unix ts, live if greater than now"
    }
    "**core_clubs**" {
        int id PK
        string name "forum club, grants private forums"
    }

    "**core_members**"      ||..|| "**nexus_customers**"        : "is a"
    "**nexus_customers**"   ||..o{ "**nexus_invoices**"          : "raises"
    "**nexus_invoices**"    ||..o{ "**nexus_transactions**"      : "settled by"
    nexus_transactions      }o..|| nexus_paymethods        : "via"
    nexus_customers         ||..o{ nexus_purchases         : "owns"
    nexus_invoices          ||..o{ nexus_purchases         : "ps_original_invoice"
    nexus_purchases         }o..|| nexus_packages          : "ps_item_id"
    nexus_packages          }o..|| nexus_package_groups    : "p_group"
    nexus_packages          ||..o| tapestry_packages       : "p_id = id"
    nexus_purchases         ||..o| tapestry_schools        : "ps_id = school_pkg_id"
    nexus_customers         ||..o{ tapestry_schools        : "school_admin_id"
    tapestry_schools        ||..o| tapestry_trials         : "school_id"
    tapestry_schools        ||..o{ tapestry_promised       : "school_id"
    tapestry_schools        ||..o{ tapestry_support_request_schools : "school_id"
    nexus_support_requests  ||..o{ tapestry_support_request_schools : "r_id"
    nexus_customers         ||..o{ nexus_support_requests  : "r_member"
    nexus_purchases         ||..o{ nexus_support_requests  : "r_purchase"
    foundation_la           ||..o{ foundation_group_upgrade_history : "rkeyid"
    core_members            ||..o{ foundation_group_upgrade_history : "ruserid"
    foundation_la           }o..|| core_clubs              : "la_club_id"
