const fs = require('fs');

let content = fs.readFileSync('src/lib/telemetry.js', 'utf8');

const target1 = 'batchQueue = [...currentBatch, ...batchQueue].slice(0, 50); // Restore on fail';
const replace1 = 'batchQueue = [...currentBatch, ...batchQueue]; // Restore on fail';

const target2 = 'batchQueue = [...currentBatch, ...batchQueue].slice(0, 50);';
const replace2 = 'batchQueue = [...currentBatch, ...batchQueue];';

content = content.replace(target1, replace1);
content = content.replace(target2, replace2);

const fetchRegex = /else if \(window\.fetch\) \{[\s\S]*?\} catch \(fetchErr\) \{/;
const fetchReplace = `else if (window.fetch) {
        try {
          let retries = 3;
          let backoff = 1000;
          let response = null;

          while (retries > 0) {
            try {
              const fetchPromise = fetch(endpoint, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-AXiM-Internal-Key': import.meta.env.VITE_AXIM_INTERNAL_KEY || 'UNSET_DEV_KEY'
                },
                body: payload,
                keepalive: true,
              });

              const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000));
              response = await Promise.race([fetchPromise, timeoutPromise]);

              if (response.status === 200 || response.status === 202 || response.status === 204) {
                 break;
              } else if (response.status === 429) {
                 throw new Error('Rate limited');
              } else {
                 break;
              }
            } catch(e) {
               retries--;
               if (retries === 0) throw e;
               await new Promise(r => setTimeout(r, backoff));
               backoff *= 2;
            }
          }

          if (response && (response.status === 200 || response.status === 202 || response.status === 204)) {
            success = true;
            try {
              if (response.status !== 204 && response.status !== 202) {
                const responseData = await response.json();
                console.log('[TELEMETRY_SYNC_SUCCESS]', responseData);
              }
            } catch (jsonErr) {
              if (import.meta.env?.MODE !== 'production' && process.env.NODE_ENV !== 'production') { console.warn("Could not parse telemetry response JSON", jsonErr); }
            }
          } else {
            success = false;
          }
        } catch (fetchErr) {`;

content = content.replace(fetchRegex, fetchReplace);
fs.writeFileSync('src/lib/telemetry.js', content);
