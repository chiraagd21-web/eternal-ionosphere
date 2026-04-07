import requests
import json

payload = {"query": "Compression Socks", "limit": 10}
url = "http://localhost:8000/ag/supplier-search"

try:
    print(f"Testing {url}...")
    res = requests.post(url, json=payload, timeout=20)
    print(f"Status: {res.status_code}")
    data = res.json()
    print(f"Found {len(data.get('suppliers', []))} suppliers")
    print(f"Source: {data.get('source')}")
    if data.get('suppliers'):
        print(f"First result: {data['suppliers'][0].get('productName')}")
except Exception as e:
    print(f"Error: {e}")
