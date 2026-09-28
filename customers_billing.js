erDiagram
    nexus_customers {
        bigint member_id PK
        varchar cm_first_name
        varchar cm_last_name
        varchar cm_phone
    }
    nexus_customer_addresses {
        bigint id PK
        bigint member FK
        text address "JSON GeoLocation blob"
        tinyint primary_billing
    }
    nexus_customer_cards {
        bigint card_id PK
        bigint card_member FK
        int card_method FK
        text card_data "encrypted gateway token, not a PAN"
    }
    nexus_customer_fields {
        int f_id PK
        varchar f_column "generated column added to nexus_customers"
        varchar f_type
    }
    nexus_alternate_contacts {
        bigint main_id PK, FK
        bigint alt_id PK, FK
        tinyint billing
        tinyint support
    }
    nexus_notes {
        int note_id PK
        bigint note_member FK
        bigint note_author FK
        text note_text
    }
    nexus_customer_spend {
        bigint spend_member_id PK, FK
        char spend_currency PK
        decimal spend_amount "lifetime total paid"
    }
    nexus_invoices {
        int i_id PK
        bigint i_member FK
        char i_status
        decimal i_total
        varchar i_po "customer purchase order number"
    }
    nexus_transactions {
        int t_id PK
        bigint t_member FK
        int t_invoice FK
        int t_method FK
        char t_status "okay, pend, wait, hold, fail, rfnd, dspd"
        decimal t_amount
    }
    nexus_paymethods {
        int m_id PK
        varchar m_gateway
        tinyint m_active
    }
    nexus_billing_agreements {
        bigint ba_id PK
        varchar ba_gw_id "gateway mandate reference"
        int ba_method FK
        bigint ba_member FK
    }
    nexus_tax {
        int t_id PK
        varchar t_name
        enum t_type "single, business, eu"
    }
    nexus_coupons {
        int c_id PK
        varchar c_code
        char c_unit "percent or fixed amount"
    }
    nexus_donate_goals {
        int d_id PK
        varchar d_name
        decimal d_goal
    }
    nexus_donate_logs {
        int dl_id PK
        int dl_goal FK
        bigint dl_member FK
        int dl_invoice FK
    }
    nexus_payouts {
        bigint po_id PK
        bigint po_member FK
        decimal po_amount
        varchar po_status
    }
    nexus_fraud_rules {
        int f_id PK
        varchar f_name
        varchar f_action
    }
    nexus_invoice_tracker {
        bigint member_id PK, FK
        int invoice_id PK, FK
    }

    nexus_customers      ||..o{ nexus_customer_addresses  : "member"
    nexus_customers      ||..o{ nexus_customer_cards      : "card_member"
    nexus_customer_fields||..o{ nexus_customers           : "adds column field_N"
    nexus_customers      ||..o{ nexus_alternate_contacts  : "main_id"
    nexus_customers      ||..o{ nexus_alternate_contacts  : "alt_id"
    nexus_customers      ||..o{ nexus_notes               : "note_member"
    nexus_customers      ||..o{ nexus_customer_spend      : "spend_member_id"
    nexus_customers      ||..o{ nexus_invoices            : "i_member"
    nexus_coupons        }o..o{ nexus_invoices            : "c_used_by, redemption"
    nexus_invoices       ||..o{ nexus_transactions        : "t_invoice"
    nexus_customers      ||..o{ nexus_transactions        : "t_member"
    nexus_transactions   }o..o| nexus_paymethods          : "t_method"
    nexus_customers      ||..o{ nexus_billing_agreements  : "ba_member"
    nexus_billing_agreements }o..|| nexus_paymethods       : "ba_method"
    nexus_customer_cards }o..|| nexus_paymethods          : "card_method"
    nexus_donate_goals   ||..o{ nexus_donate_logs         : "d_id"
    nexus_customers      ||..o{ nexus_donate_logs         : "dl_member"
    nexus_invoices       ||..o| nexus_donate_logs         : "dl_invoice"
    nexus_customers      ||..o{ nexus_payouts             : "po_member"
    nexus_transactions   }o..o| nexus_fraud_rules         : "t_fraud match"
    nexus_invoices       ||..o{ nexus_invoice_tracker     : "invoice_id"
    nexus_customers      ||..o{ nexus_invoice_tracker     : "member_id"
