import re

with open('src/components/Header.jsx', 'r') as f:
    content = f.read()

# Update navLinks
content = content.replace(
    "{ name: 'Quick Demand Letter', path: '/tools/nda', icon: LuIcons.LuShieldCheck, color: 'text-axim-purple' }",
    "{ name: 'Quick Demand Letter', path: 'https://quickdemandletter.com/start', icon: LuIcons.LuShieldCheck, color: 'text-axim-purple' }"
)

# Update Desktop Dropdown
desktop_search = """                    {/* Deep-Dive Funnel Links */}
                    {link.dropdown.map((subLink) => (
                      <Link
                        key={subLink.name}
                        to={subLink.path}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-sm transition-colors group/sub"
                      >
                        <SafeIcon icon={subLink.icon} className={`w-4 h-4 ${subLink.color} opacity-70 group-hover/sub:opacity-100 transition-opacity`} />
                        <span className="text-xs font-bold text-zinc-300 group-hover/sub:text-white transition-colors">{subLink.name}</span>
                      </Link>
                    ))}"""

desktop_replace = """                    {/* Deep-Dive Funnel Links */}
                    {link.dropdown.map((subLink) => (
                      subLink.path.startsWith('http') ? (
                        <a
                          key={subLink.name}
                          href={subLink.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-sm transition-colors group/sub"
                        >
                          <SafeIcon icon={subLink.icon} className={`w-4 h-4 ${subLink.color} opacity-70 group-hover/sub:opacity-100 transition-opacity`} />
                          <span className="text-xs font-bold text-zinc-300 group-hover/sub:text-white transition-colors">{subLink.name}</span>
                        </a>
                      ) : (
                        <Link
                          key={subLink.name}
                          to={subLink.path}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-sm transition-colors group/sub"
                        >
                          <SafeIcon icon={subLink.icon} className={`w-4 h-4 ${subLink.color} opacity-70 group-hover/sub:opacity-100 transition-opacity`} />
                          <span className="text-xs font-bold text-zinc-300 group-hover/sub:text-white transition-colors">{subLink.name}</span>
                        </Link>
                      )
                    ))}"""

content = content.replace(desktop_search, desktop_replace)

# Update Mobile Dropdown
mobile_search = """                      {link.dropdown.map((subLink) => (
                        <Link
                          key={subLink.name}
                          to={subLink.path}
                          className="flex items-center gap-3 py-2"
                        >
                          <SafeIcon icon={subLink.icon} className={`w-4 h-4 ${subLink.color}`} />
                          <span className="text-sm font-bold text-zinc-400 active:text-white">{subLink.name}</span>
                        </Link>
                      ))}"""

mobile_replace = """                      {link.dropdown.map((subLink) => (
                        subLink.path.startsWith('http') ? (
                          <a
                            key={subLink.name}
                            href={subLink.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 py-2"
                          >
                            <SafeIcon icon={subLink.icon} className={`w-4 h-4 ${subLink.color}`} />
                            <span className="text-sm font-bold text-zinc-400 active:text-white">{subLink.name}</span>
                          </a>
                        ) : (
                          <Link
                            key={subLink.name}
                            to={subLink.path}
                            className="flex items-center gap-3 py-2"
                          >
                            <SafeIcon icon={subLink.icon} className={`w-4 h-4 ${subLink.color}`} />
                            <span className="text-sm font-bold text-zinc-400 active:text-white">{subLink.name}</span>
                          </Link>
                        )
                      ))}"""

content = content.replace(mobile_search, mobile_replace)

with open('src/components/Header.jsx', 'w') as f:
    f.write(content)
