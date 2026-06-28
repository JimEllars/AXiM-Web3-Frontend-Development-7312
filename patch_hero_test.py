with open("src/components/Hero.test.jsx", "r") as f:
    content = f.read()

content = content.replace("Articles, AXiM Apps & Tools, & Learning Systems", "Partner Ecosystem, AXiM Apps & Tools, & Learning Systems")
content = content.replace("Explore Articles", "Explore Partners")

with open("src/components/Hero.test.jsx", "w") as f:
    f.write(content)
