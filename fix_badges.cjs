const fs = require('fs');

let chatbotContent = fs.readFileSync('src/components/Chatbot.jsx', 'utf8');

// I'll add a visual status badge to Chatbot.jsx but currently Chatbot just returns null because it relies on the chatbase script.
// I can make it return a badge in the bottom-left corner.
const chatbotRender = `
  // The Chatbase script handles its own UI injection, but we can add a connection badge
  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 rounded-full shadow-lg pointer-events-none">
      <div className="w-2 h-2 rounded-full bg-axim-green animate-pulse" />
      <span className="text-[0.65rem] font-mono text-zinc-400 uppercase tracking-widest">Onyx Edge Connected</span>
    </div>
  );
`;
chatbotContent = chatbotContent.replace("return null; // The Chatbase script handles its own UI injection", chatbotRender);
fs.writeFileSync('src/components/Chatbot.jsx', chatbotContent);

// Add visual status badge logic to OnyxTerminal if not already present
let terminalContent = fs.readFileSync('src/components/admin/OnyxTerminal.jsx', 'utf8');
// It seems OnyxTerminal already has `<span className="text-[0.65rem] font-mono text-axim-purple uppercase tracking-widest">Edge Connected</span>`
// We can dynamically change this based on stream state. I don't see useOnyxStream used in OnyxTerminal though...
