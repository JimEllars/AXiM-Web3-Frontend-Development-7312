const fs = require('fs');
let content = fs.readFileSync('src/pages/Profile.jsx', 'utf8');

const targetStr = `              ID: {isWeb3Authenticated ? (
                <span className="text-axim-gold flex items-center gap-1 font-bold">
                  <SafeIcon icon={LuIcons.LuWallet} className="w-3 h-3" /> {walletAddress}
                </span>
              ) : (
                user?.email || 'AXIM_OP_001'
              )}
            </p>
          </div>`;

const replaceStr = `              ID: {isWeb3Authenticated ? (
                <span className="text-axim-gold flex items-center gap-1 font-bold">
                  <SafeIcon icon={LuIcons.LuWallet} className="w-3 h-3" /> {walletAddress}
                </span>
              ) : (
                user?.email || 'AXIM_OP_001'
              )}
            </p>
            {isWeb3Authenticated && walletAddress && (
              <div className="mt-3 inline-flex items-center gap-2 px-2.5 py-1 bg-axim-purple/10 border border-axim-purple/30 text-[9px] font-mono tracking-widest text-axim-purple uppercase rounded-sm select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-axim-purple animate-pulse" />
                [VAULT_KEY: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)} // SECURE]
              </div>
            )}
          </div>`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync('src/pages/Profile.jsx', content);
  console.log('Successfully patched Profile.jsx');
} else {
  console.log('Target string not found');
}
