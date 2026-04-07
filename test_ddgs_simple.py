from ddgs import DDGS
import json

def test():
    with DDGS() as ddgs:
        results = [r for r in ddgs.text("industrial valves manufacturer", max_results=20)]
        print(f"Found {len(results)} results")
        for r in results[:2]:
            print(f"- {r.get('title')} ({r.get('href')})")

if __name__ == "__main__":
    test()
