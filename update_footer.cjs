const fs = require('fs');
const file = 'src/components/Footer.jsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('const [clickCount, setClickCount] = useState(0);')) {
  content = content.replace(
    /const location = useLocation\(\);/,
    `const [clickCount, setClickCount] = React.useState(0);
  const location = useLocation();`
  );

  content = content.replace(
    /&copy; \{currentYear\} AXiM Systems\. All rights reserved\./,
    `<span onClick={() => setClickCount(prev => prev + 1)} className="cursor-pointer">&copy; {currentYear} AXiM Systems. All rights reserved.</span>`
  );

  content = content.replace(
    /<\/footer>/,
    `  {clickCount >= 5 && (
        <div className="fixed bottom-0 left-0 w-full p-4 bg-red-900 text-white font-mono text-xs z-[9999] overflow-auto max-h-64 border-t border-red-500">
          <strong>[ DIAGNOSTIC PAYLOAD ERROR ]</strong>
          <pre className="mt-2 whitespace-pre-wrap">
            {window.axim_debug_last_error ? JSON.stringify(window.axim_debug_last_error, null, 2) : "No error payloads found in window.axim_debug_last_error."}
          </pre>
        </div>
      )}
    </footer>`
  );

  fs.writeFileSync(file, content);
}
