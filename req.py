import urllib.request, json
req = urllib.request.Request('http://127.0.0.1:8000/v1/chat/completions', data=json.dumps({'tool_calls':[{'id':'call_1','type':'function','function':{'name':'submit','arguments':json.dumps({'branch_name': 'chore/telemetry', 'commit_message': 'Fix telemetry', 'title': 'Fix telemetry', 'description': 'desc'})}}]}).encode(), headers={'Content-Type': 'application/json'})
try:
    urllib.request.urlopen(req)
except Exception as e:
    pass
