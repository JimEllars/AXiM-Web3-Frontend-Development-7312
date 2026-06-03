import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu automatically on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Articles', path: '/articles' },
    {
      name: 'Partners',
      path: '/partners',
      dropdown: [
        // Prioritized Layout: Make -> Chatbase -> Powur Solar -> Powur Agency (Hidden from main nav per strategy)
        { name: 'Make.com Automation', path: '/partners/make', icon: LuIcons.LuCpu, color: 'text-axim-purple' },
        { name: 'Chatbase AI', path: '/partners/chatbase', icon: LuIcons.LuBot, color: 'text-[#DB2777]' },
        { name: 'Powur Solar (Home)', path: '/partners/powur-solar', icon: LuIcons.LuSun, color: 'text-axim-gold' }
      ]
    },
    {
      name: 'Tools',
      path: '/tools',
      dropdown: [
        // Prioritized Layout: Demand Letter / NDA -> Pay Stub
        { name: 'Mutual NDA Generator', path: '/tools/nda', icon: LuIcons.LuShieldCheck, color: 'text-axim-purple' },
        { name: 'Pay Stub System', path: '/tools/paystub', icon: LuIcons.LuFileText, color: 'text-[#DB2777]' }
      ]
    },
    { name: 'Support', path: '/support' }
  ];

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#050505]/90 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">

        {/* Brand Logo Integration */}
        <Link to="/" className="flex items-center gap-3 group z-50">
          <img
            src="https://wp.axim.us.com/wp-content/uploads/2025/06/12.png"
            alt="AXiM Systems"
            className="h-8 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="relative group"
              onMouseEnter={() => link.dropdown && setActiveDropdown(link.name)}
              onMouseLeave={() => link.dropdown && setActiveDropdown(null)}
            >
              <Link
                to={link.path}
                className={`text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-1 ${
                  location.pathname === link.path || location.pathname.startsWith(link.path + '/')
                    ? 'text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {link.name}
                {link.dropdown && <SafeIcon icon={LuIcons.LuChevronDown} className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />}
              </Link>

              {/* Desktop Dropdown Mega-Menu */}
              {link.dropdown && activeDropdown === link.name && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-6 w-64 animate-fade-in-up">
                  <div className="bg-[#0A0A0A] border border-white/10 rounded-sm shadow-2xl p-2 flex flex-col gap-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-axim-purple/5 blur-[30px] pointer-events-none" />

                    {/* Top Level Hub Link */}
                    <Link to={link.path} className="px-4 py-3 text-[0.65rem] font-black uppercase tracking-widest text-zinc-500 hover:text-white border-b border-white/5 mb-1 transition-colors">
                      View All {link.name}
                    </Link>

                    {/* Deep-Dive Funnel Links */}
                    {link.dropdown.map((subLink) => (
                      <Link
                        key={subLink.name}
                        to={subLink.path}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-sm transition-colors group/sub"
                      >
                        <SafeIcon icon={subLink.icon} className={`w-4 h-4 ${subLink.color} opacity-70 group-hover/sub:opacity-100 transition-opacity`} />
                        <span className="text-xs font-bold text-zinc-300 group-hover/sub:text-white transition-colors">{subLink.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          <Link to="/consultation" className="ml-4 px-6 py-2.5 bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm shadow-lg">
            Consultation
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden relative z-50 p-2 text-zinc-400 hover:text-white transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <SafeIcon icon={mobileMenuOpen ? LuIcons.LuX : LuIcons.LuMenu} className="w-6 h-6" />
        </button>

        {/* Mobile Full-Screen Overlay Navigation */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-[#050505] z-40 flex flex-col pt-24 pb-6 px-6 overflow-y-auto animate-fade-in">
            <div className="flex-1 flex flex-col gap-6">
              {navLinks.map((link) => (
                <div key={link.name} className="flex flex-col border-b border-white/5 pb-4">
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
                    <div className="mt-4 flex flex-col gap-3 pl-4 border-l border-white/10">
                      {link.dropdown.map((subLink) => (
                        <Link
                          key={subLink.name}
                          to={subLink.path}
                          className="flex items-center gap-3 py-2"
                        >
                          <SafeIcon icon={subLink.icon} className={`w-4 h-4 ${subLink.color}`} />
                          <span className="text-sm font-bold text-zinc-400 active:text-white">{subLink.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link to="/consultation" className="mt-4 w-full py-4 bg-axim-purple text-white text-center text-sm font-black uppercase tracking-widest rounded-sm shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                Book Consultation
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
