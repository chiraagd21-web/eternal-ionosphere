from ddgs import DDGS
import json

def test_images(query):
    with DDGS() as ddgs:
        images = [img for img in ddgs.images(f"{query} site:made-in-china.com OR site:alibaba.com", max_results=5)]
        print(json.dumps(images, indent=2))

test_images("compression socks")
