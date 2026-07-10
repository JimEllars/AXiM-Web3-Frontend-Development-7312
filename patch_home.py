import re

with open('src/pages/Home.jsx', 'r') as f:
    content = f.read()

# Locate Daily News feed grid
old_grid = '              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">'
new_grid = '              <div className="flex flex-col gap-6">'

content = content.replace(old_grid, new_grid)

# Map with variant="row"
old_map = '                  dailyNews.map((post) => <ArticleCard article={post} key={post.id}/>)'
new_map = '                  dailyNews.map((post) => <ArticleCard article={post} key={post.id} variant="row" />)'

content = content.replace(old_map, new_map)

with open('src/pages/Home.jsx', 'w') as f:
    f.write(content)

print("Home.jsx patched.")
