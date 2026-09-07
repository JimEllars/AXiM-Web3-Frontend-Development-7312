const fs = require('fs');

const fileContent = fs.readFileSync('src/pages/Home.jsx', 'utf8');

const featuredAppEndIndex = fileContent.indexOf('</section>', fileContent.indexOf('Featured Application Spotlight'));
if (featuredAppEndIndex === -1) {
  console.error('Could not find end of Featured Application Spotlight section');
  process.exit(1);
}

const insertionPoint = featuredAppEndIndex + '</section>'.length;

const newSection = `

        {/* 7. Psychometric Spotlight Section */}
        <section className="bg-gradient-to-r from-slate-900/90 to-[#0F172A] border border-emerald-500/30 rounded-2xl p-8 lg:p-12 shadow-2xl relative overflow-hidden my-16 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] uppercase tracking-widest rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            // PSYCHOMETRIC_CORE: 8-FUNCTION JUNGIAN ARCHITECTURE
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 leading-tight">
            Discover Your <span className="text-emerald-400">Cognitive Blueprint.</span>
          </h2>
          <p className="text-zinc-400 text-base leading-relaxed mb-8 max-w-2xl">
            Move beyond rigid four-letter stereotypes. The AXiM Personality Assessment measures all eight Jungian cognitive functions on a continuous spectrum to decode your authentic mental processing style, stress triggers, and actionable growth protocols.
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-white/5 rounded-md text-xs font-mono text-zinc-300">
              <SafeIcon icon={LuIcons.LuActivity} className="w-3.5 h-3.5 text-emerald-500" /> Continuous Spectrum Precision
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-white/5 rounded-md text-xs font-mono text-zinc-300">
              <SafeIcon icon={LuIcons.LuBrain} className="w-3.5 h-3.5 text-emerald-500" /> Shadow & Stress Mapping
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-white/5 rounded-md text-xs font-mono text-zinc-300">
              <SafeIcon icon={LuIcons.LuNetwork} className="w-3.5 h-3.5 text-emerald-500" /> Executive & Individual Synergy
            </div>
          </div>
          <a
            href="https://axim.us.com/personalitytest/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => logTelemetry('personality_test_click', { source: 'home_featured' })}
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 transform hover:-translate-y-0.5 mt-6"
          >
            Take the Assessment →
          </a>
        </section>
`;

const updatedContent = fileContent.slice(0, insertionPoint) + newSection + fileContent.slice(insertionPoint);

fs.writeFileSync('src/pages/Home.jsx', updatedContent);
console.log('Home.jsx updated with Personality Test section');
