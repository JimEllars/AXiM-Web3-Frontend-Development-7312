with open('src/pages/Business.jsx', 'r') as f:
    content = f.read()
if "import { useAximStore }" not in content:
    content = content.replace("import { Link } from 'react-router-dom';", "import { Link } from 'react-router-dom';\nimport { useAximStore } from '../store/useAximStore';")
with open('src/pages/Business.jsx', 'w') as f:
    f.write(content)
