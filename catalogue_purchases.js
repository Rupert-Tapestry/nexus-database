erDiagram
    "**nexus_packages**" {
        int p_id PK "shared with tapestry_packages.id"
        int p_group FK
        varchar p_type "product, subscription, ads"
        int p_tax FK
        varchar p_allow_upgrading "drives size-change journey"
    }
    "**nexus_packages_products**" {
        int p_id PK, FK "subtype for p_type = product"
        tinyint p_physical
        tinyint p_subscription
        text p_shipping "csv of nexus_shipping.s_id"
    }
    "**nexus_packages_ads**" {
        int p_id PK, FK "subtype for p_type = ads"
        text p_locations
    }
    "**nexus_package_groups**" {
        int pg_id PK
        varchar pg_name
        int pg_parent FK "self reference"
    }
    "**nexus_package_fields**" {
        int cf_id PK
        varchar cf_name
        text cf_packages "csv of nexus_packages.p_id"
    }
    "**nexus_package_base_prices**" {
        bigint id PK, FK
    }
    "**nexus_package_images**" {
        int image_id PK
        int image_product FK
        tinyint image_primary
    }
    "**nexus_package_filters**" {
        int pfilter_id PK
        int pfilter_order
    }
    "**nexus_package_filters_values**" {
        int pfv_id PK
        int pfv_filter FK
        varchar pfv_value
    }
    "**nexus_package_filters_map**" {
        int pfm_package FK
        int pfm_filter FK
        text pfm_values
    }
    "**nexus_product_options**" {
        int opt_id PK
        int opt_package FK
        text opt_values
        int opt_stock
    }
    "**nexus_reviews**" {
        int review_id PK
        int review_product FK
        int review_rating
    }
    "**nexus_cart_uploads**" {
        bigint id PK
        varchar session_id
        int item_id FK
    }
    "**nexus_tax**" {
        int t_id PK
        varchar t_name
        enum t_type
    }
    "**nexus_shipping**" {
        int s_id PK
        varchar s_name
        text s_rates
    }
    "**nexus_ship_orders**" {
        bigint o_id PK
        int o_invoice FK
        int o_method FK
        varchar o_status
    }
    "**nexus_purchases**" {
        int ps_id PK "= tapestry_schools.school_pkg_id"
        bigint ps_member FK
        int ps_item_id FK
        int ps_parent FK "self reference, associated child"
        int ps_original_invoice FK
        tinyint ps_active
    }
    "**tapestry_packages**" {
        bigint id PK, FK "= nexus_packages.p_id"
        int children "child allowance"
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
