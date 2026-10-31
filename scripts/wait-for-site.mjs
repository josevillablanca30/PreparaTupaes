const base = process.env.PLAYWRIGHT_BASE_URL;
const expected = process.env.GITHUB_SHA;
if (!base || !expected) throw new Error('Deployment URL and commit are required');
const url = new URL('version.json', base.endsWith('/') ? base : base + '/');
url.searchParams.set('revision', expected);
for (let attempt = 1; attempt <= 12; attempt++) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(10000), cache: 'no-store' });
    if (response.ok && (await response.json()).revision === expected) {
      console.log('Public HTTPS deployment matches commit ' + expected);
      process.exit(0);
    }
  } catch (error) { console.log(`Attempt ${attempt}: ${error.message}`); }
  if (attempt < 12) await new Promise(resolve => setTimeout(resolve, 5000));
}
throw new Error('The public site did not serve the deployed commit before timeout');
