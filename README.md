[Example_QA_QC_Log_Table.csv](https://github.com/user-attachments/files/19857197/Example_QA_QC_Log_Table.csv)# gis-programming-powell

# QA/QC Toolkit for Air Quality GIS Data

**Target DB**: PostgreSQL with PostGIS  
**Description**: Performs validations, flags issues, logs problems, and enables modular reuse.

---

## 1. Create QA/QC Issues Log Table

Stores all flagged QA/QC issues for tracking and auditing.

```sql
CREATE TABLE IF NOT EXISTS aqi_qaqc_issues (
    issue_id SERIAL PRIMARY KEY,                 -- Unique identifier for each issue
    sensor_id TEXT,                              -- Identifier for the sensor reporting the issue
    timestamp TIMESTAMP,                         -- Timestamp of the issue occurrence
    issue_type TEXT,                             -- Type/category of the issue (e.g., missing data, out-of-range value)
    issue_details TEXT,                          -- Detailed description of the issue
    created_at TIMESTAMP DEFAULT now()           -- Timestamp when the issue was logged
);
```
| issue_id | sensor_id | timestamp           | issue_type    | issue_details                         | created_at           |
|----------|-----------|---------------------|---------------|----------------------------------------|----------------------|
| 1        | AQ101     | 2025-04-22 18:36:14 | Missing Data  | No AQI reading at 3 AM                | 2025-04-22 18:51:14  |
| 2        | AQ204     | 2025-04-22 19:36:14 | Out-of-Range  | AQI value reported as 999             | 2025-04-22 19:46:14  |
| 3        | AQ305     | 2025-04-22 20:36:14 | Spatial Error | Point recorded outside region boundary| 2025-04-22 21:06:14  |

---

## 2. View: Check for NULL Values

Encapsulates logic for checking missing key fields.

```sql
CREATE OR REPLACE VIEW aqi_missing_values AS
SELECT *
FROM aqi_readings
WHERE aqi_value IS NULL
   OR timestamp IS NULL
   OR sensor_id IS NULL;
```

---

## 3. View: Out-of-Range AQI Values

Flags AQI values outside the valid range (0–500).

```sql
CREATE OR REPLACE VIEW aqi_out_of_range AS
SELECT *
FROM aqi_readings
WHERE aqi_value < 0 OR aqi_value > 500;
```

---

## 4. View: Duplicate Records

Detects duplicate records by sensor and timestamp.

```sql
CREATE OR REPLACE VIEW aqi_duplicates AS
SELECT sensor_id,
       timestamp,
       COUNT(*) AS duplicate_count
FROM aqi_readings
GROUP BY sensor_id, timestamp
HAVING COUNT(*) > 1;
```
![7c168434-77fb-4fed-9a62-069abc921c25](https://github.com/user-attachments/assets/4f0ad5ab-52c7-43d5-9cc1-2bf5872dff96)

---

## 5. View: Points Outside Designated Region

Requires `region_boundary` polygon layer.

```sql
CREATE OR REPLACE VIEW aqi_outside_boundary AS
SELECT aqi.*
FROM aqi_readings aqi
LEFT JOIN region_boundary rb ON ST_Within(aqi.geom, rb.geom)
WHERE rb.geom IS NULL;
```

---

## 6. Function: Get Missing Hourly Readings

Detects which hourly intervals are missing for each sensor in the past 24 hours.

```sql
CREATE OR REPLACE FUNCTION get_missing_hourly_readings()
RETURNS TABLE(sensor_id TEXT, missing_hour TIMESTAMP) AS $$
BEGIN
  RETURN QUERY
  WITH hours AS (
    SELECT generate_series(
      NOW() - interval '24 hours',
      NOW(),
      interval '1 hour'
    ) AS hour
  ),
  sensors AS (
    SELECT DISTINCT sensor_id FROM aqi_readings
  ),
  sensor_hours AS (
    SELECT s.sensor_id, h.hour
    FROM sensors s CROSS JOIN hours h
  )
  SELECT sh.sensor_id, sh.hour
  FROM sensor_hours sh
  WHERE NOT EXISTS (
    SELECT 1 FROM aqi_readings ar
    WHERE ar.sensor_id = sh.sensor_id
      AND date_trunc('hour', ar.timestamp) = sh.hour
  );
END;
$$ LANGUAGE plpgsql;
```

---

## 7. View: QA/QC Summary

Returns summary metrics for dashboards or reports.

```sql
CREATE OR REPLACE VIEW aqi_qaqc_summary AS
SELECT
  COUNT(*) AS total_records,
  COUNT(*) FILTER (WHERE aqi_value IS NULL) AS null_aqi,
  COUNT(*) FILTER (WHERE aqi_value < 0 OR aqi_value > 500) AS out_of_range,
  COUNT(*) FILTER (WHERE timestamp IS NULL) AS null_timestamps
FROM aqi_readings;
```

---

## 8. Indexing

Ensure efficient query performance, especially for spatial checks.

```sql
CREATE INDEX IF NOT EXISTS idx_aqi_geom ON aqi_readings USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_aqi_sensor_time ON aqi_readings (sensor_id, timestamp);
```

---

**End of QA/QC Toolkit**

