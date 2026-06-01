# Rocket Elevators — Data Analysis Specification

## Overview

This document defines the data analysis goals, methodology, and expected outputs for the Rocket Elevators elevator licensing dataset. The analysis is intended to support operations managers in understanding fleet status, compliance risk, and geographic distribution across Ontario, Canada.

---

## Data Source

| Property | Value |

|---|---|
| File | `data/elevator_licenses.csv` |
| Format | CSV with headers |
| Approximate Records | ~45,383 elevators |
| Origin | Ontario Ministry of Labour elevator licensing registry |

---

## Schema Reference

| Column | Type | Description |

|---|---|---|
| `ElevatingDevicesNumber` | Integer | Unique identifier for each elevator device |
| `LocationoftheElevatingDevice` | String | Civic address + city + postal code + province |
| `ElevatingDevicesLicenseNumber` | String | License number (format: `EDLIC-XXXXXX` or legacy numeric) |
| `LICENSESTATUS` | Categorical | Current license status (see values below) |
| `LICENSEEXPIRYDATE` | Date (DD-Mon-YY) | Date the license expires |
| `LICENSEHOLDER` | String | Name of the organization holding the license |
| `LICENSEHOLDERACCOUNTNUMBER` | String | Account number (redacted in public dataset) |
| `LICENSEHOLDERADDRESS` | String | Mailing address of the license holder |
| `BILLINGCUSTOMER` | String | Name of the billing contact |
| `BILLINGADDRESS` | String | Billing address |
| `BILLINGACCOUNT` | String | Billing account number (redacted) |

### License Status Values

| Status | Meaning |

|---|---|
| `ACTIVE` | License is current and valid |
| `BY REQUEST` | License suspended or pending renewal by request |
| `CANCELLED_NOT_RENEWED` | License expired and not renewed |

---

## Analysis Goals

### 1. Fleet Health Overview

Establish baseline counts for the full fleet and summarize by license status to expose compliance risk.

**Key Questions:**

- How many total elevators are in the registry?
- What percentage are currently `ACTIVE` vs. non-compliant?
- How many licenses have already expired (expiry date < today)?
- How many licenses expire within the next 30 / 60 / 90 days?

### 2. License Expiry Risk Analysis

Identify elevators approaching expiry to enable proactive renewal outreach.

**Key Questions:**

- What is the distribution of expiry dates over time?
- Which license holders have the most elevators at risk of expiry?
- Are there clusters of expiry dates that suggest batch renewals?

### 3. Geographic Distribution

Understand where elevators are concentrated to optimize inspection scheduling.

**Key Questions:**

- Which cities have the highest elevator counts?
- Which cities have the highest proportion of non-active licenses?
- What is the postal code–level density of the fleet?

### 4. License Holder Concentration

Identify top license holders to prioritize account management.

**Key Questions:**

- Who are the top 20 license holders by elevator count?
- Do large license holders have a better or worse compliance rate?

### 5. License Number Patterns

Detect data quality issues and distinguish legacy vs. modern records.

**Key Questions:**

- What proportion of records use the modern `EDLIC-XXXXXX` format vs. legacy numeric IDs?
- Are there duplicate license numbers?

---

## Metrics to Compute

| Metric | Definition |

|---|---|
| Total Elevators | `COUNT(*)` |
| Active Elevators | `COUNT(*) WHERE LICENSESTATUS = 'ACTIVE'` |
| Active Rate | `Active / Total × 100` |
| Expired Licenses | `COUNT(*) WHERE LICENSEEXPIRYDATE < TODAY` |
| Expiring in 30 Days | `COUNT(*) WHERE TODAY ≤ LICENSEEXPIRYDATE ≤ TODAY+30` |
| Expiring in 60 Days | `COUNT(*) WHERE TODAY ≤ LICENSEEXPIRYDATE ≤ TODAY+60` |
| Expiring in 90 Days | `COUNT(*) WHERE TODAY ≤ LICENSEEXPIRYDATE ≤ TODAY+90` |
| Cancelled Rate | `COUNT(CANCELLED_NOT_RENEWED) / Total × 100` |
| By Request Rate | `COUNT(BY REQUEST) / Total × 100` |
| Top City by Count | City with highest `COUNT(*)` after address parsing |
| Top License Holder | Holder with highest elevator count |

---

## Visualizations

| Chart | Type | Purpose |

|---|---|---|
| License Status Breakdown | Pie / Donut chart | Quick read of fleet health |
| Expiry Timeline | Line / Bar histogram (by month) | Spot renewal clusters |
| Top 10 Cities by Elevator Count | Horizontal bar chart | Geographic concentration |
| Top 20 License Holders | Horizontal bar chart | Account prioritization |
| Expiry Risk Buckets | Stacked bar (30/60/90/expired) | Urgency ranking |
| Compliance by City | Heatmap or choropleth | Regional risk view |

---

## Implementation Plan

### Phase 1 — Data Loading & Cleaning (Notebook: `notebooks/data_analysis.ipynb`)

```python
import pandas as pd
from datetime import datetime

df = pd.read_csv('data/elevator_licenses.csv')

# Parse expiry dates
df['LICENSEEXPIRYDATE'] = pd.to_datetime(
    df['LICENSEEXPIRYDATE'], format='%d-%b-%y', errors='coerce'
)

# Extract city from location string
df['City'] = df['LocationoftheElevatingDevice'].str.extract(
    r'([A-Z\s]+)\s+[A-Z]\d[A-Z]\s+\d[A-Z]\d'
)

# Flag expired and at-risk records
today = pd.Timestamp.today().normalize()
df['IsExpired']       = df['LICENSEEXPIRYDATE'] < today
df['ExpiresSoon30']   = (df['LICENSEEXPIRYDATE'] >= today) & (df['LICENSEEXPIRYDATE'] <= today + pd.Timedelta(days=30))
df['ExpiresSoon60']   = (df['LICENSEEXPIRYDATE'] >= today) & (df['LICENSEEXPIRYDATE'] <= today + pd.Timedelta(days=60))
df['ExpiresSoon90']   = (df['LICENSEEXPIRYDATE'] >= today) & (df['LICENSEEXPIRYDATE'] <= today + pd.Timedelta(days=90))
```

### Phase 2 — Aggregate Statistics

- Compute all metrics from the **Metrics to Compute** table above.
- Produce a `summary_stats` dictionary / DataFrame for use by the dashboard.

### Phase 3 — Visualizations

- Use `matplotlib` and/or `plotly` inside the Jupyter notebook.
- Export charts as static PNG files to `docs/charts/` for use in reports.

### Phase 4 — Dashboard Integration

- Key aggregate values (total, active, expired, expiring soon) feed the summary cards in `apps/dashboard/script.js`.
- The full cleaned DataFrame drives the searchable data table.

---

## Data Quality Notes

| Issue | Observation | Recommended Action |

|---|---|---|
| Redacted fields | `LICENSEHOLDERACCOUNTNUMBER` and `BILLINGACCOUNT` contain literal `"data redacted"` | Exclude from analysis; flag in documentation |
| Legacy license numbers | Some records use plain numeric IDs instead of `EDLIC-XXXXXX` | Treat as valid; do not filter out |
| Expiry date format | `DD-Mon-YY` — two-digit year requires careful century parsing (e.g., `28-Apr-17` → 2017 vs. 2117) | Validate with `pd.to_datetime(..., errors='coerce')` and inspect outliers |
| City parsing | City is embedded in a free-text address string | Use regex extraction; manually verify top 20 cities |
| Duplicate records | Not yet assessed | Run `ElevatingDevicesNumber.duplicated()` check in Phase 1 |

---

## Outputs & Deliverables

| Deliverable | Location | Description |

|---|---|---|
| Cleaned notebook | `notebooks/data_analysis.ipynb` | Full EDA with code, charts, and commentary |
| Summary stats JSON | `data/summary_stats.json` | Machine-readable metrics for dashboard |
| Chart exports | `docs/charts/` | PNG exports of all visualizations |
| This spec | `docs/data_analysis_spec.md` | Source of truth for analysis requirements |

---

## Related Documents

- [Dashboard Specification](dashboard_spec.md) — UI requirements that consume the outputs of this analysis
- `apps/dashboard/script.js` — JavaScript that reads the CSV and renders summary cards + table

---

*Last updated: 2026-05-27*
