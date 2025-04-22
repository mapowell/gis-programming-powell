
# 🧠 Lottly AI Toolkit: GIS + AI Modules

This repository contains production-ready modules used in the Lottly AI system for geospatial data interaction, AI-powered search parsing, and UI-based feature editing. The toolkit includes:

---

## 📂 Contents

| File/Component         | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| `llama_parser.py`      | Uses Meta LLaMA to convert natural language real estate queries into JSON   |
| `BatchEditor.tsx`      | ArcGIS Experience Builder widget to select and batch-edit features on a map |
| `MapView.tsx`          | React/Mapbox-based viewer with marker and viewport tracking for location UI |

---

## 📌 Modules Overview

### 🧠 `llama_parser.py`
- Wraps a Hugging Face LLaMA model
- Converts user queries like “lots under 500k in flood zones” into structured JSON
- Used to drive filters and logic in AI search environments

📄 Full documentation: [llama_parser_documentation.md](./llama_parser_documentation.md)

---

### 🛠️ `BatchEditor.tsx`
- Used in ArcGIS Experience Builder
- Lets users draw polygons to select features and apply batch field edits
- Useful for QA, cleanup, and mass attribute correction workflows

📄 Full documentation: [batch_editor_documentation.md](./batch_editor_documentation.md)

---

### 🗺️ `MapView.tsx`
- React map component built with `react-map-gl`
- Includes zoom/pan/marker UI
- Automatically updates if latitude/longitude props change

📄 Full documentation: [mapview_documentation.md](./mapview_documentation.md)

---

## 📦 Installation

```bash
# LLM support
pip install torch transformers python-dotenv

# Front-end & GIS tools
npm install react-map-gl mapbox-gl
```

> Ensure you also include your `.env` file with the appropriate environment variables (e.g., `MODEL_ID`, `HUGGINGFACE_HUB_TOKEN`, `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`).

---

## 🧠 Use This Repo If You Want To...
- Build AI assistants that convert language into filters
- Let GIS analysts edit layers visually in the browser
- Render fast, token-aware maps inside React apps

---

## 📄 License

MIT — use freely and adapt for your own GIS + AI systems.

