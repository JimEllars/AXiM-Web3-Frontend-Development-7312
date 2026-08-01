const fs = require('fs');
const file = 'src/components/Hero.jsx';
let content = fs.readFileSync(file, 'utf8');

const searchStr = `        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full animate-fade-in-up animation-delay-300">
          <Link
            to="/tools"
            onClick={() => logTelemetry('hero_cta_click', { target: 'tools', label: 'Explore Tools' })}
            className="inline-flex items-center justify-center px-10 py-4 bg-axim-purple text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm shadow-[0_0_30px_rgba(147,51,234,0.3)] w-full sm:w-auto text-center"
          >
            Explore Tools <SafeIcon icon={LuIcons.LuWrench} className="ml-3 w-4 h-4" />
          </Link>
          <Link
            to="/consultation"
            onClick={() => logTelemetry('hero_cta_click', { target: 'consultation', label: 'Book Consultation' })}
            className="inline-flex items-center justify-center px-10 py-4 bg-transparent border border-white/20 text-white text-xs font-black uppercase tracking-widest hover:bg-[#004040] hover:border-[#004040] transition-colors rounded-sm w-full sm:w-auto text-center"
          >
            Consultation <SafeIcon icon={LuIcons.LuPhone} className="ml-3 w-4 h-4" />
          </Link>
        </div>`;

const replaceStr = `        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full animate-fade-in-up animation-delay-300">
          <Link
            to="/tools"
            onClick={() => logTelemetry('hero_cta_click', { target: 'tools', label: 'Explore Tools' })}
            className="inline-flex items-center justify-center px-10 py-4 bg-axim-purple text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm shadow-[0_0_30px_rgba(147,51,234,0.3)] w-full sm:w-auto text-center"
          >
            Explore Tools <SafeIcon icon={LuIcons.LuWrench} className="ml-3 w-4 h-4" />
          </Link>
          <Link
            to="/consultation"
            onClick={() => logTelemetry('hero_cta_click', { target: 'consultation', label: 'Book Consultation' })}
            className="inline-flex items-center justify-center px-10 py-4 bg-transparent border border-white/20 text-white text-xs font-black uppercase tracking-widest hover:bg-[#004040] hover:border-[#004040] transition-colors rounded-sm w-full sm:w-auto text-center"
          >
            Consultation <SafeIcon icon={LuIcons.LuPhone} className="ml-3 w-4 h-4" />
          </Link>
          <Link
            onClick={() => logTelemetry('hero_cta_click', { target: 'games_hub', label: 'Web3 Games' })}
            to="/games"
            className="inline-flex items-center justify-center px-10 py-4 bg-transparent border border-axim-green/50 text-axim-green text-xs font-black uppercase tracking-widest hover:bg-axim-green hover:text-black transition-colors rounded-sm w-full sm:w-auto text-center"
          >
            Web3 Games <SafeIcon className="ml-3 w-4 h-4" icon={LuIcons.LuGamepad2}/>
          </Link>
        </div>`;

content = content.replace(searchStr, replaceStr);
fs.writeFileSync(file, content);
