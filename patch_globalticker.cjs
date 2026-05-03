const fs = require('fs');
let content = fs.readFileSync('src/components/GlobalTicker.jsx', 'utf8');

content = content.replace(
  'const activeTelemetry = useAximStore(state => state.activeTelemetry) || [];',
  `const activeTelemetry = useAximStore(state => state.activeTelemetry) || [];
  const telemetryStatus = useAximStore(state => state.telemetryStatus);
  const hasLocalBuffer = telemetryStatus === 'LOCAL_BUFFER' || activeTelemetry.some(item => item.type === 'error');`
);

content = content.replace(
  '<span>Telemetry</span>\n      </div>',
  `<span>Telemetry</span>\n      </div>\n\n      {hasLocalBuffer && (\n        <div className="flex-shrink-0 px-4 h-full flex items-center gap-2 z-10 font-mono text-[0.65rem] uppercase tracking-widest text-[#F0FF00] font-bold">\n          <span>[LOCAL_BUFFER_ACTIVE] // AUTONOMOUS_MODE</span>\n        </div>\n      )}`
);

fs.writeFileSync('src/components/GlobalTicker.jsx', content);
