const fs = require('fs');
const file = 'src/components/FeaturedArticles.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /try\s*\{\s*const categoryId = await fetchCategoryBySlug\(categorySlug\);[\s\S]*?\}\s*catch\s*\(error\)\s*\{\s*console\.error\(`\[WP_FEATURED\] Query failed for slug: \$\{categorySlug\}`,\s*error\);\s*if\s*\(isMounted\)\s*setIsLoading\(false\);\s*\}/;

const tryCatchBlock = `try {
        const categoryId = categorySlug ? await fetchCategoryBySlug(categorySlug) : null;
        const params = { per_page: limit };
        if (categoryId) params.categories = categoryId;

        // Post ID Exclusion
        if (excludeIds && excludeIds.length > 0) {
          params.exclude = excludeIds.join(',');
        }

        // Strict Category Exclusion (Prevents Feed Bleed)
        if (excludeCategories && excludeCategories.length > 0) {
          params.categories_exclude = excludeCategories.join(',');
        }

        const data = await fetchPosts(params);
        if (isMounted) {
          setArticles(data || []);
        }
      } catch (error) {
        console.error(\`[WP_FEATURED] Query failed for slug: \${categorySlug}\`, error);
      } finally {
        if (isMounted) setIsLoading(false);
      }`;

content = content.replace(regex, tryCatchBlock);
fs.writeFileSync(file, content);
