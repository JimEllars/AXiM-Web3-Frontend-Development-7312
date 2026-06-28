import os
import re

files = [
    "src/pages/partners/MakeLanding.jsx",
    "src/pages/partners/PowurSolarLanding.jsx",
    "src/pages/partners/PowurJoinLanding.jsx",
    "src/pages/partners/ChatbaseLanding.jsx"
]

def replace_handler(content, dest_name):
    # Find existing handleOutboundClick and replace it with handlePartnerRedirect

    # We will just replace handleOutboundClick definition with handlePartnerRedirect
    # and also all references to it.

    # regex to find handleOutboundClick definition
    handler_pattern = re.compile(r'const handleOutboundClick = \(.*?\) => \{.*?\n  \};', re.DOTALL)

    new_handler = f"""const handlePartnerRedirect = async (e, placement) => {{
    e.preventDefault();

    // Promise-backed telemetry handler
    await new Promise(resolve => {{
      logTelemetry('PARTNER_FUNNEL_REDIRECT', {{ destination: '{dest_name}', origin: 'axim_hub', placement }});
      if (typeof window !== "undefined" && window.gtag) {{
        window.gtag("event", "outbound_partner_click", {{
          event_category: "conversion",
          event_label: "{dest_name}"
        }});
      }}
      setTimeout(resolve, 150);
    }});

    window.open(affiliateLink, '_blank', 'noopener,noreferrer');
  }};"""

    content = handler_pattern.sub(new_handler, content)

    # Replace calls
    content = content.replace("handleOutboundClick", "handlePartnerRedirect")

    return content

for file_path in files:
    with open(file_path, "r") as f:
        content = f.read()

    dest_name = ""
    if "MakeLanding" in file_path:
        dest_name = "make"
    elif "PowurSolarLanding" in file_path:
        dest_name = "powursolar"
    elif "PowurJoinLanding" in file_path:
        dest_name = "powur"
    elif "ChatbaseLanding" in file_path:
        dest_name = "chatbase"

    content = replace_handler(content, dest_name)

    # Check if ?via=axim_hub is already in affiliateLink
    if "via=axim_hub" not in content:
        # replace the link
        # e.g., const affiliateLink = "https://www.chatbase.co/?via=axim_hub";
        link_pattern = re.compile(r'const affiliateLink = "(.*?)";')
        match = link_pattern.search(content)
        if match:
            link = match.group(1)
            if "?" in link:
                new_link = link + "&via=axim_hub"
            else:
                new_link = link + "?via=axim_hub"
            content = content.replace(f'const affiliateLink = "{link}";', f'const affiliateLink = "{new_link}";')

    with open(file_path, "w") as f:
        f.write(content)
