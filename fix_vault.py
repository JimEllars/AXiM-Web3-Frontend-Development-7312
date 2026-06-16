import re

with open("src/components/VaultedRecords.jsx", "r") as f:
    content = f.read()

# Replace the conditional logic after `fetching`
new_content = re.sub(
    r'vaultedArtifacts && vaultedArtifacts\.length > 0 \? \(.*\) : \(.*?\)',
    '''vaultedArtifacts && vaultedArtifacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vaultedArtifacts.map((record) => (
              <div key={record.id} className="p-4 border border-white/10 bg-[#050505] rounded-sm hover:border-axim-purple/50 transition-colors group relative">
                <button onClick={() => removeAction(record.id)} className="absolute top-2 right-2 text-zinc-600 hover:text-[#DB2777] p-2 transition-colors z-10" title="Purge Record">
                  <SafeIcon icon={LuIcons.LuTrash2} className="w-4 h-4" />
                </button>
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2 pr-8">
                    <h3 className="text-white font-bold text-sm tracking-wide">{record.title || record.name || record.target || 'UNTITLED ASSET'}</h3>
                    <span className="text-[0.6rem] px-2 py-0.5 bg-axim-purple/20 text-axim-purple uppercase tracking-widest rounded-sm">
                      {record.type || 'DOCUMENT'}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-xs font-mono mb-4 flex items-center gap-2">
                    <SafeIcon icon={LuIcons.LuCalendar} className="w-3 h-3" />
                    {record.timestamp || record.date ? new Date(record.timestamp || record.date).toLocaleDateString() : 'UNKNOWN DATE'}
                  </p>

                  <div className="mt-auto">
                    <button
                      onClick={() => alert(`Exporting ${record.type || 'DOCUMENT'} pipeline initialization...`)}
                      className="w-full py-2 bg-transparent border border-white/10 text-zinc-300 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm flex items-center justify-center gap-2"
                    >
                      <SafeIcon icon={LuIcons.LuDownload} className="w-3 h-3" />
                      Export Document
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-zinc-500 text-sm font-mono border border-white/5 p-8 text-center rounded-sm">
            NO CRYPTOGRAPHIC RECORDS FOUND. ACCESS THE TOOLS HUB TO GENERATE NEW ASSETS.
          </div>
        )''',
    content,
    flags=re.DOTALL
)

with open("src/components/VaultedRecords.jsx", "w") as f:
    f.write(new_content)
