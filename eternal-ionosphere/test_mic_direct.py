import requests
from bs4 import BeautifulSoup

url = "https://www.made-in-china.com/products-search/find.html?keyword=compression+socks"
headers = {"User-Agent": "Mozilla/5.0"}
res = requests.get(url, headers=headers)
print("Status Code:", res.status_code)

if res.status_code == 200:
    soup = BeautifulSoup(res.text, "html.parser")
    # find images and product titles
    items = soup.select(".product-card, .list-node, .product-item, .J-searchCard")
    print(f"Items found: {len(items)}")
    for item in items[:5]:
        title = item.select_one(".product-name, .title, .product-title")
        price = item.select_one(".price, .product-price")
        company = item.select_one(".company, .company-name")
        img = item.select_one("img")
        
        print("Title:", title.text.strip() if title else None)
        print("Price:", price.text.strip() if price else None)
        print("Company:", company.text.strip() if company else None)
        print("Img:", img.get("src") if img else img.get("data-src") if img else None)
        print("---")
