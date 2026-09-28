erDiagram
    nexus_customers {
        bigint member_id PK
    }
    nexus_packages {
        int p_id PK
    }
    nexus_purchases {
        int ps_id PK
        int ps_item_id FK
    }
    nexus_invoices {
        int i_id PK
    }
    nexus_support_requests {
        int r_id PK
    }
    nexus_alternate_contacts {
        bigint main_id PK, FK
        bigint alt_id PK, FK
    }
    tapestry_schools {
        int school_id PK "shared with the Tapestry API"
        int school_pkg_id FK "to nexus_purchases.ps_id"
        int school_admin_id FK "to nexus_customers"
        varchar school_name "Tapestry owns this value"
        tinyint school_non_eu_processing_consent
    }
    tapestry_packages {
        bigint id PK, FK "= nexus_packages.p_id"
        int children "child allowance"
    }
    tapestry_trials {
        int trial_id PK
        int trial_school_id FK
        int trial_customer_id FK
        int trial_purchase_id FK
        tinyint trial_upgraded
        tinyint trial_cancelled
    }
    tapestry_promised {
        int promise_id PK
        int promise_invoice_id FK
        int promise_school_id FK
        int promise_actioned "0 = live"
    }
    tapestry_support_request_schools {
        int request_id PK, FK
        int school_id PK, FK
    }
    tapestry_api_log {
        bigint api_id PK
        varchar api_method "addSchool, cancelSchool, expireSchool ..."
        tinyint api_failed
    }
    tapestry_globalpay {
        varchar gp_key PK "GlobalPay hosted-payment-page cache"
        int gp_expire "not enforced, rows accumulate"
    }
    tapestry_findus {
        int findus_id PK
        int findus_member_id FK
        varchar findus_answer
    }
    cms_custom_database_21 {
        int record_id PK "external CMS table, trial request form"
        varchar field_148 "setting name"
        varchar field_149 "email"
        tinyint record_approved
    }

    tapestry_schools        ||..o| nexus_purchases                 : "school_pkg_id = ps_id"
    tapestry_schools        }o..|| nexus_customers                  : "school_admin_id"
    nexus_purchases          }o..|| nexus_packages                   : "ps_item_id"
    nexus_packages           ||..o| tapestry_packages                : "p_id = id"
    tapestry_trials          ||..|| tapestry_schools                 : "trial_school_id"
    tapestry_trials          }o..|| nexus_customers                  : "trial_customer_id"
    tapestry_trials          }o..o| nexus_purchases                  : "trial_purchase_id"
    tapestry_promised        }o..|| nexus_invoices                   : "promise_invoice_id"
    tapestry_promised        }o..|| tapestry_schools                 : "promise_school_id"
    tapestry_support_request_schools }o..|| nexus_support_requests   : "request_id"
    tapestry_support_request_schools }o..|| tapestry_schools         : "school_id"
    nexus_alternate_contacts }o..|| nexus_customers                  : "alt_id, non-EU resolution"
    tapestry_findus          }o..o| nexus_customers                  : "findus_member_id"
    cms_custom_database_21   ||..o| tapestry_schools                 : "field_149 email, pre-approval"
    tapestry_api_log         }o..o| tapestry_schools                 : "api_post LIKE match, no index"
