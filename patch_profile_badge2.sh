#!/bin/bash
node -e "
const fs = require('fs');
let content = fs.readFileSync('src/pages/Profile.jsx', 'utf8');
const searchString = \`              ) : (
                user?.email || 'AXIM_OP_001'
              )}
            </p>
          </div>\`;
const replaceString = \`              ) : (
                user?.email || 'AXIM_OP_001'
              )}
            </p>
            {isWeb3Authenticated && walletAddress && (
              <div className=\\\"mt-3 inline-flex items-center gap-2 px-2.5 py-1 bg-axim-purple/10 border border-axim-purple/30 text-[9px] font-mono tracking-widest text-axim-purple uppercase rounded-sm select-none\\\">
                <span className=\\\"w-1.5 h-1.5 rounded-full bg-axim-purple animate-pulse\\\" />
                [VAULT_KEY: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)} // SECURE]
              </div>
            )}
          </div>\`;
content = content.replace(searchString, replaceString);
fs.writeFileSync('src/pages/Profile.jsx', content);
"
