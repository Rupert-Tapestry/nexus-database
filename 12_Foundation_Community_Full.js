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
        int la_id PK "Primary key. This is the value written to foundation_group_upgrade_history.rkeyid."
        varchar la_password "The scheme key a practitioner types to claim membership. Declared as a secondary ID field, so keys are looked up by this value directly."
        int la_used "Redemption counter, carried over from foundation_group_passwords.pused when a scheme was migrated. Dormant — the ACP column labelled 'used' is a live COUNT(*) over core_clubs_memberships, not this value."
        varchar la_title "Scheme name — normally the Local Authority."
        int la_club_id FK "FK → core_clubs.id. Redeeming the key joins the member to this club, which is what grants the private forums."
        smallint la_enabled "0 disables the key without deleting it or its history. Drives the active/inactive filter in the ACP. Set to 0 automatically for any migrated scheme whose password contained schemeexpired."
    }
    "**foundation_group_upgrade_history**" {
        int rid PK "Primary key."
        int rkeyid "The scheme the member redeemed. Current writers set this to foundation_la.la_id; the ACP settings list still LEFT JOINs it to foundation_group_passwords.pid, which is the legacy path (see the drift note below)."
        int ruserid FK "FK → core_members.member_id."
        int ruseddate "Unix timestamp redeemed."
        int rexpiredate "Unix timestamp the membership lapses. rexpiredate > now is the test for 'this member currently has LA membership' — used by the inactive-member deletion task to avoid deleting paid members."
    }
    "**foundation_la_extension_history**" {
        int history_id PK "Primary key."
        int history_gid FK "FK → foundation_la.la_id — the scheme that was extended."
        int history_date "Unix timestamp of the extension."
        text history_data "JSON detail of what the bulk extension did."
    }
    "**foundation_group_passwords**" {
        int pid PK "Primary key."
        int pgroup FK "FK → core_groups.g_id the key upgrades the member into."
        text papply_groups "Groups the key may be used from."
        longtext ppassword "The key itself."
        int pvalid "Remaining uses; -1 = unlimited."
        int pused "Use counter."
        tinyint pdeleteonuse "Delete the key once redeemed."
        int pexpires "Unix timestamp the key stops working."
        int psubid "Associated subscription/package ID."
        int pexpire_length "Length of membership granted."
        char pexpire_unit "Unit for pexpire_length — d/m/y, or x for none."
        varchar ppermission_mask "Permission mask applied on redemption."
        varchar pdescript "Staff-facing description."
        text pforumids "JSON forum IDs the key grants, added by this application on top of the inherited table."
    }
    "**foundation_la**"               ||..o{ "**foundation_group_upgrade_history**" : "rkeyid, current"
    "**foundation_group_passwords**"  ||..o{ "**foundation_group_upgrade_history**" : "rkeyid, legacy path"
    "**core_members**"                 ||..o{ "**foundation_group_upgrade_history**" : "ruserid"
    "**foundation_la**"                }o..|| "**core_clubs**"                       : "la_club_id"
    "**foundation_la**"                ||..o{ "**foundation_la_extension_history**"  : "history_gid"
    "**foundation_group_passwords**"   }o..|| "**core_groups**"                      : "pgroup"
