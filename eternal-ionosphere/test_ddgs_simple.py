from ddgs import DDGS

with DDGS() as ddgs:
    # Test simple search
    results = [r for r in ddgs.text("Compression Socks", max_results=2)]
    print(f"Simple search found {len(results)} items")
    for r in results:
        print(f"Title: {r.get('title')}")

    # Test with site: operator
    results_site = [r for r in ddgs.text("Compression Socks site:made-in-china.com", max_results=2)]
    print(f"Site search found {len(results_site)} items")
