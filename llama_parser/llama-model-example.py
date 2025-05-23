"""
llama_parser.py
----------------------------------------------------
This script defines the `LlamaQueryParser` class, which wraps a LLaMA language model
using Hugging Face Transformers to convert natural language real estate queries into
structured JSON.

It builds a prompt, sends it to the model, and extracts a clean JSON response 
between <<<JSON_START>>> and <<<JSON_END>>> markers.

This tool is designed for use in applications like AI-powered search engines,
where structured input is required from unstructured user queries.

Required environment variables:
- MODEL_ID: Hugging Face model identifier (defaults to Meta-Llama-3-8B-Instruct)
- HUGGINGFACE_HUB_TOKEN: Optional Hugging Face access token (for gated models)

Dependencies:
- torch
- transformers
- dotenv
"""

import os
import json
import torch
import time
import warnings
import textwrap
from typing import Union, Dict, Optional
from transformers import AutoModelForCausalLM, AutoTokenizer
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

# Suppress warnings from internal pytree registration
warnings.filterwarnings("ignore", category=FutureWarning, message=".*_register_pytree_node.*")


class LlamaQueryParser:
    """
    A class that wraps a LLaMA language model to parse user queries into structured JSON
    using a defined prompt pattern.
    """

    def __init__(
        self,
        model_id: Optional[str] = None,
        hf_token: Optional[str] = None,
        device: str = "auto",
        max_new_tokens: int = 150,
        temperature: float = 0.7,
        retries: int = 3,
    ):
        """
        Initializes the LlamaQueryParser with configurable options.
        
        Args:
            model_id: Hugging Face model ID (defaults to Meta-Llama-3-8B-Instruct)
            hf_token: Optional Hugging Face token (used for private models)
            device: "auto", "cuda", or "cpu"
            max_new_tokens: Max tokens to generate
            temperature: Sampling temperature for generation
            retries: Retry attempts if generation fails
        """
        self.model_id = model_id or os.getenv("MODEL_ID", "Meta-Llama-3-8B-Instruct")
        self.hf_token = hf_token or os.getenv("HUGGINGFACE_HUB_TOKEN")
        self.device = device
        self.max_new_tokens = max_new_tokens
        self.temperature = temperature
        self.retries = retries
        self._model = None
        self._tokenizer = None
        self._load_tokenizer()

    def _load_tokenizer(self):
        """Initializes the tokenizer from the model ID."""
        self._tokenizer = AutoTokenizer.from_pretrained(
            self.model_id,
            trust_remote_code=True,
            token=self.hf_token
        )

    def _load_model(self):
        """Lazy-loads the language model with device mapping."""
        if self._model is None:
            self._model = AutoModelForCausalLM.from_pretrained(
                self.model_id,
                trust_remote_code=True,
                device_map=self.device,
                token=self.hf_token
            )
        return self._model

    def _generate_output(self, inputs):
        """
        Generates text from the model with retries and stop token handling.
        
        Args:
            inputs: Encoded input tokens
        
        Returns:
            Generated output tokens
        """
        model = self._load_model()
        inputs = inputs.to(next(model.parameters()).device)

        for attempt in range(self.retries):
            try:
                outputs = model.generate(
                    inputs,
                    max_new_tokens=self.max_new_tokens,
                    do_sample=True,
                    temperature=self.temperature,
                    eos_token_id=self._get_stop_token_id("<<<JSON_END>>>"),
                )
                return outputs
            except Exception as e:
                if attempt == self.retries - 1:
                    raise e
                time.sleep(1)

    def _get_stop_token_id(self, stop_str: str) -> Optional[int]:
        """
        Converts a stop string into its last token ID for early stopping.
        
        Args:
            stop_str: The string to stop on (e.g., <<<JSON_END>>>)
        
        Returns:
            The token ID of the final token in the stop string
        """
        encoded = self._tokenizer.encode(stop_str, add_special_tokens=False)
        return encoded[-1] if encoded else None

    def _build_prompt(self, query: str) -> str:
        """
        Builds the full prompt string to be passed into the language model.
        
        Args:
            query: The user’s natural language query
        
        Returns:
            A formatted prompt string with instructions and the user's input
        """
        return textwrap.dedent(f"""\
            You are a real estate assistant. Your job is to convert the user's request into a valid JSON object using the exact format below.
            Output ONLY the JSON object and no other text.
            Your entire output must consist of the following:
            <<<JSON_START>>>
            {{ 
              "layer": "<string>",
              "filters": {{
                "fire_risk": "<string>",
                "price": {{ "lt": <number> }}
              }}
            }}
            <<<JSON_END>>>
            Do not include any extra text, explanations, or characters.
            User: {query}
        """)

    def parse(self, query: str) -> Dict[str, Union[dict, str]]:
        """
        Converts a user query into a structured JSON format using the model.
        
        Args:
            query: A natural language query from the user
        
        Returns:
            Parsed JSON as a dictionary, or error message if parsing failed
        """
        prompt = self._build_prompt(query)
        inputs = self._tokenizer.encode(prompt, return_tensors="pt")

        try:
            outputs = self._generate_output(inputs)
            decoded = self._tokenizer.decode(outputs[0], skip_special_tokens=True)
        except Exception as e:
            return {"error": f"Model generation failed: {str(e)}"}

        return self._extract_json(decoded)

    def _extract_json(self, generated_text: str) -> Dict[str, Union[dict, str]]:
        """
        Extracts and parses JSON from the model’s generated output.
        
        Args:
            generated_text: The full decoded text generated by the model
        
        Returns:
            A dictionary parsed from the JSON section, or error details
        """
        start_marker = "<<<JSON_START>>>"
        end_marker = "<<<JSON_END>>>"
        start = generated_text.find(start_marker)
        end = generated_text.find(end_marker, start)

        if start != -1 and end != -1:
            json_str = generated_text[start + len(start_marker):end].strip()
            try:
                return json.loads(json_str)
            except json.JSONDecodeError:
                return {"error": "Failed to parse JSON output from model.", "raw": generated_text}
        return {"error": "No JSON output found.", "raw": generated_text}


# Optional test case for manual use
if __name__ == "__main__":
    parser = LlamaQueryParser()
    test_query = "Find listings under 600000 in wildfire zones"
    result = parser.parse(test_query)
    print(json.dumps(result, indent=2))
