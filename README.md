
# 🧠 GIS Programming Toolkit – Powell

This repository contains modular, production-ready tools for geospatial data analysis, AI-powered natural language parsing, and interactive map applications using Mapbox and ArcGIS.

---

## 📂 Repository Contents

| File/Component                          | Description                                                                 |
|-----------------------------------------|-----------------------------------------------------------------------------|
| [`llama_parser.py`](https://github.com/mapowell/gis-programming-powell/blob/main/llama_parser.py)         | Wraps Meta-LLaMA via Hugging Face to parse real estate queries into JSON    |
| [`llama_parser_documentation.md`](https://github.com/mapowell/gis-programming-powell/blob/main/llama_parser_documentation.md) | Documentation for how the parser works and how to run it                   |
| [`BatchEditor.tsx`](https://github.com/mapowell/gis-programming-powell/blob/main/BatchEditor.tsx)         | ArcGIS Experience Builder widget for spatial selection and batch editing    |
| [`batch_editor_documentation.md`](https://github.com/mapowell/gis-programming-powell/blob/main/batch_editor_documentation.md) | Setup and explanation of the batch editing workflow                         |
| [`MapView.tsx`](https://github.com/mapowell/gis-programming-powell/blob/main/MapView.tsx)                 | React component that renders a Mapbox map with marker support               |
| [`mapview_documentation.md`](https://github.com/mapowell/gis-programming-powell/blob/main/mapview_documentation.md) | Details the setup, props, and usage of the `MapView` component             |
| [`README.md`](https://github.com/mapowell/gis-programming-powell/blob/main/README.md)                     | This file – summary and structure of the repo                               |

---

## 🧠 Module Highlights

### `llama_parser.py`
- Converts natural language queries into structured real estate search JSON
- Uses Meta-LLaMA via Hugging Face + Transformers
- Handles formatting, retries, and environment token loading

### `BatchEditor.tsx`
- Interactive tool for selecting features via drawn geometry
- Batch-updates attributes in ArcGIS Online layers
- Useful in QA/QC or post-processing workflows

### `MapView.tsx`
- Simple Mapbox map with marker and viewport tracking
- Built with `react-map-gl` and `mapbox-gl`
- Uses a .env token and handles errors with a `Logger` utility

---

## ⚙️ Setup Instructions

### Install Dependencies

**For LLaMA Parser:**
```bash
pip install torch transformers python-dotenv
```

**For Map Components:**
```bash
npm install react-map-gl mapbox-gl
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root with the following:

```env
# LLaMA parser settings
MODEL_ID=Meta-Llama-3-8B-Instruct
HUGGINGFACE_HUB_TOKEN=your_token_here

# Mapbox token for MapView
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

---

## 📄 License

MIT — use freely and adapt for your own geospatial AI workflows.
