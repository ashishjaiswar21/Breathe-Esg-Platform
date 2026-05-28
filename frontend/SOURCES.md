# Sample Data & Edge Case Testing

To prove the robustness of the ingestion engine, the sample data was explicitly designed to simulate real-world chaos.

## The `sap_export.csv` Profile
The provided sample data file reflects typical anomalies found in legacy system exports:
1. **Foreign Headers:** Uses German column names (`Brennstoff`, `Menge`) to test the backend's header-mapping logic.
2. **Negative Values:** Includes impossible metrics (e.g., `-50 Liters` of fuel) to trigger the backend's validation rules and auto-assign the `Amount cannot be negative` error flag.
3. **Volumetric Anomalies:** Includes massive outliers (e.g., `1,000,000 Liters`) to trigger the `Suspicious Data Volume` warning, forcing an analyst review.
4. **Missing Units:** Tests the engine's ability to handle null values without crashing the database transaction.

By utilizing this chaotic source data, we successfully demonstrate that the Python backend acts as an effective firewall, preventing bad data from quietly corrupting the PostgreSQL database.