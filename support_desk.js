erDiagram
    nexus_customers {
        bigint member_id PK
    }
    nexus_purchases {
        int ps_id PK
        bigint ps_member FK
    }
    nexus_support_requests {
        int r_id PK "the ticket number"
        bigint r_member FK
        int r_department FK
        int r_purchase FK
        int r_status FK
        int r_severity FK
        tinyint r_non_eu_status "custom: 0 unchecked, 1 visible, 2 hidden, 3 recheck"
        tinyint r_non_eu_override "custom: staff override, beats r_non_eu_status"
    }
    nexus_support_replies {
        int reply_id PK
        int reply_request FK
        bigint reply_member FK
        char reply_type "m member, s staff, n note, h log"
    }
    nexus_support_departments {
        int dpt_id PK
        varchar dpt_name
        tinyint dpt_open
    }
    nexus_support_statuses {
        int status_id PK
        varchar status_name
        tinyint status_open
    }
    nexus_support_severities {
        int sev_id PK
        varchar sev_name
        tinyint sev_default
    }
    nexus_support_fields {
        int sf_id PK
        varchar sf_name
        text sf_departments
    }
    nexus_support_stock_actions {
        int action_id PK
        int action_department FK
        varchar action_name
    }
    nexus_support_request_log {
        bigint rlog_id PK
        int rlog_request FK
        bigint rlog_member FK
    }
    nexus_support_ratings {
        int rating_reply PK, FK
        int rating_rating
    }
    nexus_support_tracker {
        bigint member_id PK, FK
        int request_id PK, FK
    }
    nexus_support_views {
        bigint view_rid PK, FK
        bigint view_member PK, FK
    }
    nexus_support_staff_dpt_order {
        bigint staff_id PK
        int department_id PK, FK
    }
    tapestry_schools {
        int school_id PK
        tinyint school_non_eu_processing_consent
    }
    tapestry_support_request_schools {
        int request_id PK, FK
        int school_id PK, FK
    }

    nexus_customers               ||..o{ nexus_support_requests        : "r_member"
    nexus_purchases                ||..o{ nexus_support_requests        : "r_purchase"
    nexus_support_departments      ||..o{ nexus_support_requests        : "r_department"
    nexus_support_statuses         ||..o{ nexus_support_requests        : "r_status"
    nexus_support_severities       ||..o{ nexus_support_requests        : "r_severity"
    nexus_support_requests         ||..o{ nexus_support_replies         : "reply_request"
    nexus_support_requests         ||..o{ nexus_support_request_log     : "rlog_request"
    nexus_support_replies          ||..o| nexus_support_ratings         : "rating_reply"
    nexus_support_requests         ||..o{ nexus_support_tracker         : "request_id"
    nexus_support_requests         ||..o{ nexus_support_views           : "view_rid"
    nexus_support_departments      ||..o{ nexus_support_fields          : "sf_departments"
    nexus_support_departments      ||..o{ nexus_support_stock_actions   : "action_department"
    nexus_support_departments      ||..o{ nexus_support_staff_dpt_order : "department_id"
    nexus_support_requests         ||..o{ tapestry_support_request_schools : "r_id"
    tapestry_schools                ||..o{ tapestry_support_request_schools : "school_id"
