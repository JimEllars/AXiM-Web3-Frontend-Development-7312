import subprocess

def run():
    result = subprocess.run(["npm", "run", "test"], capture_output=True, text=True)
    if "FAIL" in result.stdout or "FAIL" in result.stderr:
        print("Tests failed")
    else:
        print("Tests passed")

run()
