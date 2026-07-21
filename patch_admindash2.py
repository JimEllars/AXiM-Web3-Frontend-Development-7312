with open("src/pages/AdminDashboard.jsx", "r") as f:
    content = f.read()

content = content.replace("</motion.section>\n\n      <motion.section", "</section>\n\n      <motion.section")

with open("src/pages/AdminDashboard.jsx", "w") as f:
    f.write(content)
