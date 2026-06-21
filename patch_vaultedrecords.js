import fs from 'fs';

const filePath = 'src/components/VaultedRecords.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Update logic to render mocked content for Web3 users
content = content.replace(
  `export default function VaultedRecords() {`,
  `export default function VaultedRecords() {
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);`
);

const newVaultContent = `        ) : isWeb3Authenticated ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mock Web3 Record 1 */}
            <div className="p-4 border border-white/10 bg-[#050505] rounded-sm hover:border-axim-purple/50 transition-colors group relative">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2 pr-8">
                    <h3 className="text-white font-bold text-sm tracking-wide">Mutual NDA - Partner #812</h3>
                    <span className="text-[0.6rem] px-2 py-0.5 bg-axim-purple/20 text-axim-purple uppercase tracking-widest rounded-sm">
                      NDA
                    </span>
                  </div>
                  <p className="text-zinc-500 text-xs font-mono mb-4 flex items-center gap-2">
                    <SafeIcon icon={LuIcons.LuCalendar} className="w-3 h-3" />
                    {new Date().toLocaleDateString()}
                  </p>
                  <div className="mt-auto">
                    <button
                      onClick={() => useAximStore.getState().showToast('Simulating mock document download...', 'info')}
                      className="w-full py-2 bg-transparent border border-white/10 text-zinc-300 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm flex items-center justify-center gap-2"
                    >
                      <SafeIcon icon={LuIcons.LuDownload} className="w-3 h-3" />
                      Download (Mock) &darr;
                    </button>
                  </div>
                </div>
            </div>

            {/* Mock Web3 Record 2 */}
            <div className="p-4 border border-white/10 bg-[#050505] rounded-sm hover:border-axim-purple/50 transition-colors group relative">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2 pr-8">
                    <h3 className="text-white font-bold text-sm tracking-wide">Income Verification - Q3</h3>
                    <span className="text-[0.6rem] px-2 py-0.5 bg-axim-purple/20 text-axim-purple uppercase tracking-widest rounded-sm">
                      PAY STUB
                    </span>
                  </div>
                  <p className="text-zinc-500 text-xs font-mono mb-4 flex items-center gap-2">
                    <SafeIcon icon={LuIcons.LuCalendar} className="w-3 h-3" />
                    {new Date(Date.now() - 86400000).toLocaleDateString()}
                  </p>
                  <div className="mt-auto">
                    <button
                      onClick={() => useAximStore.getState().showToast('Simulating mock document download...', 'info')}
                      className="w-full py-2 bg-transparent border border-white/10 text-zinc-300 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm flex items-center justify-center gap-2"
                    >
                      <SafeIcon icon={LuIcons.LuDownload} className="w-3 h-3" />
                      Download (Mock) &darr;
                    </button>
                  </div>
                </div>
            </div>
          </div>
        ) : vaultedArtifacts && vaultedArtifacts.length > 0 ? (`

content = content.replace(
  `) : vaultedArtifacts && vaultedArtifacts.length > 0 ? (`,
  newVaultContent
);

fs.writeFileSync(filePath, content);
console.log('Patched src/components/VaultedRecords.jsx');
