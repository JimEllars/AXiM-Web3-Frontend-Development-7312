with open("src/components/admin/LeadManager.jsx", "r") as f:
    content = f.read()

content = content.replace("import { motion } from 'framer-motion';\nimport { logTelemetry } from '../../lib/telemetry';\nimport { logTelemetry, getTelemetryStore } from '../../lib/telemetry';", "import { motion } from 'framer-motion';\nimport { logTelemetry, getTelemetryStore } from '../../lib/telemetry';")
content = content.replace("import { motion } from 'framer-motion';\nimport { logTelemetry } from '../../lib/telemetry';\nimport { getTelemetryStore } from '../../lib/telemetry';", "import { motion } from 'framer-motion';\nimport { logTelemetry, getTelemetryStore } from '../../lib/telemetry';")
with open("src/components/admin/LeadManager.jsx", "w") as f:
    f.write(content)
