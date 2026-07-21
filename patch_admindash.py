with open("src/pages/AdminDashboard.jsx", "r") as f:
    content = f.read()

content = content.replace(
    "const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);",
    "const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);\n  const walletAddress = useAximStore((state) => state.walletAddress);"
)

content = content.replace(
    """<div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-500/10 border border-red-500/30 text-[0.65rem] font-mono uppercase tracking-widest text-red-500 mb-4 rounded-sm">
            <SafeIcon icon={LuIcons.LuShieldAlert} className="w-3 h-3" />
            <span>Level 5 Clearance Authorized</span>
          </div>""",
    """<div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-500/10 border border-red-500/30 text-[0.65rem] font-mono uppercase tracking-widest text-red-500 mb-4 rounded-sm">
            <SafeIcon icon={LuIcons.LuShieldAlert} className="w-3 h-3" />
            <span>Level 5 Clearance Authorized</span>
          </div>
          {isWeb3Authenticated && walletAddress && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30 text-[9px] font-mono tracking-widest text-red-400 uppercase rounded-sm select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              [COMMAND_GATEWAY: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)} // LEVEL_5_CLEARANCE]
            </div>
          )}"""
)

with open("src/pages/AdminDashboard.jsx", "w") as f:
    f.write(content)
