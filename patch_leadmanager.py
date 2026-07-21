with open("src/components/admin/LeadManager.jsx", "r") as f:
    content = f.read()

content = content.replace(
    "import { motion } from 'framer-motion';",
    "import { motion } from 'framer-motion';\nimport { logTelemetry } from '../../lib/telemetry';"
)

content = content.replace(
    "const prompt = `[SYSTEM] Draft a highly professional, 3-sentence B2B outreach email to ${lead.primaryContact} at ${lead.companyName} regarding their inquiry about ${lead.serviceInterest}. Format with proper spacing.`;",
    "const prompt = `[SYSTEM] Draft a highly professional, 3-sentence B2B outreach email to ${lead.primaryContact} at ${lead.companyName} regarding their inquiry about ${lead.serviceInterest}. Format with proper spacing.`;\n    logTelemetry('lead_onyx_draft_generated', { leadId: lead.id });"
)

content = content.replace(
    "const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });",
    "const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });\n    logTelemetry('lead_csv_exported', { type: 'leads_or_telemetry' });"
)

with open("src/components/admin/LeadManager.jsx", "w") as f:
    f.write(content)
