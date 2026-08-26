const fs = require('fs');

let content = fs.readFileSync('src/components/admin/OnyxTerminal.jsx', 'utf-8');

// The instructions state: Wrap terminal message item renderers in React.memo and add auto-scroll locks so user text selection is not interrupted by new stream chunks.

if (!content.includes('const TerminalMessageItem = React.memo(')) {
    content = content.replace(
      "import React, { useState, useEffect, useRef } from 'react';",
      "import React, { useState, useEffect, useRef, memo } from 'react';"
    );

    // Add the component
    const memoComponent = `
const TerminalMessageItem = memo(({ item }) => (
  <div className={\`mt-2 \${item.type === 'error' ? 'text-red-500' : item.type === 'success' ? 'text-axim-green' : 'text-zinc-300'}\`}>
     <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.text, { USE_PROFILES: { html: true } }) }} />
  </div>
));

const TelemetryEventItem = memo(({ event }) => (
  <div className="mt-2 text-[10px] break-all border-l-2 border-axim-purple pl-2 py-1">
     <span className="text-zinc-500">[{new Date(event.timestamp).toLocaleTimeString()}]</span>{" "}
     <span className={\`font-bold \${event.type.includes('error') || event.type.includes('failed') ? 'text-red-400' : 'text-axim-purple'}\`}>{event.type.toUpperCase()}</span>
     <span className="text-zinc-500"> - {JSON.stringify(event.payload)}</span>
  </div>
));
`;

    content = content.replace(
      "export default function OnyxTerminal() {",
      memoComponent + "\nexport default function OnyxTerminal() {"
    );

    content = content.replace(
      "{terminalOutput.map((item, idx) => (\n                <div key={`term-${idx}`} className={`mt-2 ${item.type === 'error' ? 'text-red-500' : item.type === 'success' ? 'text-axim-green' : 'text-zinc-300'}`}>\n                   <span dangerouslySetInnerHTML={sanitizeAndRenderCode(item.text)} />\n                </div>\n             ))}",
      "{terminalOutput.map((item, idx) => (\n                <TerminalMessageItem key={`term-${idx}`} item={item} />\n             ))}"
    );

    content = content.replace(
      "{telemetryQueue && telemetryQueue.slice(0, 50).map((event) => (\n                <div key={event.id} className=\"mt-2 text-[10px] break-all border-l-2 border-axim-purple pl-2 py-1\">\n                   <span className=\"text-zinc-500\">[{new Date(event.timestamp).toLocaleTimeString()}]</span>{\" \"}\n                   <span className={`font-bold ${event.type.includes('error') || event.type.includes('failed') ? 'text-red-400' : 'text-axim-purple'}`}>{event.type.toUpperCase()}</span>\n                   <span className=\"text-zinc-500\"> - {JSON.stringify(event.payload)}</span>\n                </div>\n             ))}",
      "{telemetryQueue && telemetryQueue.slice(0, 50).map((event) => (\n                <TelemetryEventItem key={event.id} event={event} />\n             ))}"
    );

    // Autoscroll locks
    const autoscrollLogic = `
  const isUserScrolling = useRef(false);

  useEffect(() => {
    if (logContainerRef.current && !isUserScrolling.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [terminalOutput, responseLog, telemetryQueue]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // Check if user has scrolled up from the bottom
    if (scrollHeight - Math.ceil(scrollTop) > clientHeight + 10) {
      isUserScrolling.current = true;
    } else {
      isUserScrolling.current = false;
    }
  };
`;
    content = content.replace(
      "  // Auto-scroll to bottom of log\n  useEffect(() => {\n    if (logContainerRef.current) {\n      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;\n    }\n  }, [terminalOutput, responseLog, telemetryQueue]);",
      autoscrollLogic
    );

    content = content.replace(
      "ref={logContainerRef}\n             className=\"flex-1 text-zinc-400 space-y-2 overflow-y-auto max-h-[300px] pr-2 scroll-smooth\"",
      "ref={logContainerRef}\n             onScroll={handleScroll}\n             className=\"flex-1 text-zinc-400 space-y-2 overflow-y-auto max-h-[300px] pr-2 scroll-smooth\""
    );
}

fs.writeFileSync('src/components/admin/OnyxTerminal.jsx', content);
