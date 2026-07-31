const fs = require('fs');
const file = 'src/pages/Profile.jsx';
let content = fs.readFileSync(file, 'utf8');

const searchStr = `{activeTab === 'vault' && (
          <div className="animate-fade-in">
             <VaultedRecords />
          </div>
        )}`;

const replaceStr = `{activeTab === 'vault' && (
          <div className="animate-fade-in">
             {isWeb3Authenticated ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-[#050505] border border-axim-purple/30 p-4 rounded-sm flex items-center justify-between shadow-[0_0_15px_rgba(147,51,234,0.1)] hover:border-axim-purple transition-colors">
                   <div>
                     <h4 className="text-white text-xs font-black uppercase tracking-widest">Cipher Key #001</h4>
                     <p className="text-zinc-500 font-mono text-[10px]">ERC-1155 // ARBITRUM_ONE</p>
                   </div>
                   <SafeIcon className="w-5 h-5 text-axim-purple" icon={LuIcons.LuKey}/>
                 </div>
               </div>
             ) : (
               <VaultedRecords />
             )}
          </div>
        )}`;

content = content.replace(searchStr, replaceStr);
fs.writeFileSync(file, content);
