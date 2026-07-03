const fs = require('fs');
const file = 'src/pages/Home.jsx';
let content = fs.readFileSync(file, 'utf8');

// Update fetchDailyNews
content = content.replace(
  /const posts = await fetchPosts\({ categories: 707, per_page: 3, _embed: 1 }\);\s*if \(isMounted\) {\s*setDailyNews\(posts \|\| \[\]\);\s*}/g,
  `const data = await fetchPosts({ categories: 707, per_page: 3, _embed: 1 });
        if (isMounted) {
          setDailyNews(data || []);
        }`
);

// Update render mapping block
content = content.replace(
  /dailyNews\.map\(article => <ArticleCard key={article\.id} article={article} \/>\)/g,
  `dailyNews.map((post) => <ArticleCard article={post} key={post.id}/>)`
);

fs.writeFileSync(file, content);
