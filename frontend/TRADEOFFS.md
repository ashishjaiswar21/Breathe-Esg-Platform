# Technical Trade-offs & Future Roadmap

## 1. Skipping OCR for Utility Bills
**Trade-off:** The initial project scope considered integrating Optical Character Recognition (OCR) to ingest raw PDF utility bills. 
**Decision:** OCR was intentionally scoped out of this iteration. 
**Reasoning:** Integrating OCR introduces high error rates and significant technical debt. The priority for this phase was establishing absolute **Data Integrity** and a robust **Audit Lifecycle**. It is better to have a flawless pipeline for structured data (CSV/API) than a fragile pipeline for unstructured PDFs. 
*Future state:* OCR can be integrated via AWS Textract or Google Cloud Vision as a microservice feeding into this established ingestion pipeline.

## 2. Synchronous Processing vs. Celery Queues
**Trade-off:** Currently, the CSV upload processes synchronously during the HTTP request.
**Decision:** Kept processing synchronous for the prototype.
**Reasoning:** For files up to a few megabytes, synchronous processing provides immediate user feedback. However, for a true enterprise deployment handling gigabyte-sized flat files, this would cause HTTP timeouts. 
*Future state:* Implement Celery and Redis to handle data ingestion as a background background task, returning a `task_id` to the frontend to poll for completion status.