import urllib.request
import json

req = urllib.request.Request(
    'http://localhost:8080/review',
    data=json.dumps({"files": ["src/App.jsx", "src/pages/Dashboard.jsx", "src/components/Chatbot.jsx", "src/lib/telemetry.js", "src/components/GlobalTicker.jsx"]}).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

try:
    response = urllib.request.urlopen(req)
    print(response.read().decode('utf-8'))
except Exception as e:
    print(f"Error: {e}")
