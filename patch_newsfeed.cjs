const fs = require('fs');
const file = 'src/components/NewsFeed.jsx';
let content = fs.readFileSync(file, 'utf8');

const searchStr = `             return visibleBriefings.map((article, index) => {
               if (!article || typeof article !== 'object') {
                 return (
                   <div key={\`empty-\${index}\`} className="flex flex-col justify-center items-center p-5 bg-[#050505] border border-white/5 shadow-2xl rounded-sm min-h-[320px]">
                     <span className="text-zinc-600 font-mono text-xs uppercase tracking-widest">Content Unavailable</span>
                   </div>
                 );
               }
               return <ArticleCard key={article.id || \`fallback-\${index}\`} article={article} index={index} />;
             });`;

const replaceStr = `             return visibleBriefings.map((article, index) => {
               try {
                 if (!article || typeof article !== 'object') throw new Error("Malformed article object");
                 return <ArticleCard key={article.id || \`fallback-\${index}\`} article={article} index={index} />;
               } catch (e) {
                 return (
                   <div key={\`error-\${index}\`} className="flex items-center justify-center p-5 bg-[#050505] border border-red-500/20 rounded-sm min-h-[320px]">
                     <span className="text-zinc-600 font-mono text-[10px] uppercase">Content Sync Error</span>
                   </div>
                 );
               }
             });`;

content = content.replace(searchStr, replaceStr);
fs.writeFileSync(file, content);
