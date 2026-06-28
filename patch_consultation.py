import re

with open("src/pages/Consultation.jsx", "r") as f:
    content = f.read()

hooks_code = """
  const { scrollYProgress } = useScroll();
"""

pattern = re.compile(r'(export default function Consultation\(\) \{)')
content = pattern.sub(r'\1' + hooks_code, content, count=1)

with open("src/pages/Consultation.jsx", "w") as f:
    f.write(content)
