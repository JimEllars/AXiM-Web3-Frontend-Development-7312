import re

with open('index.html', 'r') as f:
    content = f.read()

script = """
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-620C96FBF3"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-620C96FBF3');
    </script>
  </head>"""

content = content.replace("  </head>", script)

with open('index.html', 'w') as f:
    f.write(content)
