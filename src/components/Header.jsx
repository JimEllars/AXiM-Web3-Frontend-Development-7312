import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import GlobalSearch from './GlobalSearch';
import { useAximStore } from '../store/useAximStore';
import { useAximAuth } from '../hooks/useAximAuth';
import { logTelemetry } from '../lib/telemetry.js';


export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const location = useLocation();

  const { session, user, profile } = useAximAuth();
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);
  const walletAddress = useAximStore((state) => state.walletAddress);
  const isAuthenticated = !!user || isWeb3Authenticated;

  const getDisplayName = () => {
    if (profile?.username) return profile.username;
    if (user?.email) return user.email.split('@')[0];
    if (walletAddress) return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
    return 'Operator';
  };


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);


  // Command Palette Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('open-global-search'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu automatically on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // STRICT ORDERING: Business -> Personal -> Tech -> Articles -> Store -> Support
  const navLinks = [
    { name: 'Business', path: '/business' },
    { name: 'Personal', path: '/personal' },
    { name: 'Tech', path: '/tech' },
    { name: 'Articles', path: '/articles' },
    { name: 'Store', path: '/store' },
    { name: 'Support', path: '/support' }
  ];

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <>

      <header
      className={`sticky top-0 w-full z-[60] transition-all duration-300 ${
        isScrolled ? 'bg-[#050505]/95 backdrop-blur-md border-b border-[#004040]/30 py-4 md:py-5' : 'bg-transparent py-6 md:py-7'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between gap-4 items-center">

        {/* Brand Logo Integration - White PNG */}
        <div className="flex flex-col">
          <Link to="/" className="flex items-center gap-3 group z-[60] flex-shrink-0 min-w-[140px] md:min-w-[200px] max-w-[50vw] overflow-hidden mr-4">
            <img src="https://wp.axim.us.com/wp-content/uploads/2026/08/AXiM-Business-Development-1200x628-layout1284-axim-infrastructure-axim-axim-1l7kujc-e1786418301264.webp" alt="AXiM Development" className="h-12 md:h-16 w-auto object-contain group-hover:scale-105 transition-all duration-300 drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]" />
          </Link>
          {isOffline && (
            <div className="mt-1 flex items-center justify-center px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 rounded-sm backdrop-blur-md animate-pulse">
              <span className="text-[10px] font-mono font-bold text-amber-500 tracking-widest uppercase">
                ⚡ OFFLINE MODE: Serving Local Cache
              </span>
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="relative group"
              onMouseEnter={() => link.dropdown && setActiveDropdown(link.name)}
              onMouseLeave={() => link.dropdown && setActiveDropdown(null)}
            >
              <Link onClick={() => logTelemetry('nav_link_click', { path: link.path, title: link.name.toLowerCase() })}
                to={link.path}
                className={`text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-1 pb-1 border-b-2 ${
                  location.pathname === link.path || location.pathname.startsWith(link.path + '/')
                    ? 'text-white border-[#004040]'
                    : 'text-zinc-400 border-transparent hover:text-white hover:border-[#004040]/50'
                }`}
              >
                {link.name}
                {link.dropdown && <SafeIcon icon={LuIcons.LuChevronDown} className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />}
              </Link>

              {/* Desktop Dropdown Mega-Menu */}
              {link.dropdown && activeDropdown === link.name && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-6 w-64 animate-fade-in-up">
                  <div className="bg-[#0A0A0A] border border-[#004040]/30 rounded-sm shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-2 flex flex-col gap-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#004040]/10 blur-[30px] pointer-events-none" />

                    {/* Top Level Hub Link */}
                    <Link onClick={() => logTelemetry('nav_link_click', { path: link.path, title: link.name.toLowerCase() })} to={link.path} className="px-4 py-3 text-[0.65rem] font-black uppercase tracking-widest text-zinc-500 hover:text-[#004040] border-b border-white/5 mb-1 transition-colors">
                      View All {link.name}
                    </Link>

                    {/* Deep-Dive Funnel Links */}
                    {link.dropdown.map((subLink) => (
                      subLink.path.startsWith('http') ? (
                        <a
                          key={subLink.name}
                          onClick={() => logTelemetry('nav_link_click', { path: subLink.path, title: subLink.name.toLowerCase() })}
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
                          onClick={() => logTelemetry('nav_link_click', { path: subLink.path, title: subLink.name.toLowerCase() })}
                          to={subLink.path}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-sm transition-colors group/sub"
                        >
                          <SafeIcon icon={subLink.icon} className={`w-4 h-4 ${subLink.color} opacity-70 group-hover/sub:opacity-100 transition-opacity`} />
                          <span className="text-xs font-bold text-zinc-300 group-hover/sub:text-white transition-colors">{subLink.name}</span>
                        </Link>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}


          <GlobalSearch />

          <button
            onClick={() => logTelemetry('global_cart_clicked', { location: 'header' })}
            className="selldone-cart-toggle p-2 text-zinc-400 hover:text-white transition-colors relative"
            aria-label="View Cart"
          >
            <SafeIcon icon={LuIcons.LuShoppingBag} className="w-5 h-5" />
          </button>
          {isAuthenticated ? (
            <div className="flex items-center gap-2 group">
              <Link onClick={() => logTelemetry('header_login_cta_clicked', { state: 'authenticated', identity: getDisplayName() })} to="/profile"
                className="inline-flex items-center gap-2 px-4 py-2 bg-axim-purple/20 border border-axim-purple/50 text-white font-mono text-xs uppercase tracking-widest hover:bg-axim-purple hover:text-white transition-colors rounded-sm shadow-md"
              >
                <SafeIcon className="w-3.5 h-3.5 text-axim-purple group-hover:text-white" icon={LuIcons.LuUserCheck} />
                <span>Hi {getDisplayName()}</span>
              </Link>
              <span className="hidden xl:inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 font-mono text-[8px] text-emerald-400 uppercase tracking-widest rounded-sm select-none pointer-events-none">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                [ECOSYSTEM_SSO: HYBRID_IDENTITY_SYNCED]
              </span>
            </div>
          ) : (
            <Link onClick={() => logTelemetry('header_login_cta_clicked', { state: 'unauthenticated' })} to="/auth"
              className="inline-flex items-center gap-2 px-5 py-2 bg-axim-purple text-white font-black uppercase whitespace-nowrap tracking-widest text-xs hover:bg-white hover:text-black transition-colors rounded-sm shadow-[0_0_15px_rgba(147,51,234,0.3)]"
            >
              <SafeIcon className="w-3.5 h-3.5" icon={LuIcons.LuLogIn} />
              <span>Login</span>
            </Link>
          )}

{isWeb3Authenticated && (
            <span className="hidden xl:inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 font-mono text-[8px] text-emerald-400 uppercase tracking-widest rounded-sm select-none pointer-events-none">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              [AXIM_NODE: DEVELOPMENT_CORE_SYNCED]
            </span>
          )}




        </nav>

        <div className="md:hidden flex items-center gap-2">
          <GlobalSearch />

          <button
            onClick={() => logTelemetry('global_cart_clicked', { location: 'header' })}
            className="selldone-cart-toggle p-2 text-zinc-400 hover:text-white transition-colors relative"
            aria-label="View Cart"
          >
            <SafeIcon icon={LuIcons.LuShoppingBag} className="w-5 h-5" />
          </button>
        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden relative z-[60] p-2 text-zinc-400 hover:text-[#004040] transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <SafeIcon icon={mobileMenuOpen ? LuIcons.LuX : LuIcons.LuMenu} className="w-6 h-6" />
        </button>
        </div>

        {/* Mobile Full-Screen Overlay Navigation */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-[#050505] z-40 flex flex-col pt-24 pb-6 px-6 overflow-y-auto animate-fade-in">
            <div className="flex-1 flex flex-col gap-6">
              {navLinks.map((link) => (
                <div key={link.name} className="flex flex-col border-b border-[#004040]/30 pb-4">
                  <div className="flex justify-between items-center">
                    <Link
                      to={link.path}
                      className="text-xl font-black text-white uppercase tracking-tight"
                    >
                      {link.name}
                    </Link>
                    {link.dropdown && (
                      <button onClick={() => toggleDropdown(link.name)} className="p-2 bg-white/5 rounded-sm text-zinc-400">
                        <SafeIcon icon={activeDropdown === link.name ? LuIcons.LuChevronUp : LuIcons.LuChevronDown} className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Mobile Sub-Links */}
                  {link.dropdown && activeDropdown === link.name && (
                    <div className="mt-4 flex flex-col gap-3 pl-4 border-l border-[#004040]/50">
                      {link.dropdown.map((subLink) => (
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
                      ))}
                    </div>
                  )}
                </div>
              ))}


              <GlobalSearch />
          {isAuthenticated ? (
                <div className="mt-auto pt-4 flex flex-col gap-2">
                  <Link onClick={() => logTelemetry('header_login_cta_clicked', { state: 'authenticated', identity: getDisplayName() })} to="/profile" className="w-full py-4 flex justify-center items-center gap-2 bg-axim-purple/20 border border-axim-purple/50 text-white text-sm font-mono uppercase tracking-widest rounded-sm transition-colors group">
                  <SafeIcon className="w-4 h-4 text-axim-purple group-hover:text-white" icon={LuIcons.LuUserCheck} />
                  <span>Hi {getDisplayName()}</span>
                  </Link>
                </div>
              ) : (
                <div className="mt-auto pt-4 flex flex-col gap-2">
                  <Link onClick={() => logTelemetry('header_login_cta_clicked', { state: 'unauthenticated' })} to="/auth" className="w-full py-4 flex justify-center items-center gap-2 bg-axim-purple text-white font-black text-sm uppercase tracking-widest rounded-sm transition-colors group">
                  <SafeIcon className="w-4 h-4" icon={LuIcons.LuLogIn} />
                  <span>Login</span>
                  </Link>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </header>
    </>
  );
}
