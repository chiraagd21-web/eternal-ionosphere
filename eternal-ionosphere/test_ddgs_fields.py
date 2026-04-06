from ddgs import DDGS
import json

with DDGS() as ddgs:
    q = "compression socks site:made-in-china.com"
    print(f"Testing text search for: {q}")
    results = [r for r in ddgs.text(q, max_results=5)]
    for r in results:
        print(f"Title: {r.get('title')}")
        print(f"URL: {r.get('href')}")
        # Check for any image-related fields
        print(f"Other fields: {list(r.keys())}")
        print("---")
