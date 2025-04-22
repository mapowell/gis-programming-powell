# gis-programming-powell
# QA/QC Toolkit for Air Quality GIS Data

This toolkit is designed for validating, flagging, and auditing air quality GIS data in a PostgreSQL database with PostGIS.

## Features
- Validates air quality data for missing, out-of-range, or duplicate values.
- Flags records outside designated regions.
- Provides summary views and indexing for efficient queries.

## SQL Code

### 1. Create QA/QC Issues Log Table
```sql
CREATE TABLE IF NOT EXISTS aqi_qaqc_issues (
    issue_id SERIAL PRIMARY KEY,
    sensor_id TEXT,
    timestamp TIMESTAMP,
    issue_type TEXT,
    issue_details TEXT,
    created_at TIMESTAMP DEFAULT now()
);
