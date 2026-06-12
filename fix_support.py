import re

with open('src/pages/Support.jsx', 'r') as f:
    content = f.read()

# I accidentally removed some constants in my earlier replacement.
# Let's restore them by getting them from main branch.
import subprocess
result = subprocess.run(['git', 'show', 'main:src/pages/Support.jsx'], capture_output=True, text=True)
main_content = result.stdout

# Find the missing constants in main_content
handle_file_match = re.search(r'const handleFileChange = \(e\) => \{.*?\n  \};', main_content, re.DOTALL)
faqs_match = re.search(r'const faqs = \[.*?\n  \];', main_content, re.DOTALL)
wiki_match = re.search(r'const wikiCategories = \[.*?\n  \];', main_content, re.DOTALL)

if handle_file_match:
    content = content.replace('const handleSubmit = async', handle_file_match.group(0) + '\n\n  const handleSubmit = async')

if faqs_match and wiki_match:
    # insert before return
    content = content.replace('  return (', faqs_match.group(0) + '\n\n  ' + wiki_match.group(0) + '\n\n  return (')

with open('src/pages/Support.jsx', 'w') as f:
    f.write(content)
