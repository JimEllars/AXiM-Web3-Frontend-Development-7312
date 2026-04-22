const fs = require('fs');
let code = fs.readFileSync('src/components/OnyxSearch.jsx', 'utf8');

code = code.replace(
  /<Link\s+key=\{post\.id\}\s+to=\{`\/article\/\$\{post\.slug\}`\}\s+onClick=\{closeModal\}\s+className="([^"]+)"\s+dangerouslySetInnerHTML=\{\{\s+__html:\s+DOMPurify\.sanitize\(post\.title\.rendered\)\s+\}\}\s+\/>/g,
  '<a\n                              key={post.id}\n                              href={`https://wp.axim.us.com/article/${post.slug}`}\n                              onClick={closeModal}\n                              className="$1"\n                              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.title.rendered) }}\n                            />'
);

fs.writeFileSync('src/components/OnyxSearch.jsx', code);
