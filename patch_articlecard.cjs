const fs = require('fs');

let content = fs.readFileSync('src/components/ArticleCard.jsx', 'utf8');

// Add motion import if not exists
if (!content.includes("import { motion }")) {
  content = content.replace("import React from 'react';", "import React from 'react';\nimport { motion } from 'framer-motion';");
}

// Update media extraction
content = content.replace(
  `let mediaUrl =
    article?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    article?.featured_media_src_url ||
    article?.jetpack_featured_media_url ||
    article?.yoast_head_json?.og_image?.[0]?.url ||
    extractFromContent(article?.content?.rendered) ||
    null;`,
  `let mediaUrl =
    article?.featuredImage ||
    article?.featured_image_src ||
    article?.yoast_head_json?.og_image?.[0]?.url ||
    extractFromContent(article?.content?.rendered) ||
    article?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    article?.jetpack_featured_media_url ||
    null;`
);

// Update image tag to motion.img and apply the requested class
content = content.replace(
  /<img\s+src=\{finalImage\}[\s\S]*?\/>/m,
  `<motion.img\n          src={finalImage}\n          alt={article.title?.rendered || "Article thumbnail"}\n          className="w-full h-48 sm:h-52 object-cover object-center relative z-10 border-b border-white/5"\n          loading={priority ? "eager" : "lazy"}\n          fetchpriority={priority ? "high" : "auto"}\n        />`
);

// We need to move the title out of the upper section to the lower section?
// In the current code, the title is inside the first div:
// {/* Shifted Headline */}
// <h2 className="relative z-20 text-lg sm:text-xl font-black uppercase tracking-tight text-white line-clamp-2 group-hover:text-white transition-colors leading-tight drop-shadow-md">
//   {cleanTitle}
// </h2>

// And the badge is in the lower section:
// <span className="inline-block text-[10px] font-mono tracking-widest text-axim-purple bg-axim-purple/10 border border-axim-purple/20 px-2 py-0.5 rounded-sm uppercase mb-3 self-start relative z-20">
//   {categoryBadge}
// </span>

// Let's remove them and rebuild.
content = content.replace(/\{\/\*\s*Shifted Headline\s*\*\/\}[\s\S]*?<\/h2>/, '');

content = content.replace(
  /<span className="inline-block text-\[10px\] font-mono tracking-widest text-axim-purple bg-axim-purple\/10 border border-axim-purple\/20 px-2 py-0.5 rounded-sm uppercase mb-3 self-start relative z-20">\s*\{categoryBadge\}\s*<\/span>/,
  ''
);

// Now update the lower section container
// <div className={`p-6 flex flex-col flex-grow relative z-10 bg-[#050505] ${isHero ? "md:w-1/2 md:justify-center md:p-10" : ""}`}>
content = content.replace(
  /<div className=\{\`p-6 flex flex-col flex-grow relative z-10 bg-\[\#050505\] \$\{isHero \? "md:w-1\/2 md:justify-center md:p-10" : ""\}\`\}>/,
  `<div className={\`flex flex-col flex-grow relative z-10 bg-[#050505] \${isHero ? "md:w-1/2 md:justify-center md:p-10" : "justify-start pt-2 px-4 pb-0"}\`}>
        <span className="inline-block font-mono text-[10px] tracking-widest text-axim-purple bg-axim-purple/10 border border-axim-purple/20 px-2 py-0.5 rounded-sm uppercase mb-2 self-start">
          {categoryBadge}
        </span>
        <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight line-clamp-2 uppercase text-white mb-2">
          {cleanTitle}
        </h2>`
);

// We should also look at removing any extra padding if present. The instructions say `flex flex-col justify-start pt-2 px-4 pb-0` for the text block layout.

fs.writeFileSync('src/components/ArticleCard.jsx', content);
