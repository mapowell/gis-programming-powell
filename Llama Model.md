# 🧠 `llama_parser.py`

A natural language parser built on **Meta-LLaMA** models using Hugging Face Transformers.  
It converts real estate queries (e.g., “Find listings under 600k in wildfire zones”) into **structured JSON**.

---

## 📦 Purpose

The `LlamaQueryParser` class wraps a LLaMA model to:
- Interpret **unstructured language**
- Return **clean JSON** inside `<<<JSON_START>>>` and `<<<JSON_END>>>`
- Power downstream systems such as AI search tools, structured filters, or map apps

---

## 🧪 Example Use Case

```python
from llama_parser import LlamaQueryParser

parser = LlamaQueryParser()
query = "Find listings under 600000 in wildfire zones"
result = parser.parse(query)

# Output: a structured dictionary like:
# {
#   "layer": "properties",
#   "filters": {
#     "fire_risk": "high",
#     "price": { "lt": 600000 }
#   }
# }
