from ddgs import DDGS
import json

with DDGS() as ddgs:
    print("Testing general image search...")
    try:
        results = [r for r in ddgs.images("compression socks", max_results=5)]
        print(f"Found {len(results)} items")
        if results:
            print(json.dumps(results[0], indent=2))
    except Exception as e:
        print(f"Error: {e}")
