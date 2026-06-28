with open("src/components/Hero.jsx", "r") as f:
    content = f.read()

content = content.replace('to="/articles"', 'to="/partners"')
content = content.replace('Explore Articles', 'Explore Partners')
content = content.replace('LuIcons.LuBookOpen', 'LuIcons.LuNetwork')
content = content.replace('Articles, AXiM Apps & Tools, & Learning Systems', 'Partner Ecosystem, AXiM Apps & Tools, & Learning Systems')

with open("src/components/Hero.jsx", "w") as f:
    f.write(content)
