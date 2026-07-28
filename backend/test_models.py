from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

models_to_test = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-001",
    "gemini-2.0-flash-lite",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.5-pro",
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.6-flash",
]

for m in models_to_test:
    try:
        r = client.models.generate_content(model=m, contents="Responde solo OK")
        print(f"  OK  {m} -> {r.text.strip()[:30]}")
    except Exception as e:
        err = str(e).split('\n')[0][:80]
        print(f"  FAIL  {m} -> {err}")
