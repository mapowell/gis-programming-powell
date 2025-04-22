
# 🧠 GIS Programming Toolkit – Powell

This repository contains modular, production-ready tools for geospatial data analysis, AI-powered search parsing, interactive mapping, and spatial data QA/QC.

---

## 📂 Repository Structure

| Directory                      | Description                                                                 |
|--------------------------------|-----------------------------------------------------------------------------|
| [`batch_editor/`](https://github.com/mapowell/gis-programming-powell/tree/main/batch_editor)         | ArcGIS Experience Builder widget for drawing and batch-editing attributes |
| [`llama_parser/`](https://github.com/mapowell/gis-programming-powell/tree/main/llama_parser)         | LLaMA model wrapper that parses real estate queries into structured JSON |
| [`map_viewer/`](https://github.com/mapowell/gis-programming-powell/tree/main/map_viewer)             | React-based Mapbox viewer with markers and viewport control               |
| [`gis_qaqc/`](https://github.com/mapowell/gis-programming-powell/tree/main/gis_qaqc)                 | SQL-driven QA/QC toolkit for spatial datasets in PostGIS                  |

---

## 🧠 Module Highlights

### [`llama_parser/`](https://github.com/mapowell/gis-programming-powell/tree/main/llama_parser)
- Converts natural language to structured real estate queries
- Uses Meta-LLaMA + Hugging Face Transformers
- Outputs clean JSON using predefined schema

📄 [View documentation](https://github.com/mapowell/gis-programming-powell/blob/main/llama_parser/llama_parser_documentation.md)

---

### [`batch_editor/`](https://github.com/mapowell/gis-programming-powell/tree/main/batch_editor)
- ArcGIS Experience Builder widget
- Draw a shape to select features
- Apply a field update to all selected features in a hosted layer

📄 [View documentation](https://github.com/mapowell/gis-programming-powell/blob/main/batch_editor/batch_editor_documentation.md)

---

### [`map_viewer/`](https://github.com/mapowell/gis-programming-powell/tree/main/map_viewer)
- Renders a Mapbox GL map with zoom, pan, and red circular marker
- Tracks viewport changes and exposes them to parent components
- Token is loaded from `.env` and error-logged if missing

📄 [View documentation](https://github.com/mapowell/gis-programming-powell/blob/main/map_viewer/mapview_documentation.md)

---

### [`gis_qaqc/`](https://github.com/mapowell/gis-programming-powell/tree/main/gis_qaqc)
- PostgreSQL + PostGIS-based QA/QC logic
- Includes:
  - Views for nulls, out-of-range, spatial outliers
  - A function to find missing hourly sensor data
- Heatmap and summary pie chart visuals included

📄 [View documentation](https://github.com/mapowell/gis-programming-powell/blob/main/gis_qaqc/aqi_qaqc_toolkit.md)

---

## ⚙️ Setup

### Python Environment
```bash
pip install torch transformers python-dotenv
```

### JavaScript Environment
```bash
npm install react-map-gl mapbox-gl
```

---

## 🔐 Environment Variables

```env
# llama_parser
MODEL_ID=Meta-Llama-3-8B-Instruct
HUGGINGFACE_HUB_TOKEN=your_token_here

# map_viewer
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

---

## 📄 License

MIT — use freely and adapt for your own GIS + AI workflows.
