
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
```

---

## ⚙️ Required Environment Variables

| Variable                 | Description                                      |
|--------------------------|--------------------------------------------------|
| `MODEL_ID`               | (Optional) Hugging Face model ID (default: `Meta-Llama-3-8B-Instruct`) |
| `HUGGINGFACE_HUB_TOKEN`  | (Optional) Access token for gated/private models |

Load them from a `.env` file with `python-dotenv`.

---

## 🔄 Key Methods

| Method                   | Purpose                                                       |
|--------------------------|---------------------------------------------------------------|
| `parse(query)`           | Converts a natural language query into a structured dictionary |
| `_build_prompt(query)`   | Builds the system + user prompt with JSON formatting rules     |
| `_generate_output()`     | Calls the LLaMA model with retry and stop token support        |
| `_extract_json()`        | Extracts valid JSON from the model's text output               |

---

## 🔧 Constructor Options

```python
LlamaQueryParser(
  model_id="Meta-Llama-3-8B-Instruct",
  hf_token=None,
  device="auto",
  max_new_tokens=150,
  temperature=0.7,
  retries=3
)
```

These control generation behavior, model source, and retry logic.

---

## 📄 JSON Output Format

The expected structure of every parsed output:

```json
<<<JSON_START>>>
{
  "layer": "properties",
  "filters": {
    "fire_risk": "<string>",
    "price": { "lt": <number> }
  }
}
<<<JSON_END>>>
```

⚠️ Any extra text, characters, or formatting is stripped during parsing.

---

## 🧪 Test Script

You can run the script directly for CLI testing:

```bash
python llama_parser.py
```

---

## 🧱 Dependencies

- `torch`
- `transformers`
- `dotenv`

Install with:

```bash
pip install torch transformers python-dotenv
```

---

## ❗ Error Handling

The parser will return an error dictionary if:
- JSON cannot be found between markers
- Model fails to respond or generate
- Output is malformed

Example:
```json
{
  "error": "Failed to parse JSON output from model.",
  "raw": "<full model output here>"
}
```

---

## 🧠 Use This When...

- You need to **convert unstructured real estate queries into structured filters**
- You’re building an AI map interface, filtering engine, or natural language search tool
- You want to abstract away prompt handling + LLM calling into one reliable class
