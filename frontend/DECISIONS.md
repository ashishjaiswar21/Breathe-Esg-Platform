# Architectural Decisions

## 1. CSV Flat-Files for SAP Legacy Integration
**Decision:** Implemented a robust `.csv` upload engine for SAP data rather than a direct database-to-database pipeline.
**Reasoning:** In enterprise environments, legacy ERP systems (like older SAP instances) are heavily firewalled and notoriously difficult to integrate via real-time APIs. Scheduled flat-file exports (CSV) are the industry standard for bulk data migration. Building an ingestion engine that elegantly handles messy CSVs reflects real-world operational constraints.

## 2. Decoupled Frontend and Backend
**Decision:** Chose a headless Django REST Framework backend communicating with a standalone React (Vite) frontend.
**Reasoning:** ESG data platforms often scale into complex visualization dashboards. By decoupling the architecture, the frontend can be iterated on rapidly (and maintained by a separate UI team) without risking the integrity of the core Python data-processing engine. 

## 3. Pandas for Data Transformation
**Decision:** Utilized the Pandas library within Django views for data cleaning.
**Reasoning:** While native Python loops can handle small files, Pandas provides vectorized operations that scale efficiently when processing bulk exports containing tens of thousands of rows.