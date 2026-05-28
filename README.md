# ✦ Breathe ESG - Enterprise Data Ingestion Engine

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_Project-blue?style=for-the-badge)](INSERT_YOUR_LIVE_LINK_HERE)
[![GitHub](https://img.shields.io/badge/GitHub-View_Source-black?style=for-the-badge)](INSERT_YOUR_GITHUB_LINK_HERE)

> 🚀 A full-stack enterprise ESG data ingestion and normalization platform built for the Breathe ESG technical assessment.

This platform ingests messy enterprise data from multiple external systems like SAP exports and corporate travel APIs, validates and normalizes the data using custom Python business logic, and provides analysts with a secure dashboard to review, approve, and audit records before they become audit-ready.

---

# 🌍 Project Overview

Enterprise ESG data is usually fragmented across:
- 🏢 SAP systems
- ⚡ Utility exports
- ✈️ Corporate travel platforms
- 📄 Manual spreadsheets

This application solves that problem by creating a centralized ingestion pipeline that:

✅ Accepts data from multiple sources  
✅ Cleans and standardizes records  
✅ Detects suspicious or invalid entries  
✅ Enables analyst review workflows  
✅ Stores audit-ready records securely in PostgreSQL

---

# 📸 System Previews

## 🖥️ Central Validation Dashboard

![React Dashboard UI](./assets/Screenshot%20(22407).png)

*The React frontend communicates seamlessly with the Django backend, allowing analysts to upload raw files, sync APIs, and review flagged anomalies before approving records.*

---

## 🧹 Automated Data Normalization & Validation

![Database Validation Logic](./assets/Screenshot%20(22409).png)

*Custom Python validation logic automatically standardizes units, translates foreign headers, and detects impossible business values such as negative fuel consumption or missing fields.*

---

## 🗄️ Secure PostgreSQL Storage

![PostgreSQL Database Records](./assets/Screenshot%20(22408).png)

*Django Admin interface showing normalized ESG records successfully stored inside PostgreSQL after end-to-end ingestion processing.*

---

# 🚀 Tech Stack

## 🎨 Frontend Architecture

| Technology | Purpose |
|---|---|
| ⚛️ React.js (Vite) | Frontend UI rendering |
| 🔄 Axios | API communication |
| 🎨 CSS Grid + Flexbox | Responsive dashboard design |
| 🌙 Dark UI | Modern analyst interface |

---

## ⚙️ Backend Engine

| Technology | Purpose |
|---|---|
| 🐍 Python | Core programming language |
| 🌐 Django | Backend framework |
| 🔌 Django REST Framework | REST API development |
| 🧹 Pandas | CSV parsing & transformation |
| 🔒 django-cors-headers | Cross-origin security |

---

## 🗄️ Database & Infrastructure

| Technology | Purpose |
|---|---|
| 🐘 PostgreSQL | ESG data storage |
| ☁️ Render/Railway | Backend deployment |
| ▲ Vercel | Frontend deployment |

---

# ⚙️ Core Features

## 📥 1. Multi-Source Data Ingestion

Supports:
- SAP CSV exports
- Utility electricity files
- Mock corporate travel API syncs

---

## 🧹 2. Automated ETL Pipeline

### ETL = Extract → Transform → Load

The system:
- Extracts raw data
- Cleans & normalizes records
- Loads validated data into PostgreSQL

---

## 🔍 3. Smart Validation Engine

Automatically detects:
- ❌ Negative fuel values
- ❌ Missing mandatory fields
- ⚠️ Suspiciously high consumption
- ⚠️ Invalid units

---

## 👨‍💼 4. Analyst Review Workflow

Human analysts can:
- Review imported records
- Approve valid rows
- Reject problematic data
- Audit ingestion history

---

## 🔒 5. Record Locking & Audit Trail

Approved records become:
- 🔒 Locked from modification
- 📋 Audit-ready
- 🧾 Fully traceable

Every action is logged with:
- User
- Timestamp
- Old value
- New value

---

# 🏗️ System Architecture

```text
React Frontend (Vite)
          ↓
Django REST API
          ↓
Validation & ETL Engine
          ↓
PostgreSQL Database
```

---

# 🔌 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/upload/sap/` | Upload SAP CSV exports |
| `POST` | `/api/upload/utility/` | Upload utility electricity data |
| `GET` | `/api/sync/travel/` | Sync mock travel API |
| `GET` | `/api/records/` | Fetch latest ESG records |
| `POST` | `/api/approve/<id>/` | Approve analyst-reviewed records |
| `POST` | `/api/reject/<id>/` | Reject invalid records |

---

# 🧠 Key Enterprise Concepts Implemented

| Concept | Description |
|---|---|
| 🏢 Multi-Tenancy | Supports multiple companies |
| 📋 Audit Trail | Tracks all data modifications |
| 🔍 Validation Engine | Detects invalid records |
| 🔒 Data Locking | Prevents editing approved data |
| 🌍 ESG Categorization | Scope 1 / 2 / 3 support |

---

# 🗄️ Database Models

## 📊 EmissionRecord

Stores normalized ESG records.

```python
class EmissionRecord(models.Model):
    fuel_type = models.CharField(max_length=100)
    amount = models.FloatField()
    unit = models.CharField(max_length=50)
    status = models.CharField(max_length=20)
    is_locked = models.BooleanField(default=False)
```

---

## 🧾 AuditLog

Tracks all changes for compliance and auditing.

```python
class AuditLog(models.Model):
    action = models.CharField(max_length=100)
    old_value = models.TextField()
    new_value = models.TextField()
    changed_by = models.CharField(max_length=100)
```

---

# 🛠️ Local Installation & Setup

# 📦 Prerequisites

Ensure the following are installed:

- Python 3.10+
- Node.js v18+
- PostgreSQL

---

# ⚙️ Backend Setup (Django)

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/breathe-esg-platform.git

# Navigate backend
cd breathe-esg-platform/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
.\venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Start backend server
python manage.py runserver
```

Backend runs on:

```text
http://localhost:8000
```

---

# 🎨 Frontend Setup (React + Vite)

Open a new terminal:

```bash
# Navigate frontend
cd breathe-esg-platform/frontend

# Install node packages
npm install

# Start Vite server
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# 🔐 Environment Variables

Create a `.env` file inside backend:

```env
DEBUG=True

DB_NAME=breathe_esg
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
```

---

# 📂 Example SAP CSV Format

```csv
Plant Code,Fuel Type,Quantity,Unit,Date
PL101,Diesel,500,Liters,2026-01-02
```

---

# ⚡ Example Utility CSV

```csv
Meter ID,Consumption,Billing Period
MTR001,1200,kWh
```

---

# ✈️ Example Travel API Payload

```json
{
  "employee": "Rahul",
  "from": "DEL",
  "to": "BLR"
}
```

---

# 🧪 Validation Rules

The system automatically flags:

| Rule | Result |
|---|---|
| Negative fuel value | ❌ Error |
| Missing unit | ❌ Error |
| Extremely high usage | ⚠️ Suspicious |
| Invalid airport code | ⚠️ Warning |

---

# 📋 Analyst Workflow

```text
Upload Data
    ↓
Validation Engine
    ↓
Suspicious/Error Detection
    ↓
Analyst Review Dashboard
    ↓
Approve / Reject
    ↓
Record Locking
    ↓
Audit Trail Storage
```

---

# 🚀 Future Improvements

Potential production-level upgrades:

- 🔑 JWT Authentication
- 📊 ESG Analytics Charts
- 📄 PDF Utility Bill OCR
- ☁️ Real SAP Integration
- 📈 Emission Factor APIs
- 🔔 Notification System

---

# 📚 Documentation Files

| File | Purpose |
|---|---|
| `MODEL.md` | Database architecture |
| `DECISIONS.md` | Engineering decisions |
| `TRADEOFFS.md` | Features intentionally skipped |
| `SOURCES.md` | Research references |

---

# 👨‍💻 Author

## Ashish Kumar

- [💻 GitHub:](https://github.com/ashishjaiswar21)

- [🔗 LinkedIn:](https://www.linkedin.com/in/ashishjaiswar21/)

---

# ⭐ Final Note

This project focuses on:
- Real-world enterprise workflows
- ESG data quality
- Audit-safe architecture
- Practical engineering tradeoffs

Rather than building a generic CRUD application, the goal was to simulate how enterprise sustainability platforms actually ingest, validate, and govern operational emissions data.
