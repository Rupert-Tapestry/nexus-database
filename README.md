# nexus-database
Mermaid.js for the FSF / Nexus DB schema

Simple repo to store mermaid.js files created in Claude for from the FSF Database Schema .html from Ben S.

**2026/09/29:**\
This is not the full schema - it does not yet contain the core tables that are not 'owned' by the Nexus / Tapestry part of the code.\
Contains the original .html from Ben S (Claude query that extracted database schema description as table definitions and note, a summary of how Claude trimmed the output to essential fields only (for readability), the data model and raw unrendered mermaid.js code for making ERD's - the full description (entities only, not fields) and then 6 subsets; these are available both as trimmed more readable versions and the full definition (all fields per table).\
\
Added a summary of the Claude chat as a markdown file.\
\
These are the .html files that are included in this repo: (**file name**, *source, date*)
- **database-schema.html** (*Ben S - Claude query, 2026/09/15*)
- **FSF-Data-Model.html** (*Rupert - Claude, no mermaid.js class in .htnl, so ERD's do not redner, 2026/09/29*)
- **fsf-erd-standalone.html** (*Rupert - Claude, standalone version for class for mermaid.js to fully render the ERD's, 2026/09/29*)

**2026/10/02:**\
Added a downloaded .json schema file from the FSF-Forum Github repo:
- **applications/nexus/data/schema.json** - nexus_schema.json
- **applications/core/data/schema.json** - core_schema.json


Added subfolder for files I have downloaded directly from the FSF-Forum GitHub repo.
Output files generated from Claude analysis of Nexus schema.json.

Adding markdown (and other files) that I am generating as I analyse and understand this schema.
- Nexus schema
- How a support stream (user defined filter to search for support requests) works
- what makesup a support request (ticket)
- how a customer is defined
