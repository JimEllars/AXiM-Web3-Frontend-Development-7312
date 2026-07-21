with open("src/components/admin/EcosystemRegistry.jsx", "r") as f:
    content = f.read()

content = content.replace(
    "import * as LuIcons from 'react-icons/lu';",
    "import * as LuIcons from 'react-icons/lu';\nimport { logTelemetry } from '../../lib/telemetry';"
)

content = content.replace(
    "setPingStatus(prev => ({ ...prev, [partnerId]: 'pinging' }));",
    "setPingStatus(prev => ({ ...prev, [partnerId]: 'pinging' }));\n    logTelemetry('ecosystem_connection_pinged', { partnerId });"
)

content = content.replace(
    "if (!webhookUrl || !apiKey || isSubmitting) return;\n\n    setIsSubmitting(true);",
    "if (!webhookUrl || !apiKey || isSubmitting) return;\n\n    setIsSubmitting(true);\n    logTelemetry('ecosystem_webhook_submitted', { partnerId: selectedPartner?.id });"
)

with open("src/components/admin/EcosystemRegistry.jsx", "w") as f:
    f.write(content)
