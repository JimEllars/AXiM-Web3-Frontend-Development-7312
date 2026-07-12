import re

with open("src/pages/Article.jsx", "r") as f:
    content = f.read()

content = content.replace(r"\'", "'")

with open("src/pages/Article.jsx", "w") as f:
    f.write(content)

print("quotes fixed")
