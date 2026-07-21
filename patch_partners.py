import os
import re

partners = [
    ('src/pages/partners/ChatbaseLanding.jsx', 'chatbase'),
    ('src/pages/partners/MakeLanding.jsx', 'make'),
    ('src/pages/partners/PowurSolarLanding.jsx', 'powur_solar'),
    ('src/pages/partners/PowurJoinLanding.jsx', 'powur_join')
]

for file_path, partner_name in partners:
    with open(file_path, 'r') as f:
        content = f.read()

    if "import { motion } from 'framer-motion';" not in content:
        content = content.replace("import React from 'react';", "import React from 'react';\nimport { motion } from 'framer-motion';")
        content = content.replace("import React, { useEffect } from 'react';", "import React, { useEffect } from 'react';\nimport { motion } from 'framer-motion';")
        content = content.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { motion } from 'framer-motion';")

    if "import { logTelemetry } from '../../lib/telemetry';" not in content:
        content = content.replace("import SEO from '../../components/SEO';", "import SEO from '../../components/SEO';\nimport { logTelemetry } from '../../lib/telemetry';")

    content = re.sub(r'(return\s*\(\s*)<div([^>]*)>', r'\1<motion.div\2\n      onViewportEnter={() => {\n        logTelemetry(\'partner_landing_viewed\', { partner: \'' + partner_name + r'\' });\n      }}\n      viewport={{ once: true, amount: 0.2 }}\n    >', content, count=1)

    content = re.sub(r'</div>\s*\);\s*}\s*$', r'</motion.div>\n  );\n}\n', content)

    with open(file_path, 'w') as f:
        f.write(content)
