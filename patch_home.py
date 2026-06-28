import re

with open("src/pages/Home.jsx", "r") as f:
    content = f.read()

# Replace any explicit references to external micro-app links or dead paths
# Wait, let's check what the links actually look like in Home.jsx first.
