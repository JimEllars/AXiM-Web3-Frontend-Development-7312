with open('src/pages/AuthGateway.test.jsx', 'r') as f:
    content = f.read()

if "import { ThirdwebProvider } from 'thirdweb/react';" not in content:
    content = content.replace("import { HelmetProvider } from 'react-helmet-async';", "import { HelmetProvider } from 'react-helmet-async';\nimport { ThirdwebProvider } from 'thirdweb/react';")

# Replace render wrapping
search = """    render(
      <HelmetProvider>
        <MemoryRouter>
          <AuthGateway />
        </MemoryRouter>
      </HelmetProvider>
    );"""

replace = """    render(
      <ThirdwebProvider>
        <HelmetProvider>
          <MemoryRouter>
            <AuthGateway />
          </MemoryRouter>
        </HelmetProvider>
      </ThirdwebProvider>
    );"""

content = content.replace(search, replace)

with open('src/pages/AuthGateway.test.jsx', 'w') as f:
    f.write(content)
