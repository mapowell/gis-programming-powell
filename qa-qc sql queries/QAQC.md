
[📂 Example_QA_QC_Log_Table.csv](https://github.com/user-attachments/files/19857197/Example_QA_QC_Log_Table.csv)

# QA/QC Toolkit for Air Quality GIS Data

**Target DB**: PostgreSQL with PostGIS  
**Description**: Performs validations, flags issues, logs problems, and enables modular reuse.

---

## 1. Create QA/QC Issues Log Table

Stores all flagged QA/QC issues for tracking and auditing.

```sql
CREATE TABLE IF NOT EXISTS aqi_qaqc_issues (
    issue_id SERIAL PRIMARY KEY,
    sensor_id TEXT,
    timestamp TIMESTAMP,
    issue_type TEXT,
    issue_details TEXT,
    created_at TIMESTAMP DEFAULT now()
);
```

| issue_id | sensor_id | timestamp           | issue_type    | issue_details                         | created_at           |
|----------|-----------|---------------------|---------------|----------------------------------------|----------------------|
| 1        | AQ101     | 2025-04-22 18:36:14 | Missing Data  | No AQI reading at 3 AM                | 2025-04-22 18:51:14  |
| 2        | AQ204     | 2025-04-22 19:36:14 | Out-of-Range  | AQI value reported as 999             | 2025-04-22 19:46:14  |
| 3        | AQ305     | 2025-04-22 20:36:14 | Spatial Error | Point recorded outside region boundary| 2025-04-22 21:06:14  |

---

## 2. View: Check for NULL Values

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

```sql
CREATE OR REPLACE VIEW aqi_out_of_range AS
SELECT *
FROM aqi_readings
WHERE aqi_value < 0 OR aqi_value > 500;
```

---

## 4. View: Duplicate Records

```sql
CREATE OR REPLACE VIEW aqi_duplicates AS
SELECT sensor_id,
       timestamp,
       COUNT(*) AS duplicate_count
FROM aqi_readings
GROUP BY sensor_id, timestamp
HAVING COUNT(*) > 1;
```

<h3>📊 Figure: Duplicate Record Count by Sensor</h3>

<img src="https://github.com/user-attachments/assets/4f0ad5ab-52c7-43d5-9cc1-2bf5872dff96" 
     alt="Duplicate Record Count by Sensor" 
     width="450"/>

<p style="margin-top: 0.5em;">
This figure displays how frequently each sensor recorded duplicate AQI readings for the same timestamp. High counts may indicate data submission errors or faulty device behavior.
</p>

---

## 5. View: Points Outside Designated Region

```sql
CREATE OR REPLACE VIEW aqi_outside_boundary AS
SELECT aqi.*
FROM aqi_readings aqi
LEFT JOIN region_boundary rb ON ST_Within(aqi.geom, rb.geom)
WHERE rb.geom IS NULL;
```

<h3>🗺️ Figure: Points Outside Designated Region</h3>

<img src="https://github.com/user-attachments/assets/1c31ba08-df7b-416f-b191-680b81eea7d6" 
     alt="Points Outside Designated Region" 
     width="500"/>

<p style="margin-top: 0.5em;">
This map shows air quality sensors in relation to a designated boundary. Blue markers indicate valid readings within the boundary, while red markers represent spatial errors — sensors located outside the allowed region as identified by the <code>ST_Within()</code> spatial check.
</p>

---

## 6. Function: Get Missing Hourly Readings

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
### ⏱️ Figure: Missing Hourly Readings by Sensor

<img src="https://github.com/user-attachments/assets/2dd52c12-4022-457e-92a3-5eb57c6966cf"
     alt="Missing Hourly Readings by Sensor"
     width="600"/>

This heatmap visualizes hourly AQI data completeness for five sensors over the last 24 hours.  
Each row corresponds to a sensor, and each column to an hour.  
- **Blue cells** = valid readings  
- **White cells** = missing data

This visual complements the `get_missing_hourly_readings()` function by providing a quick-glance view of time-series gaps in monitoring data.

---

## 7. View: QA/QC Summary

```sql
CREATE OR REPLACE VIEW aqi_qaqc_summary AS
SELECT
  COUNT(*) AS total_records,
  COUNT(*) FILTER (WHERE aqi_value IS NULL) AS null_aqi,
  COUNT(*) FILTER (WHERE aqi_value < 0 OR aqi_value > 500) AS out_of_range,
  COUNT(*) FILTER (WHERE timestamp IS NULL) AS null_timestamps
FROM aqi_readings;
```
### 📊 Figure: QA/QC Summary of AQI Readings

<img src="https://github.com/user-attachments/assets/de14f6fa-5df6-4a77-923d-468a8716f27e"
     alt="QA/QC Summary Pie Chart"
     width="450"/>

This pie chart summarizes the quality assurance status of AQI data records:
- **Valid Records**: Successfully recorded and usable (88%)
- **Missing AQI**: AQI value was not captured (4%)
- **Out-of-Range AQI**: AQI value was outside EPA’s accepted range (6%)
- **Missing Timestamps**: Time of record was not logged (2%)

The figure corresponds to the `aqi_qaqc_summary` SQL view and gives a high-level overview of data quality distribution in the dataset.

---

## 8. Indexing

```sql
CREATE INDEX IF NOT EXISTS idx_aqi_geom ON aqi_readings USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_aqi_sensor_time ON aqi_readings (sensor_id, timestamp);
```

---

**End of QA/QC Toolkit**
