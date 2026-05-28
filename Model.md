# Data Modeling & Audit Architecture

## The Ingestion Architecture
To ensure data integrity, the system is designed to handle the transition from chaotic, real-world data to sanitized, enterprise-ready metrics. 

### Raw Data vs. Normalized State
When data enters the system (via CSV or API), it lands in an intermediate state. The backend utilizes Pandas to parse the raw input, map foreign column headers (e.g., SAP's `Brennstoff` to `Category`), and convert metrics to standard baseline units. 

### The Audit Lifecycle (Compliance First)
Automated normalization is not enough for ESG compliance; human verification is required. 
Instead of instantly committing data to a finalized ledger, all ingested records default to a `PENDING` state. The data model includes specific boolean flags (`is_suspicious`) and text fields (`validation_errors`) that catch impossible metrics (like negative fuel consumption). 

This allows the React Dashboard to act as an Audit Control Panel, guaranteeing that an authorized Analyst must explicitly transition the state to `APPROVED` or `REJECTED`, creating a defensible audit trail.