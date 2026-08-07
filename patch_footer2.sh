#!/bin/bash
# Insert isWeb3Authenticated extraction
sed -i '/const \[isOffline, setIsOffline\] = React.useState(false);/a \  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);' src/components/Footer.jsx

# Insert tag below branding
sed -i '/Builders of a new era. Integrating decentralized energy, logical connectivity, and autonomous intelligence./a \
            </p>\
            {isWeb3Authenticated && (\
              <span className="font-mono text-[8px] text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-sm select-none inline-flex items-center gap-1 mt-3 mb-6">\
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />\
                [OPERATOR_ID: VERIFIED // ARBITRUM]\
              </span>\
            )}' src/components/Footer.jsx

# We need to clean up the double closing </p> which might happen due to the `a\`
sed -i 's/<\/p>\n            <\/p>/<\/p>/g' src/components/Footer.jsx
