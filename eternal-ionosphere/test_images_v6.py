from ddgs import DDGS
import json

with DDGS() as ddgs:
    try:
        results = [r for r in ddgs.images("Compression Socks export", max_results=20)]
        print(f"Found {len(results)} items")
        for r in results[:5]:
            print(f"URL: {r.get('url')}")
            print(f"Title: {r.get('title')}")
            print("---")
    except Exception as e:
        print(f"Error: {e}")
