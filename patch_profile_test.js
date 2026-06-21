import fs from 'fs';

const filePath = 'src/pages/Profile.test.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Update useAximStore mock to include isWeb3Authenticated
content = content.replace(
  `userSession: null,
        isSessionLoading: false`,
  `userSession: null,
        isSessionLoading: false,
        isWeb3Authenticated: false,
        walletAddress: null`
);

fs.writeFileSync(filePath, content);
console.log('Patched src/pages/Profile.test.jsx');
