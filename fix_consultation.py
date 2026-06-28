with open("src/pages/Consultation.jsx", "r") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if "const { scrollYProgress } = useScroll();" in line:
        continue
    new_lines.append(line)

content = "".join(new_lines)
with open("src/pages/Consultation.jsx", "w") as f:
    f.write(content)
