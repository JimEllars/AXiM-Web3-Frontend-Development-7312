import glob
import re

files = glob.glob('src/pages/partners/*.jsx')

for file in files:
    with open(file, 'r') as f:
        content = f.read()

    # Fix the improperly escaped strings in logTelemetry
    content = re.sub(r"logTelemetry\(\\'partner_landing_viewed\\', \{ partner: \\'([^\\]+)\\' \}\);", r"logTelemetry('partner_landing_viewed', { partner: '\1' });", content)

    with open(file, 'w') as f:
        f.write(content)
