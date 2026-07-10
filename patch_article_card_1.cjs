const fs = require('fs');
let content = fs.readFileSync('src/components/ArticleCard.jsx', 'utf8');

// I will look for the image container and text container structure
content = content.replace(
`        {/* Base Image - GRAYSCALE REMOVED, Opacity Increased to 60% */}
        <motion.img
          src={finalImage}
          alt={article.title?.rendered || "Article thumbnail"}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02] opacity-50 group-hover:opacity-70"
          loading={priority ? "eager" : "lazy"}
          fetchpriority={priority ? "high" : "auto"}
        />`,
`        {/* Base Image - GRAYSCALE REMOVED, Opacity Increased to 60% */}
        <motion.img
          src={finalImage}
          alt={article.title?.rendered || "Article thumbnail"}
          className="absolute inset-0 w-full h-full object-cover object-center scale-100 group-hover:scale-102 opacity-50 group-hover:opacity-60 transition-all duration-700 ease-out border-b border-white/5 relative z-10"
          loading={priority ? "eager" : "lazy"}
          fetchpriority={priority ? "high" : "auto"}
        />`
);

content = content.replace(
`        <h2 className="text-base sm:text-lg lg:text-xl font-black uppercase tracking-tight text-white mt-1 mb-2.5 line-clamp-2 leading-snug group-hover:text-axim-purple transition-colors duration-300">
          {cleanTitle}
        </h2>`,
`        <h2 className="text-base sm:text-lg lg:text-xl font-black uppercase tracking-tight text-white mt-1 mb-2 line-clamp-2 leading-snug group-hover:text-axim-purple transition-colors duration-300">
          {cleanTitle}
        </h2>`
);

fs.writeFileSync('src/components/ArticleCard.jsx', content);
