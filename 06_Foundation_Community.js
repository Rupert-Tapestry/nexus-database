---
    title: FOUNDATION COMMUNITY
---
erDiagram
    "**core_members**" {
        bigint member_id PK
    }
    "**core_clubs**" {
        int id PK
        string name "grants private forums"
    }
    "**core_groups**" {
        int g_id PK
        string name
    }
    "**foundation_la**" {
        int la_id PK "written to rkeyid on redemption"
        varchar la_password "the scheme key, secondary ID"
        varchar la_title
        int la_club_id FK
        tinyint la_enabled
    }
    "**foundation_group_upgrade_history**" {
        int rid PK
        int rkeyid FK "to foundation_la.la_id, current path"
        int ruserid FK "to core_members"
        int ruseddate
        int rexpiredate "live if greater than now"
    }
    "**foundation_la_extension_history**" {
        int history_id PK
        int history_gid FK "to foundation_la.la_id"
        int history_date
    }
    "**foundation_group_passwords**" {
        int pid PK "legacy key system, inherited not rebuilt"
        int pgroup FK "to core_groups.g_id"
        varchar ppassword
        int pvalid "remaining uses, -1 = unlimited"
    }

    "**foundation_la**"               ||..o{ "**foundation_group_upgrade_history**" : "rkeyid, current"
    "**foundation_group_passwords**"  ||..o{ "**foundation_group_upgrade_history**" : "rkeyid, legacy path"
    "**core_members**"                 ||..o{ "**foundation_group_upgrade_history**" : "ruserid"
    "**foundation_la**"                }o..|| "**core_clubs**"                       : "la_club_id"
    "**foundation_la**"                ||..o{ "**foundation_la_extension_history**"  : "history_gid"
    "**foundation_group_passwords**"   }o..|| "**core_groups**"                      : "pgroup"
