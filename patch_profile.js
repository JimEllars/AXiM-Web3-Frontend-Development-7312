import fs from 'fs';

const filePath = 'src/pages/Profile.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Update tab name
content = content.replace(
  `{activeTab === 'vault' ? 'text-axim-purple border-b-2 border-axim-purple' : 'text-zinc-500 hover:text-white border-b-2 border-transparent'}\`}>
            Digital Assets
          </button>`,
  `{activeTab === 'vault' ? 'text-axim-purple border-b-2 border-axim-purple' : 'text-zinc-500 hover:text-white border-b-2 border-transparent'}\`}>
            Vaulted Documents
          </button>`
);

fs.writeFileSync(filePath, content);
console.log('Patched src/pages/Profile.jsx');
