import requests
from bs4 import BeautifulSoup
import json
import urllib.parse

from ddgs import DDGS
import json

def test_search(query):
    term = f"{query} site:made-in-china.com"
    print(f"Searching: {term}")
    with DDGS() as ddgs:
        results = [r for r in ddgs.text(term, max_results=10)]
        print(json.dumps(results, indent=2))

if __name__ == "__main__":
    test_search("Compression Socks")
