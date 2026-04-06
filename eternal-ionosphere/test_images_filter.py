from ddgs import DDGS
import json

with DDGS() as ddgs:
    q = "compression socks"
    print(f"Testing image search for: {q}")
    results = [r for r in ddgs.images(q, max_results=50)]
    print(f"Found {len(results)} total images")
    
    b2b_hits = [r for r in results if any(x in r.get('url', '').lower() for x in ['made-in-china', 'alibaba', 'globalsources', 'thomasnet', 'globalsource'])]
    print(f"B2B domain hits: {len(b2b_hits)}")
    for r in b2b_hits[:5]:
        print(f"URL: {r.get('url')}")
        print(f"Title: {r.get('title')}")
        print("---")
