const fs = require('fs');

let content = fs.readFileSync('src/components/NewsFeed.jsx', 'utf8');

// Ensure explicit isolation mapping using item.categories?.includes(parseInt(categoryId)).

content = content.replace(
  /filteredData = filteredData\.filter\(item => item\.categories && item\.categories\.includes\(categoryId\)\);/g,
  'filteredData = filteredData.filter(item => item.categories && item.categories.includes(parseInt(categoryId)));'
);

content = content.replace(
  /filteredNewData = filteredNewData\.filter\(item => item\.categories && item\.categories\.includes\(categoryId\)\);/g,
  'filteredNewData = filteredNewData.filter(item => item.categories && item.categories.includes(parseInt(categoryId)));'
);

fs.writeFileSync('src/components/NewsFeed.jsx', content);
