from ddgs import DDGS
import json

def test_search(query):
    term = f"{query} manufacturer OR supplier site:made-in-china.com OR site:globalsources.com OR site:alibaba.com"
    print(f"Searching: {term}")
    with DDGS() as ddgs:
        results = [r for r in ddgs.text(term, max_results=5)]
        print(json.dumps(results, indent=2))

if __name__ == "__main__":
    test_search("CNC aluminum parts")
