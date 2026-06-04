with open('src/pages/Article.jsx', 'r') as f:
    content = f.read()

# Replace LuAlertTriangle with LuTriangleAlert
content = content.replace("LuAlertTriangle", "LuTriangleAlert")

with open('src/pages/Article.jsx', 'w') as f:
    f.write(content)
