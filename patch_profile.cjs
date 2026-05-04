const fs = require('fs');

const path = 'src/pages/Profile.jsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('const [isFlushing, setIsFlushing] = React.useState(false);')) {
  content = content.replace(
    /const \[isSyncing, setIsSyncing\] = React\.useState\(false\);/,
    'const [isSyncing, setIsSyncing] = React.useState(false);\n  const [isFlushing, setIsFlushing] = React.useState(false);'
  );
  fs.writeFileSync(path, content);
}
