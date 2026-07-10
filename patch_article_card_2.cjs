const fs = require('fs');
let content = fs.readFileSync('src/components/ArticleCard.jsx', 'utf8');

// I will look for the image container and text container structure
content = content.replace(
`        className={
          variant === 'row'
            ? "flex flex-col sm:flex-row gap-6 bg-[#050505] border border-white/5 p-4 rounded-sm items-center hover:border-axim-purple/30 transition-all duration-300 group relative overflow-hidden h-full"
            : \`group bg-gradient-to-b from-[#090909] to-[#030303] border border-white/5 backdrop-blur-md shadow-2xl hover:border-axim-purple/40 hover:shadow-[0_0_30px_rgba(147,51,234,0.15)] transition-all duration-500 rounded-sm overflow-hidden flex flex-col relative block \${isHero ? "flex flex-col md:flex-row gap-6" : index % 7 === 0 ? "flex flex-col md:flex-row gap-6 min-h-[320px]" : "h-full"}\`
        }`,
`        className={
          variant === 'row'
            ? "flex flex-col sm:flex-row gap-6 bg-[#050505] border border-white/5 p-4 rounded-sm items-center hover:border-axim-purple/30 transition-all duration-300 group relative overflow-hidden h-full"
            : \`group bg-gradient-to-b from-[#090909] to-[#030303] border border-white/5 backdrop-blur-md shadow-2xl hover:border-axim-purple/30 hover:shadow-[0_0_25px_rgba(147,51,234,0.12)] transition-shadow duration-500 rounded-sm overflow-hidden flex flex-col relative block \${isHero ? "flex flex-col md:flex-row gap-6" : index % 7 === 0 ? "flex flex-col md:flex-row gap-6 min-h-[320px]" : "h-full"}\`
        }`
);

content = content.replace(
`        {/* Interactive Neon Hover Ray Overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{
            background: \`radial-gradient(600px circle at \${mousePosition.x}px \${mousePosition.y}px, rgba(147, 51, 234, 0.06), transparent 40%)\`,
          }}
        />`,
`        {/* Interactive Neon Hover Ray Overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{
            background: \`radial-gradient(400px circle at \${mousePosition.x}px \${mousePosition.y}px, rgba(147, 51, 234, 0.05), transparent 40%)\`,
          }}
        />`
);

fs.writeFileSync('src/components/ArticleCard.jsx', content);
