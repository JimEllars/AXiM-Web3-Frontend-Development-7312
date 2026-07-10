import re

with open('src/components/ArticleCard.test.jsx', 'r') as f:
    content = f.read()

# Remove duplicate imports
content = content.replace("import { vi } from 'vitest';\n", "")

with open('src/components/ArticleCard.test.jsx', 'w') as f:
    f.write(content)

print("ArticleCard.test.jsx syntax patched.")
