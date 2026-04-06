from ddgs import DDGS
import json

def test_image_search(q):
    with DDGS() as ddgs:
        print(f"Searching images for: {q}")
        try:
            results = [r for r in ddgs.images(q, max_results=5)]
            print(f"Found {len(results)} images")
            if results:
                print(json.dumps(results[0], indent=2))
        except Exception as e:
            print(f"Error: {e}")

test_image_search("Compression Socks made-in-china product")
test_image_search("Compression Socks supplier alibaba")
