const fs = require('fs');

let content = fs.readFileSync('src/components/WPImage.jsx', 'utf8');

content = content.replace(
  `  let mediaUrl =
    post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    post?.featured_media_src_url ||
    post?.jetpack_featured_media_url ||
    post?.yoast_head_json?.og_image?.[0]?.url ||
    extractFromContent(post?.content?.rendered) ||
    null;`,
  `  let mediaUrl =
    post?.featuredImage ||
    post?.featured_image_src ||
    post?.yoast_head_json?.og_image?.[0]?.url ||
    extractFromContent(post?.content?.rendered) ||
    post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    post?.jetpack_featured_media_url ||
    null;`
);

fs.writeFileSync('src/components/WPImage.jsx', content);
