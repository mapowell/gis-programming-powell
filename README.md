
# 🧠 Lottly AI Toolkit: GIS + AI Modules

This repository contains production-ready modules used in the Lottly AI system for geospatial data interaction, AI-powered search parsing, UI-based feature editing, and geospatial QA/QC workflows.

---

## 📂 Contents

| File/Component                          | Description                                                                 |
|-----------------------------------------|-----------------------------------------------------------------------------|
| `llama_parser.py`                       | Uses Meta LLaMA to convert natural language real estate queries into JSON   |
| `BatchEditor.tsx`                       | ArcGIS Experience Builder widget to select and batch-edit features on a map |
| `MapView.tsx`                           | React/Mapbox-based viewer with marker and viewport tracking                 |
| `aqi_qaqc_toolkit.md`                   | SQL-based QA/QC toolkit for spatial datasets in PostGIS                     |

---

## 📌 Modules Overview

### 🧠 `llama_parser.py`
- Wraps a Hugging Face LLaMA model
- Converts user queries like “lots under 500k in flood zones” into structured JSON
- Used to drive filters and logic in AI search environments  
📄 [View Docs](https://github.com/mapowell/gis-programming-powell/blob/main/llama_parser_documentation.md)

---

### 🛠️ `BatchEditor.tsx`
- Used in ArcGIS Experience Builder
- Lets users draw polygons to select features and apply batch field edits
- Useful for QA, cleanup, and mass attribute correction workflows  
📄 [View Docs](https://github.com/mapowell/gis-programming-powell/blob/main/batch_editor_documentation.md)

---

### 🗺️ `MapView.tsx`
- React map component built with `react-map-gl`
- Includes zoom/pan/marker UI
- Automatically updates if latitude/longitude props change  
📄 [View Docs](https://github.com/mapowell/gis-programming-powell/blob/main/mapview_documentation.md)

---

### 🧪 `aqi_qaqc_toolkit.md`
- SQL-driven quality control system for spatial and air quality datasets
- Includes views for:
  - Missing values
  - Out-of-range values
  - Duplicate entries
  - Spatial outliers using `ST_Within()`
- Includes `get_missing_hourly_readings()` function for sensor gap detection
- Includes summary view + pie chart and heatmap visuals  
📄 [View Docs](https://github.com/mapowell/gis-programming-powell/blob/main/aqi_qaqc_toolkit.md)

---

## 📦 Installation

```bash
# LLM support
pip install torch transformers python-dotenv

# Front-end & GIS tools
npm install react-map-gl mapbox-gl
```

> Ensure you also include your `.env` file with the appropriate environment variables:
> - `MODEL_ID`
> - `HUGGINGFACE_HUB_TOKEN`
> - `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`

---

## 🧠 Use This Repo If You Want To...
- Build AI assistants that convert language into filters
- Let GIS analysts edit layers visually in the browser
- Run QA/QC validation on spatial datasets
- Render token-aware maps in a modular React app

---

## 📄 License

MIT — use freely and adapt for your own GIS + AI systems.
