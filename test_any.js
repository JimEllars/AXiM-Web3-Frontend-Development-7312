const urlsToTry = ['url1', 'url2', 'url3'];

async function tryFetch(url) {
  if (url === 'url1') {
    await new Promise(r => setTimeout(r, 500));
    throw new Error('fail 1');
  }
  if (url === 'url2') {
    await new Promise(r => setTimeout(r, 600));
    throw new Error('fail 2');
  }
  if (url === 'url3') {
    await new Promise(r => setTimeout(r, 200));
    return ['post 1'];
  }
}

async function test() {
  let posts = null;
  let successfulUrl = null;

  try {
    const fetchPromises = urlsToTry.map(async (url) => {
      try {
        const result = await tryFetch(url);
        return { posts: result, url };
      } catch (err) {
        console.warn(`[wp-fetch] Failed fetching from ${url}:`, err.message);
        throw err; // Re-throw to let Promise.any know it failed
      }
    });

    const result = await Promise.any(fetchPromises);
    posts = result.posts;
    successfulUrl = result.url;
    console.info(`[wp-fetch] Successfully connected to WordPress API at: ${successfulUrl}`);
  } catch (err) {
    console.warn(`All WordPress fetch attempts failed.`);
    return [];
  }
  console.log('posts:', posts);
}
test();
