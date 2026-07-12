import subprocess
import time

def run():
    result = subprocess.run(["npm", "run", "test", "src/pages/Article.test.jsx"], capture_output=True, text=True)
    print(result.stdout)
    print(result.stderr)

run()
