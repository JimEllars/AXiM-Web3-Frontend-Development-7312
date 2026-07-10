const fs = require('fs');

let content = fs.readFileSync('src/pages/Articles.jsx', 'utf8');

// Ensure arrays enforce category isolation using explicit filtering and parseInt(categoryId) checks across section mapping.

content = content.replace(
  /const dailyNewsArray = \(dn \|\| \[\]\)\.filter\(post => post\.categories && post\.categories\.includes\(dailyNewsId\)\);/g,
  'const dailyNewsArray = (dn || []).filter(post => post.categories && post.categories.includes(parseInt(dailyNewsId)));'
);

content = content.replace(
  /const cleanFeat = \(feat \|\| \[\]\)\.filter\(post => !dailyNewsIds\.has\(post\.id\) && post\.categories && post\.categories\.includes\(featuredId\)\);/g,
  'const cleanFeat = (feat || []).filter(post => !dailyNewsIds.has(post.id) && post.categories && post.categories.includes(parseInt(featuredId)));'
);

content = content.replace(
  /const cleanApp = \(app \|\| \[\]\)\.filter\(post => !dailyNewsIds\.has\(post\.id\) && post\.categories && post\.categories\.includes\(appSpotlightId\)\);/g,
  'const cleanApp = (app || []).filter(post => !dailyNewsIds.has(post.id) && post.categories && post.categories.includes(parseInt(appSpotlightId)));'
);

fs.writeFileSync('src/pages/Articles.jsx', content);
